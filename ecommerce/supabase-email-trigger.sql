-- =============================================
-- EMAIL SYSTEM TRIGGERS AND FUNCTIONS
-- =============================================

-- Update the order status change function for better email handling
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := current_setting('app.webhook_url', true);
  secret TEXT := current_setting('app.webhook_secret', true);
  customer_record RECORD;
  order_items_json JSONB;
  email_payload JSONB;
  email_subject TEXT;
  email_html TEXT;
BEGIN
  -- Only send emails for status changes (not for new orders)
  IF NEW.status IS DISTINCT FROM OLD.status AND OLD.status != 'pending' THEN
    
    -- Get customer information
    SELECT customer_name, customer_email 
    INTO customer_record
    FROM orders 
    WHERE id = NEW.id;
    
    -- Get order items
    SELECT jsonb_agg(
      jsonb_build_object(
        'title', p.title,
        'quantity', oi.quantity,
        'price', oi.price
      )
    ) INTO order_items_json
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = NEW.id;
    
    -- Build email payload based on status
    email_payload := jsonb_build_object(
      'orderId', NEW.id,
      'customerName', customer_record.customer_name,
      'customerEmail', customer_record.customer_email,
      'totalAmount', NEW.total_amount,
      'status', NEW.status,
      'items', order_items_json
    );
    
    -- Send email via webhook
    PERFORM net.http_post(
      url := webhook_url || '/api/send-order-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Secret', secret
      ),
      body := jsonb_build_object(
        'to', customer_record.customer_email,
        'subject', CASE 
          WHEN NEW.status = 'processing' THEN 'Order Processing - #' || NEW.id
          WHEN NEW.status = 'shipped' THEN 'Order Shipped - #' || NEW.id
          WHEN NEW.status = 'ready_for_pickup' THEN 'Order Ready for Pickup - #' || NEW.id
          ELSE 'Order Update - #' || NEW.id
        END,
        'html', CASE 
          WHEN NEW.status = 'processing' THEN 
            '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' ||
            '<div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">' ||
            '<h1>Your Order is Being Processed</h1></div>' ||
            '<div style="padding: 20px;">' ||
            '<p>Hi ' || customer_record.customer_name || ',</p>' ||
            '<p>Great news! Your order is now being processed and prepared for shipment.</p>' ||
            '<div style="background: #dbeafe; color: #1e40af; padding: 10px; border-radius: 5px; margin: 20px 0;">' ||
            '🔄 Order Processing</div>' ||
            '<p>Our team is carefully packing your items. You will receive a tracking number once your order ships.</p>' ||
            '<p>Processing typically takes 1-2 business days.</p>' ||
            '</div></div>'
          WHEN NEW.status = 'shipped' THEN 
            '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' ||
            '<div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">' ||
            '<h1>Your Order Has Shipped!</h1></div>' ||
            '<div style="padding: 20px;">' ||
            '<p>Hi ' || customer_record.customer_name || ',</p>' ||
            '<p>Exciting news! Your order has left our warehouse and is on its way to you.</p>' ||
            '<div style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 5px; margin: 20px 0;">' ||
            '🚚 Order Shipped</div>' ||
            '<p>Your package is now in transit. Delivery typically takes 3-5 business days.</p>' ||
            '<p>If you have any questions about your shipment, please contact us.</p>' ||
            '</div></div>'
          WHEN NEW.status = 'ready_for_pickup' THEN 
            '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' ||
            '<div style="background: #8b5cf6; color: white; padding: 20px; text-align: center;">' ||
            '<h1>Your Order is Ready for Pickup!</h1></div>' ||
            '<div style="padding: 20px;">' ||
            '<p>Hi ' || customer_record.customer_name || ',</p>' ||
            '<p>Great news! Your order is ready and waiting for you at our store.</p>' ||
            '<div style="background: #e0e7ff; color: #3730a3; padding: 10px; border-radius: 5px; margin: 20px 0;">' ||
            '📦 Ready for Pickup</div>' ||
            '<div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 5px; padding: 15px; margin: 20px 0;">' ||
            '<strong>Pickup Instructions:</strong><br>' ||
            '• Please bring a valid ID and your order confirmation<br>' ||
            '• Pickup is available during store hours<br>' ||
            '• Your order will be held for 7 days</div>' ||
            '<p>If you have any questions about your pickup, please contact us before visiting.</p>' ||
            '</div></div>'
          ELSE 
            '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' ||
            '<div style="background: #374151; color: white; padding: 20px; text-align: center;">' ||
            '<h1>Order Update</h1></div>' ||
            '<div style="padding: 20px;">' ||
            '<p>Hi ' || customer_record.customer_name || ',</p>' ||
            '<p>There has been an update to your order #' || NEW.id || '.</p>' ||
            '<p><strong>New Status:</strong> ' || NEW.status || '</p>' ||
            '<p>If you have any questions, please contact us.</p>' ||
            '</div></div>'
        END
      )::text
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS on_order_status_update ON orders;

CREATE TRIGGER on_order_status_update
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_status_change();