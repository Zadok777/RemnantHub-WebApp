-- Create accountability partnerships table
CREATE TABLE public.accountability_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Create accountability messages table
CREATE TABLE public.accountability_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partnership_id UUID NOT NULL REFERENCES accountability_partnerships(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create praise reports table
CREATE TABLE public.praise_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leader verification table
CREATE TABLE public.leader_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  testimony_of_faith TEXT NOT NULL,
  doctrinal_affirmation TEXT NOT NULL,
  reference_leaders TEXT[] NOT NULL,
  reference_contacts TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.accountability_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountability_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.praise_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_verifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for accountability partnerships
CREATE POLICY "Community members can view partnerships in their communities"
ON public.accountability_partnerships
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM community_members 
  WHERE community_id = accountability_partnerships.community_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create partnerships"
ON public.accountability_partnerships
FOR INSERT
WITH CHECK (auth.uid() IN (user1_id, user2_id));

CREATE POLICY "Partnership members can update"
ON public.accountability_partnerships
FOR UPDATE
USING (auth.uid() IN (user1_id, user2_id));

-- RLS policies for accountability messages
CREATE POLICY "Partnership members can view messages"
ON public.accountability_messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM accountability_partnerships 
  WHERE id = accountability_messages.partnership_id 
  AND auth.uid() IN (user1_id, user2_id)
));

CREATE POLICY "Partnership members can send messages"
ON public.accountability_messages
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM accountability_partnerships 
  WHERE id = accountability_messages.partnership_id 
  AND auth.uid() IN (user1_id, user2_id)
) AND auth.uid() = sender_id);

-- RLS policies for praise reports
CREATE POLICY "Community members can view praise reports"
ON public.praise_reports
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM community_members 
  WHERE community_id = praise_reports.community_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create their own praise reports"
ON public.praise_reports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own praise reports"
ON public.praise_reports
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for leader verifications
CREATE POLICY "Users can view their own verification"
ON public.leader_verifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification"
ON public.leader_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending verification"
ON public.leader_verifications
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Add triggers for updated_at
CREATE TRIGGER update_accountability_partnerships_updated_at
BEFORE UPDATE ON public.accountability_partnerships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_praise_reports_updated_at
BEFORE UPDATE ON public.praise_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();