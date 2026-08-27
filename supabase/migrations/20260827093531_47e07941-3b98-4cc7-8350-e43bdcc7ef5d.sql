REVOKE EXECUTE ON FUNCTION public.next_booking_request_number() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_booking_request_number() TO service_role;