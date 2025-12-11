-- Add contact information columns to branding table
ALTER TABLE branding 
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_address TEXT;

-- Drop pending_orders table as requested previously
DROP TABLE IF EXISTS pending_orders;
