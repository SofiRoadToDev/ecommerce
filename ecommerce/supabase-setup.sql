-- =============================================
-- E-COMMERCE DATABASE SETUP FOR SUPABASE
-- =============================================

-- 1. CREATE TABLES
-- =============================================

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- Pending orders table (temporary storage for PayPal orders)
CREATE TABLE pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paypal_order_id TEXT UNIQUE NOT NULL,
  order_items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL, -- {address, city, postal_code, country}
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'ready_for_pickup', 'completed')),
  payment_intent_id TEXT UNIQUE
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- 2. CREATE INDEXES
-- =============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock) WHERE stock > 0;
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- 3. ENABLE RLS (ROW LEVEL SECURITY)
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES
-- =============================================

-- Products policies
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Anonymous insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (auth.email() = customer_email);

CREATE POLICY "Admin full access" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Order items policies
CREATE POLICY "Users read own items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_email = auth.email()
    )
  );

CREATE POLICY "Admin full access" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. STORAGE BUCKET
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage RLS policies
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 6. STORED PROCEDURES
-- =============================================

-- Function to decrement stock atomically
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id AND stock >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. EMAIL NOTIFICATION TRIGGER
-- =============================================

-- Enable http extension for webhook calls
CREATE EXTENSION IF NOT EXISTS http;

-- Function to notify on order status change
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := current_setting('app.webhook_url', true);
  secret TEXT := current_setting('app.webhook_secret', true);
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status != 'pending' THEN
    PERFORM net.http_post(
      url := webhook_url || '/api/send-order-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Secret', secret
      ),
      body := jsonb_build_object(
        'order_id', NEW.id,
        'status', NEW.status,
        'customer_email', NEW.customer_email,
        'customer_name', NEW.customer_name,
        'total_amount', NEW.total_amount
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_order_status_update
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_status_change();

-- 8. SEED DATA - DUMMY PRODUCTS
-- =============================================
INSERT INTO products (title, description, price, image_url, category, stock) VALUES
  ('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 'Electronics', 15),
  ('Organic Cotton T-Shirt', 'Comfortable and sustainable organic cotton t-shirt', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 'Clothing', 50),
  ('Smart Watch', 'Advanced fitness tracking and notification smartwatch', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 'Electronics', 8),
  ('Leather Wallet', 'Handcrafted genuine leather wallet with RFID protection', 79.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop', 'Accessories', 25),
  ('Running Shoes', 'Lightweight running shoes with advanced cushioning', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 'Footwear', 20),
  ('Coffee Maker', 'Programmable coffee maker with thermal carafe', 89.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', 'Home & Kitchen', 12),
  ('Backpack', 'Durable laptop backpack with multiple compartments', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 'Bags', 18),
  ('Bluetooth Speaker', 'Portable waterproof Bluetooth speaker with 360° sound', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 'Electronics', 30),
  ('Yoga Mat', 'Non-slip eco-friendly yoga mat with carrying strap', 39.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 'Sports', 35),
  ('Desk Lamp', 'Adjustable LED desk lamp with USB charging port', 49.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop', 'Home & Kitchen', 22);

-- 9. SETUP INSTRUCTIONS
-- =============================================
-- After running this SQL:
-- 1. Set up environment variables in your .env file
-- 2. Configure Supabase settings in Dashboard → Settings → Custom Config:
--    app.webhook_url = https://yourstore.com
--    app.webhook_secret = your_secret_key
-- 3. Test the setup by visiting your store