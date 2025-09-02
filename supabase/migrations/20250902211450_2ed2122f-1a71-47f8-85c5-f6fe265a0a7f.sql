-- Create table for spiritual gifts and service areas
CREATE TABLE public.member_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  gift_category TEXT NOT NULL CHECK (gift_category IN ('teaching', 'hospitality', 'prophecy', 'mercy', 'administration', 'music', 'prayer', 'evangelism', 'counseling', 'children')),
  description TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, community_id, gift_category)
);

-- Enable RLS
ALTER TABLE public.member_gifts ENABLE ROW LEVEL SECURITY;

-- RLS policies for member_gifts
CREATE POLICY "Community members can view gifts in their communities"
ON public.member_gifts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.community_members 
    WHERE community_members.community_id = member_gifts.community_id 
    AND community_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own gifts"
ON public.member_gifts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create table for community assignments (lessons, prayer nights, meals)
CREATE TABLE public.community_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL,
  assigned_to UUID,
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('lesson', 'prayer_night', 'shared_meal', 'worship', 'cleanup', 'setup')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for assignments
CREATE POLICY "Community members can view assignments in their communities"
ON public.community_assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.community_members 
    WHERE community_members.community_id = community_assignments.community_id 
    AND community_members.user_id = auth.uid()
  )
);

CREATE POLICY "Leaders can create assignments"
ON public.community_assignments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.communities 
    WHERE communities.id = community_assignments.community_id 
    AND communities.leader_id = auth.uid()
  )
);

CREATE POLICY "Leaders can update assignments"
ON public.community_assignments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.communities 
    WHERE communities.id = community_assignments.community_id 
    AND communities.leader_id = auth.uid()
  )
);

CREATE POLICY "Assigned users can update their assignments"
ON public.community_assignments
FOR UPDATE
USING (auth.uid() = assigned_to);

-- Create table for reading plans
CREATE TABLE public.reading_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  book_of_bible TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for reading plans
CREATE POLICY "Community members can view reading plans in their communities"
ON public.reading_plans
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.community_members 
    WHERE community_members.community_id = reading_plans.community_id 
    AND community_members.user_id = auth.uid()
  )
);

CREATE POLICY "Leaders can manage reading plans"
ON public.reading_plans
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.communities 
    WHERE communities.id = reading_plans.community_id 
    AND communities.leader_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.communities 
    WHERE communities.id = reading_plans.community_id 
    AND communities.leader_id = auth.uid()
  )
);

-- Create table for reading plan portions
CREATE TABLE public.reading_portions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_plan_id UUID NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  reading_text TEXT,
  reflection_questions TEXT[],
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reading_portions ENABLE ROW LEVEL SECURITY;

-- RLS policies for reading portions
CREATE POLICY "Community members can view reading portions"
ON public.reading_portions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reading_plans rp
    JOIN public.community_members cm ON cm.community_id = rp.community_id
    WHERE rp.id = reading_portions.reading_plan_id 
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Leaders can manage reading portions"
ON public.reading_portions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.reading_plans rp
    JOIN public.communities c ON c.id = rp.community_id
    WHERE rp.id = reading_portions.reading_plan_id 
    AND c.leader_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reading_plans rp
    JOIN public.communities c ON c.id = rp.community_id
    WHERE rp.id = reading_portions.reading_plan_id 
    AND c.leader_id = auth.uid()
  )
);

-- Create table for reading discussions
CREATE TABLE public.reading_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_portion_id UUID NOT NULL REFERENCES public.reading_portions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.reading_discussions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reading_discussions ENABLE ROW LEVEL SECURITY;

-- RLS policies for reading discussions
CREATE POLICY "Community members can view discussions"
ON public.reading_discussions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reading_portions rp
    JOIN public.reading_plans rpl ON rpl.id = rp.reading_plan_id
    JOIN public.community_members cm ON cm.community_id = rpl.community_id
    WHERE rp.id = reading_discussions.reading_portion_id 
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Community members can create discussions"
ON public.reading_discussions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reading_portions rp
    JOIN public.reading_plans rpl ON rpl.id = rp.reading_plan_id
    JOIN public.community_members cm ON cm.community_id = rpl.community_id
    WHERE rp.id = reading_discussions.reading_portion_id 
    AND cm.user_id = auth.uid()
  ) AND auth.uid() = user_id
);

CREATE POLICY "Users can update their own discussions"
ON public.reading_discussions
FOR UPDATE
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_member_gifts_updated_at
BEFORE UPDATE ON public.member_gifts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_assignments_updated_at
BEFORE UPDATE ON public.community_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reading_plans_updated_at
BEFORE UPDATE ON public.reading_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reading_discussions_updated_at
BEFORE UPDATE ON public.reading_discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();