-- Create regional networks table
CREATE TABLE public.regional_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  region_state TEXT NOT NULL,
  region_city TEXT,
  leader_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.regional_networks ENABLE ROW LEVEL SECURITY;

-- Create policies for regional networks
CREATE POLICY "Anyone can view regional networks" 
ON public.regional_networks 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create regional networks" 
ON public.regional_networks 
FOR INSERT 
WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Network leaders can update their networks" 
ON public.regional_networks 
FOR UPDATE 
USING (auth.uid() = leader_id);

CREATE POLICY "Network leaders can delete their networks" 
ON public.regional_networks 
FOR DELETE 
USING (auth.uid() = leader_id);

-- Create network memberships table
CREATE TABLE public.network_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(network_id, user_id)
);

-- Enable RLS
ALTER TABLE public.network_memberships ENABLE ROW LEVEL SECURITY;

-- Create policies for network memberships
CREATE POLICY "Network members can view memberships in their networks" 
ON public.network_memberships 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.network_memberships nm 
  WHERE nm.network_id = network_memberships.network_id 
  AND nm.user_id = auth.uid()
));

CREATE POLICY "Users can join networks" 
ON public.network_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave networks" 
ON public.network_memberships 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create network discussions table
CREATE TABLE public.network_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.network_discussions ENABLE ROW LEVEL SECURITY;

-- Create policies for network discussions
CREATE POLICY "Network members can view discussions" 
ON public.network_discussions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.network_memberships 
  WHERE network_id = network_discussions.network_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Network members can create discussions" 
ON public.network_discussions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.network_memberships 
    WHERE network_id = network_discussions.network_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own discussions" 
ON public.network_discussions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create network events table
CREATE TABLE public.network_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network_id UUID NOT NULL,
  organizer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.network_events ENABLE ROW LEVEL SECURITY;

-- Create policies for network events
CREATE POLICY "Network members can view events" 
ON public.network_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.network_memberships 
  WHERE network_id = network_events.network_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Network members can create events" 
ON public.network_events 
FOR INSERT 
WITH CHECK (
  auth.uid() = organizer_id 
  AND EXISTS (
    SELECT 1 FROM public.network_memberships 
    WHERE network_id = network_events.network_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Organizers can update their events" 
ON public.network_events 
FOR UPDATE 
USING (auth.uid() = organizer_id);

-- Create multiplication milestones table
CREATE TABLE public.multiplication_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL,
  milestone_type TEXT NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(community_id, milestone_type)
);

-- Enable RLS
ALTER TABLE public.multiplication_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for multiplication milestones
CREATE POLICY "Community members can view milestones" 
ON public.multiplication_milestones 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.community_members 
  WHERE community_id = multiplication_milestones.community_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Leaders can manage milestones" 
ON public.multiplication_milestones 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.communities 
  WHERE id = multiplication_milestones.community_id 
  AND leader_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.communities 
  WHERE id = multiplication_milestones.community_id 
  AND leader_id = auth.uid()
));

-- Add privacy settings to profiles table
ALTER TABLE public.profiles ADD COLUMN privacy_settings JSONB DEFAULT '{
  "share_approximate_location": true,
  "hide_exact_address": false,
  "share_testimonies_publicly": false
}'::jsonb;

-- Create updated_at triggers
CREATE TRIGGER update_regional_networks_updated_at
BEFORE UPDATE ON public.regional_networks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_discussions_updated_at
BEFORE UPDATE ON public.network_discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_events_updated_at
BEFORE UPDATE ON public.network_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.network_memberships 
ADD CONSTRAINT network_memberships_network_id_fkey 
FOREIGN KEY (network_id) REFERENCES public.regional_networks(id) ON DELETE CASCADE;

ALTER TABLE public.network_discussions 
ADD CONSTRAINT network_discussions_network_id_fkey 
FOREIGN KEY (network_id) REFERENCES public.regional_networks(id) ON DELETE CASCADE;

ALTER TABLE public.network_events 
ADD CONSTRAINT network_events_network_id_fkey 
FOREIGN KEY (network_id) REFERENCES public.regional_networks(id) ON DELETE CASCADE;

ALTER TABLE public.multiplication_milestones 
ADD CONSTRAINT multiplication_milestones_community_id_fkey 
FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;