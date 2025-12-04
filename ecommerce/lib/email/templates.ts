/**
 * Email templates for order notifications
 * Uses Resend API for transactional emails
 */

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  items: Array<{
    title: string
    quantity: number
    price: number
  }>
  trackingNumber?: string
  estimatedDelivery?: string
}

/**
 * Base email HTML template with consistent styling
 */
function baseEmailTemplate(content: string, subject: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #374151;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #2563eb;
      color: white;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px;
    }
    .order-details {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .order-details h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .order-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .order-info:last-child {
      margin-bottom: 0;
    }
    .items-list {
      margin: 24px 0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-info {
      flex: 1;
    }
    .item-title {
      font-weight: 500;
      color: #111827;
      margin-bottom: 4px;
    }
    .item-details {
      font-size: 14px;
      color: #6b7280;
    }
    .item-price {
      font-weight: 600;
      color: #111827;
    }
    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      border-top: 2px solid #e5e7eb;
      font-size: 18px;
      font-weight: 600;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      margin: 16px 0;
    }
    .status-confirmed {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-processing {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .status-shipped {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-ready {
      background-color: #e0e7ff;
      color: #3730a3;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      margin: 16px 0;
    }
    .tracking-info {
      background-color: #eff6ff;
      border: 1px solid #2563eb;
      border-radius: 6px;
      padding: 16px;
      margin: 16px 0;
    }
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header, .content {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
  `.trim()
}

/**
 * Order confirmation email template
 */
export function orderConfirmedTemplate(data: OrderEmailData): { subject: string; html: string } {
  const subject = `Order Confirmed - #${data.orderId}`
  
  const content = `
    <div class="header">
      <h1>Order Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      <p>Thank you for your order! We've received your payment and are preparing your items for shipment.</p>
      
      <div class="status-badge status-confirmed">
        ✓ Order Confirmed
      </div>

      <div class="order-details">
        <h3>Order Details</h3>
        <div class="order-info">
          <span><strong>Order Number:</strong></span>
          <span>#${data.orderId}</span>
        </div>
        <div class="order-info">
          <span><strong>Total Amount:</strong></span>
          <span>$${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div class="items-list">
        <h3>Items Ordered</h3>
        ${data.items.map(item => `
          <div class="item">
            <div class="item-info">
              <div class="item-title">${item.title}</div>
              <div class="item-details">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="total">
        <span>Total</span>
        <span>$${data.totalAmount.toFixed(2)}</span>
      </div>

      <p>We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.</p>
    </div>
    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>This is an automated email. Please do not reply to this address.</p>
    </div>
  `

  return {
    subject,
    html: baseEmailTemplate(content, subject)
  }
}

/**
 * Order processing email template
 */
export function orderProcessingTemplate(data: OrderEmailData): { subject: string; html: string } {
  const subject = `Order Processing - #${data.orderId}`
  
  const content = `
    <div class="header">
      <h1>Your Order is Being Processed</h1>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      <p>Great news! Your order is now being processed and prepared for shipment.</p>
      
      <div class="status-badge status-processing">
        🔄 Order Processing
      </div>

      <div class="order-details">
        <h3>Order Details</h3>
        <div class="order-info">
          <span><strong>Order Number:</strong></span>
          <span>#${data.orderId}</span>
        </div>
        <div class="order-info">
          <span><strong>Total Amount:</strong></span>
          <span>$${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <p>Our team is carefully packing your items and preparing them for shipment. You will receive a tracking number via email once your order ships.</p>
      
      <p>Processing typically takes 1-2 business days.</p>
    </div>
    <div class="footer">
      <p>We'll keep you updated on your order status.</p>
      <p>This is an automated email. Please do not reply to this address.</p>
    </div>
  `

  return {
    subject,
    html: baseEmailTemplate(content, subject)
  }
}

/**
 * Order shipped email template
 */
export function orderShippedTemplate(data: OrderEmailData): { subject: string; html: string } {
  const subject = `Order Shipped - #${data.orderId}`
  
  const trackingInfo = data.trackingNumber ? `
    <div class="tracking-info">
      <strong>Tracking Number:</strong> ${data.trackingNumber}<br>
      <strong>Estimated Delivery:</strong> ${data.estimatedDelivery || '3-5 business days'}
    </div>
  ` : ''

  const content = `
    <div class="header">
      <h1>Your Order Has Shipped!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      <p>Exciting news! Your order has left our warehouse and is on its way to you.</p>
      
      <div class="status-badge status-shipped">
        🚚 Order Shipped
      </div>

      <div class="order-details">
        <h3>Order Details</h3>
        <div class="order-info">
          <span><strong>Order Number:</strong></span>
          <span>#${data.orderId}</span>
        </div>
        <div class="order-info">
          <span><strong>Total Amount:</strong></span>
          <span>$${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      ${trackingInfo}

      <p>You can track your package using the tracking number above. Delivery typically takes 3-5 business days.</p>
      
      <p>If you have any questions about your shipment, please contact our customer service team.</p>
    </div>
    <div class="footer">
      <p>Your order is on its way!</p>
      <p>This is an automated email. Please do not reply to this address.</p>
    </div>
  `

  return {
    subject,
    html: baseEmailTemplate(content, subject)
  }
}

/**
 * Order ready for pickup email template
 */
export function orderReadyForPickupTemplate(data: OrderEmailData): { subject: string; html: string } {
  const subject = `Order Ready for Pickup - #${data.orderId}`
  
  const content = `
    <div class="header">
      <h1>Your Order is Ready for Pickup!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      <p>Great news! Your order is ready and waiting for you at our store.</p>
      
      <div class="status-badge status-ready">
        📦 Ready for Pickup
      </div>

      <div class="order-details">
        <h3>Order Details</h3>
        <div class="order-info">
          <span><strong>Order Number:</strong></span>
          <span>#${data.orderId}</span>
        </div>
        <div class="order-info">
          <span><strong>Total Amount:</strong></span>
          <span>$${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div class="tracking-info">
        <strong>Pickup Instructions:</strong><br>
        • Please bring a valid ID and your order confirmation<br>
        • Pickup is available during store hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM<br>
        • Your order will be held for 7 days
      </div>

      <p>If you have any questions about your pickup, please contact us before visiting.</p>
    </div>
    <div class="footer">
      <p>We can't wait to see you!</p>
      <p>This is an automated email. Please do not reply to this address.</p>
    </div>
  `

  return {
    subject,
    html: baseEmailTemplate(content, subject)
  }
}