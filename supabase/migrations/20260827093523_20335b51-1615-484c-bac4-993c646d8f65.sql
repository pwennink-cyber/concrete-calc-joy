CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'nieuw',
  customer_type text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  company_name text,
  email text NOT NULL,
  phone text NOT NULL,
  delivery_street text NOT NULL,
  delivery_postcode text NOT NULL,
  delivery_city text NOT NULL,
  billing_same_as_delivery boolean NOT NULL DEFAULT true,
  billing_street text,
  billing_postcode text,
  billing_city text,
  project_type text NOT NULL,
  dimensions jsonb,
  net_volume_m3 numeric(10,2) NOT NULL,
  safety_margin_m3 numeric(10,2) NOT NULL DEFAULT 0,
  order_volume_m3 numeric(10,2) NOT NULL,
  concrete_type text NOT NULL,
  access_within_four_meters text NOT NULL,
  unloading_method text NOT NULL,
  unloading_minutes integer,
  distance_meters integer,
  obstacles text,
  extra_hose_meters integer NOT NULL DEFAULT 0,
  preferred_date date,
  preferred_timeslot text,
  asap boolean NOT NULL DEFAULT false,
  flexible_planning boolean NOT NULL DEFAULT false,
  price_lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal_ex_vat numeric(10,2) NOT NULL,
  vat_amount numeric(10,2) NOT NULL,
  total_inc_vat numeric(10,2) NOT NULL,
  internal_reference text,
  access_notes text,
  project_notes text
);

GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public read of booking requests"
  ON public.booking_requests FOR SELECT TO anon, authenticated USING (false);

CREATE TABLE public.callback_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'nieuw',
  name text NOT NULL,
  phone text NOT NULL,
  preferred_moment text,
  question text
);

GRANT ALL ON public.callback_requests TO service_role;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public read of callback requests"
  ON public.callback_requests FOR SELECT TO anon, authenticated USING (false);

CREATE SEQUENCE public.booking_request_seq START 1;

CREATE OR REPLACE FUNCTION public.next_booking_request_number()
RETURNS text
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'BB-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.booking_request_seq')::text, 6, '0');
$$;