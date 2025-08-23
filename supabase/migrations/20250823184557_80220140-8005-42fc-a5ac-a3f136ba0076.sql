-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix increment prayer count function with proper search path
CREATE OR REPLACE FUNCTION public.increment_prayer_count(request_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.prayer_requests 
  SET prayer_count = prayer_count + 1 
  WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;