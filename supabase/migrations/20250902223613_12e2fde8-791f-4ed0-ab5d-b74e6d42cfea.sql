-- Create group chats for communities and regional networks
CREATE TABLE public.group_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  chat_type TEXT NOT NULL CHECK (chat_type IN ('community', 'regional_network')),
  community_id UUID,
  regional_network_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  moderation_settings JSONB DEFAULT '{
    "require_approval": false,
    "verified_users_only": false,
    "allow_media": true,
    "allow_links": true
  }'::jsonb,
  CONSTRAINT chat_type_reference CHECK (
    (chat_type = 'community' AND community_id IS NOT NULL AND regional_network_id IS NULL) OR
    (chat_type = 'regional_network' AND regional_network_id IS NOT NULL AND community_id IS NULL)
  )
);

-- Create group chat messages
CREATE TABLE public.group_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_chat_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'link')),
  attachment_url TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group chat members
CREATE TABLE public.group_chat_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_chat_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_chat_id, user_id)
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL CHECK (announcement_type IN ('community', 'regional_network', 'global')),
  community_id UUID,
  regional_network_id UUID,
  created_by UUID NOT NULL,
  attachment_urls TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT announcement_type_reference CHECK (
    (announcement_type = 'community' AND community_id IS NOT NULL) OR
    (announcement_type = 'regional_network' AND regional_network_id IS NOT NULL) OR
    (announcement_type = 'global')
  )
);

-- Create announcement views/reads tracking
CREATE TABLE public.announcement_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Create private messages table for direct messaging
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for group_chats
CREATE POLICY "Community members can view community chats" 
ON public.group_chats 
FOR SELECT 
USING (
  (chat_type = 'community' AND EXISTS (
    SELECT 1 FROM community_members 
    WHERE community_id = group_chats.community_id 
    AND user_id = auth.uid()
  )) OR
  (chat_type = 'regional_network' AND EXISTS (
    SELECT 1 FROM network_memberships 
    WHERE network_id = group_chats.regional_network_id 
    AND user_id = auth.uid()
  ))
);

CREATE POLICY "Community leaders can create community chats" 
ON public.group_chats 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND (
    (chat_type = 'community' AND EXISTS (
      SELECT 1 FROM communities 
      WHERE id = community_id 
      AND leader_id = auth.uid()
    )) OR
    (chat_type = 'regional_network' AND EXISTS (
      SELECT 1 FROM regional_networks 
      WHERE id = regional_network_id 
      AND leader_id = auth.uid()
    ))
  )
);

CREATE POLICY "Leaders can update their chats" 
ON public.group_chats 
FOR UPDATE 
USING (auth.uid() = created_by);

-- RLS Policies for group_chat_messages
CREATE POLICY "Chat members can view messages" 
ON public.group_chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM group_chat_members 
    WHERE group_chat_id = group_chat_messages.group_chat_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Chat members can send messages" 
ON public.group_chat_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM group_chat_members 
    WHERE group_chat_id = group_chat_messages.group_chat_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.group_chat_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for group_chat_members
CREATE POLICY "Chat members can view membership" 
ON public.group_chat_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM group_chat_members gcm 
    WHERE gcm.group_chat_id = group_chat_members.group_chat_id 
    AND gcm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join chats" 
ON public.group_chat_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave chats" 
ON public.group_chat_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for announcements
CREATE POLICY "Community members can view announcements" 
ON public.announcements 
FOR SELECT 
USING (
  is_published = true AND (
    (announcement_type = 'community' AND EXISTS (
      SELECT 1 FROM community_members 
      WHERE community_id = announcements.community_id 
      AND user_id = auth.uid()
    )) OR
    (announcement_type = 'regional_network' AND EXISTS (
      SELECT 1 FROM network_memberships 
      WHERE network_id = announcements.regional_network_id 
      AND user_id = auth.uid()
    )) OR
    announcement_type = 'global'
  )
);

CREATE POLICY "Leaders can create announcements" 
ON public.announcements 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND (
    (announcement_type = 'community' AND EXISTS (
      SELECT 1 FROM communities 
      WHERE id = community_id 
      AND leader_id = auth.uid()
    )) OR
    (announcement_type = 'regional_network' AND EXISTS (
      SELECT 1 FROM regional_networks 
      WHERE id = regional_network_id 
      AND leader_id = auth.uid()
    ))
  )
);

CREATE POLICY "Creators can manage their announcements" 
ON public.announcements 
FOR ALL 
USING (auth.uid() = created_by) 
WITH CHECK (auth.uid() = created_by);

-- RLS Policies for announcement_reads
CREATE POLICY "Users can track their own reads" 
ON public.announcement_reads 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for private_messages
CREATE POLICY "Users can view their own messages" 
ON public.private_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
ON public.private_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.private_messages 
FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Add updated_at triggers
CREATE TRIGGER update_group_chats_updated_at
BEFORE UPDATE ON public.group_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_chat_messages_updated_at
BEFORE UPDATE ON public.group_chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_private_messages_updated_at
BEFORE UPDATE ON public.private_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_group_chats_community_id ON public.group_chats(community_id);
CREATE INDEX idx_group_chats_regional_network_id ON public.group_chats(regional_network_id);
CREATE INDEX idx_group_chat_messages_chat_id ON public.group_chat_messages(group_chat_id);
CREATE INDEX idx_group_chat_messages_created_at ON public.group_chat_messages(created_at);
CREATE INDEX idx_group_chat_members_chat_id ON public.group_chat_members(group_chat_id);
CREATE INDEX idx_group_chat_members_user_id ON public.group_chat_members(user_id);
CREATE INDEX idx_announcements_community_id ON public.announcements(community_id);
CREATE INDEX idx_announcements_regional_network_id ON public.announcements(regional_network_id);
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at);
CREATE INDEX idx_announcement_reads_announcement_id ON public.announcement_reads(announcement_id);
CREATE INDEX idx_private_messages_sender_id ON public.private_messages(sender_id);
CREATE INDEX idx_private_messages_recipient_id ON public.private_messages(recipient_id);
CREATE INDEX idx_private_messages_created_at ON public.private_messages(created_at);