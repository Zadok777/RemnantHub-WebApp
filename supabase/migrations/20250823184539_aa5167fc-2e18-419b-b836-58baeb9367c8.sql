-- Create prayer_requests table
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  prayer_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for prayer requests
CREATE POLICY "Anyone can view active prayer requests" 
ON public.prayer_requests 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own prayer requests" 
ON public.prayer_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests" 
ON public.prayer_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer requests" 
ON public.prayer_requests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create prayer_responses table for people who prayed
CREATE TABLE public.prayer_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID NOT NULL,
  user_id UUID NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prayer_request_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for prayer responses
CREATE POLICY "Users can view prayer responses" 
ON public.prayer_responses 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create prayer responses" 
ON public.prayer_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer responses" 
ON public.prayer_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prayer_requests_updated_at
BEFORE UPDATE ON public.prayer_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment prayer count
CREATE OR REPLACE FUNCTION public.increment_prayer_count(request_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.prayer_requests 
  SET prayer_count = prayer_count + 1 
  WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;