# 🗄️ Database Documentation

## 📋 Schema Overview

The database uses PostgreSQL via Supabase with three main tables and a storage bucket for product images.

## 🏗️ Tables

### `products` Table

Stores all product information.

```sql
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
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | DEFAULT gen_random_uuid() |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT NOW() |
| `title` | TEXT | Product name | NOT NULL |
| `description` | TEXT | Product description | Nullable |
| `price` | NUMERIC(10,2) | Product price | NOT NULL, CHECK >= 0 |
| `image_url` | TEXT | Product image URL | Nullable |
| `category` | TEXT | Product category | NOT NULL |
| `stock` | INTEGER | Available stock | NOT NULL, DEFAULT 0, CHECK >= 0 |

### `orders` Table

Stores customer orders and shipping information.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'ready_for_pickup', 'completed')),
  paypal_order_id TEXT UNIQUE
);
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | DEFAULT gen_random_uuid() |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT NOW() |
| `customer_email` | TEXT | Customer email | NOT NULL |
| `customer_name` | TEXT | Customer full name | NOT NULL |
| `shipping_address` | JSONB | Shipping address object | NOT NULL |
| `total_amount` | NUMERIC(10,2) | Order total | NOT NULL |
| `status` | TEXT | Order status | NOT NULL, DEFAULT 'pending' |
| `paypal_order_id` | TEXT | PayPal order ID | UNIQUE, Nullable |

**⚠️ NOTA:** El campo `stripe_payment_id` mencionado en documentación anterior fue reemplazado por `paypal_order_id` en la implementación real.

**shipping_address JSONB structure:**
```json
{
  "address": "123 Main St",
  "city": "New York",
  "postal_code": "10001",
  "country": "US"
}
```

**Order Status Flow:**
```
pending → paid → processing → shipped → completed
                ↓
        ready_for_pickup
```

### `order_items` Table

Stores individual items within orders.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10, 2) NOT NULL
);
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | DEFAULT gen_random_uuid() |
| `order_id` | UUID | Foreign key to orders | NOT NULL, CASCADE DELETE |
| `product_id` | UUID | Foreign key to products | NOT NULL |
| `quantity` | INTEGER | Item quantity | NOT NULL, CHECK > 0 |
| `price_at_purchase` | NUMERIC(10,2) | Price when ordered | NOT NULL |

### `pending_orders` Table

Stores temporary order data during PayPal payment processing.

```sql
CREATE TABLE pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paypal_order_id TEXT UNIQUE NOT NULL,
  order_items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_data JSONB NOT NULL
);
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | DEFAULT gen_random_uuid() |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT NOW() |
| `paypal_order_id` | TEXT | PayPal order ID | UNIQUE, NOT NULL |
| `order_items` | JSONB | Order items data | NOT NULL |
| `total_amount` | NUMERIC(10,2) | Order total | NOT NULL |
| `shipping_data` | JSONB | Shipping information | NOT NULL |

## 🔗 Relationships

### Entity Relationship Diagram
```
products (1) ←─── (many) order_items
   ↑                           ↓
   │                    (many) ───→ orders (1)
   │                           
   └──────────────┐
                  │
            (referenced by)
                  │
   ┌──────────────┘
   ↓
order_items (each item references a product)

pending_orders (temporary, references PayPal orders)
```

### Relationship Details
- **products → order_items**: One-to-many
  - One product can appear in many order items
  - Product price is captured at purchase time in `price_at_purchase`

- **orders → order_items**: One-to-many
  - One order can have many items
  - Deleting an order cascades to delete its items

- **pending_orders → orders**: One-to-one (temporal)
  - Temporary storage during payment processing
  - Deleted after successful payment confirmation

## 🚀 Indexes

Performance optimization indexes:

```sql
-- Product queries by category
CREATE INDEX idx_products_category ON products(category);

-- Available products (stock > 0)
CREATE INDEX idx_products_stock ON products(stock) WHERE stock > 0;

-- Order queries by customer email
CREATE INDEX idx_orders_email ON orders(customer_email);

-- Order queries by status
CREATE INDEX idx_orders_status ON orders(status);

-- Order queries by creation date (newest first)
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order items queries by order
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Order items queries by product
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Pending orders by PayPal order ID
CREATE INDEX idx_pending_orders_paypal ON pending_orders(paypal_order_id);
```

## 🛡️ Row Level Security (RLS)

RLS is enabled on all tables with the following policies:

