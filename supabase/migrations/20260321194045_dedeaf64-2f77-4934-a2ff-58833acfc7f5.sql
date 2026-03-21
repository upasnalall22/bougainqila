
-- Add salutation, first_name, last_name to customers table
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS salutation text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text;

-- Update existing rows: split 'name' into first_name (keep name as-is for backward compat)
UPDATE public.customers SET first_name = name WHERE first_name IS NULL;

-- Add salutation, first_name, last_name to gift_enquiries table  
ALTER TABLE public.gift_enquiries
  ADD COLUMN IF NOT EXISTS salutation text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS pincode text;

-- Update existing gift_enquiries: split full_name into first_name
UPDATE public.gift_enquiries SET first_name = full_name WHERE first_name IS NULL;
