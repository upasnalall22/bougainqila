
CREATE TABLE public.gift_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  enquiry_type text NOT NULL DEFAULT 'enquire',
  service_type text,
  contact_method text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gift_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit gift enquiries"
  ON public.gift_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read gift enquiries"
  ON public.gift_enquiries FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee numeric NOT NULL DEFAULT 0;
