-- =============================================
-- MIGRATION: Add customer fields to pending_orders
-- =============================================
-- This migration adds customer information to pending_orders table
-- Required for webhook processing after PayPal payment capture

ALTER TABLE pending_orders
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_address JSONB;

-- Add index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_pending_orders_paypal_id
ON pending_orders(paypal_order_id);

-- Add comment
COMMENT ON TABLE pending_orders IS 'Temporary storage for PayPal orders awaiting payment confirmation via webhook';