### Products Table
```sql
-- Public: Anyone can read products
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Admin: Authenticated users can do everything
CREATE POLICY "Admin full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

### Orders Table
```sql
-- Anonymous: Anyone can create orders
CREATE POLICY "Anonymous insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Users: Can read their own orders
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (auth.email() = customer_email);

-- Admin: Authenticated users can do everything
CREATE POLICY "Admin full access" ON orders
  FOR ALL USING (auth.role() = 'authenticated');
```

### Order Items Table
```sql
-- Users: Can read items from their orders
CREATE POLICY "Users read own items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_email = auth.email()
    )
  );

-- Admin: Authenticated users can do everything
CREATE POLICY "Admin full access" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');
```

### Pending Orders Table
```sql
-- System: Service role can manage pending orders
CREATE POLICY "Service role access" ON pending_orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

## 🏪 Storage Bucket

### Product Images Bucket
```sql
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true);
```

### Storage RLS Policies
```sql
-- Public: Anyone can read images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Admin: Authenticated users can upload
CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Admin: Authenticated users can delete
CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

## ⚡ Stored Procedures

### `decrement_stock` Function
Atomically decreases product stock to prevent race conditions.

```sql
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
```

**Usage:**
```sql
SELECT decrement_stock('product-uuid', 2);
```

**When used:**
- Called from PayPal webhook after successful payment
- Ensures atomic stock update
- Prevents overselling

## 📧 Triggers

### `notify_order_status_change` Trigger
Automatically sends email notifications when order status changes.

```sql
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

CREATE TRIGGER on_order_status_update
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_status_change();
```

**When triggered:**
- Any UPDATE that changes the status column
- Doesn't trigger for 'pending' status
- Calls webhook to send appropriate email

## 🌱 Seed Data

10 sample products across different categories:

| Title | Category | Price | Stock |
|-------|----------|-------|-------|
| Wireless Headphones | Electronics | $199.99 | 15 |
| Organic Cotton T-Shirt | Clothing | $29.99 | 50 |
| Smart Watch | Electronics | $299.99 | 8 |
| Leather Wallet | Accessories | $79.99 | 25 |
| Running Shoes | Footwear | $129.99 | 20 |
| Coffee Maker | Home & Kitchen | $89.99 | 12 |
| Backpack | Bags | $59.99 | 18 |
| Bluetooth Speaker | Electronics | $79.99 | 30 |
| Yoga Mat | Sports | $39.99 | 35 |
| Desk Lamp | Home & Kitchen | $49.99 | 22 |

**Note:** These category names must match the keys in `CATEGORY_MAP` in `components/public/FilterButtons.tsx` for proper translation.

## 🔧 Configuration

### Supabase Custom Settings
Set in Supabase Dashboard → Settings → Custom Config:

```sql
app.webhook_url = 'https://yourstore.com'
app.webhook_secret = 'your-secret-key'
```

### Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS http;
```

## ⚠️ PROBLEMAS TÉCNICOS CONOCIDOS

### 1. Bug de Tipos en TypeScript
**Estado:** CRÍTICO - Requiere fix inmediato
**Ubicación:** `types/database.ts` - líneas 50-52
**Problema:** Tipos `Insert` y `Update` para `pending_orders` están definidos como `never`
**Impacto:** Build falla, desarrollo bloqueado
**Solución:** Regenerar tipos de Supabase o corregir manualmente

### 2. Interface CartItem Incompleta  
**Estado:** ALTO - Requiere fix inmediato
**Ubicación:** `types/models.ts` vs `store/cartStore.ts`
**Problema:** El código usa `category` pero el tipo no la incluye
**Impacto:** Error de TypeScript en tiempo de compilación
**Solución:** Agregar `category` a la interface `CartItem`

## 📊 Database Optimization

### Query Performance
- **Category filtering**: Uses `idx_products_category`
- **Stock checking**: Uses `idx_products_stock` for available products
- **Order history**: Uses `idx_orders_email` for customer queries
- **Status filtering**: Uses `idx_orders_status` for admin dashboard

### Best Practices
- Always use specific column selections
- Implement pagination for large datasets
- Use indexes for frequently queried columns
- Consider materialized views for complex analytics

## 🔄 Data Integrity

### Constraints
- **Price validation**: CHECK (price >= 0)
- **Stock validation**: CHECK (stock >= 0)
- **Quantity validation**: CHECK (quantity > 0)
- **Status validation**: CHECK (status IN (...))
- **Unique payments**: paypal_order_id UNIQUE

### Relationships
- **Cascade deletes**: Order items deleted when order is deleted
- **Foreign key constraints**: Ensure referential integrity
- **Transaction safety**: Stock updates use stored procedures