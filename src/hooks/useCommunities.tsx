import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Community {
  id: string;
  name: string;
  description: string | null;
  meeting_day: string;
  meeting_time: string;
  trust_level: string;
  member_count: number;
  location_city: string;
  location_state: string;
  location_lat: number;
  location_lng: number;
  tags: string[];
  leader_id: string;
  contact_info: any;
  created_at: string;
  updated_at: string;
}

interface UserCommunity extends Community {
  role?: string;
}

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<UserCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load all communities
  const loadCommunities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error: any) {
      console.error('Error loading communities:', error);
      toast({
        title: "Error loading communities",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Load user's communities
  const loadUserCommunities = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          role,
          communities (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const communitiesWithRole = data?.map(item => ({
        ...item.communities,
        role: item.role
      })) || [];

      setUserCommunities(communitiesWithRole);
    } catch (error: any) {
      console.error('Error loading user communities:', error);
      toast({
        title: "Error loading your communities",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Join a community
  const joinCommunity = async (communityId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
          role: 'member'
        });

      if (error) throw error;

      // Increment member count
      const { error: updateError } = await supabase
        .from('communities')
        .update({ 
          member_count: communities.find(c => c.id === communityId)?.member_count + 1 
        })
        .eq('id', communityId);

      if (updateError) console.error('Error updating member count:', updateError);

      // Reload user communities
      await loadUserCommunities(userId);
      await loadCommunities();

      toast({
        title: "Joined community",
        description: "You have successfully joined the community!",
      });
    } catch (error: any) {
      console.error('Error joining community:', error);
      toast({
        title: "Error joining community",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Leave a community
  const leaveCommunity = async (communityId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

      if (error) throw error;

      // Decrement member count
      const community = communities.find(c => c.id === communityId);
      if (community && community.member_count > 0) {
        const { error: updateError } = await supabase
          .from('communities')
          .update({ 
            member_count: community.member_count - 1 
          })
          .eq('id', communityId);

        if (updateError) console.error('Error updating member count:', updateError);
      }

      // Reload user communities
      await loadUserCommunities(userId);
      await loadCommunities();

      toast({
        title: "Left community",
        description: "You have left the community.",
      });
    } catch (error: any) {
      console.error('Error leaving community:', error);
      toast({
        title: "Error leaving community",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Create a new community
  const createCommunity = async (communityData: Partial<Community>, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: communityData.name || '',
          description: communityData.description || '',
          meeting_day: communityData.meeting_day || 'Sunday',
          meeting_time: communityData.meeting_time || '10:00 AM',
          trust_level: communityData.trust_level || 'new',
          location_city: 'Unknown',
          location_state: 'Unknown',
          location_lat: 0,
          location_lng: 0,
          tags: communityData.tags || [],
          leader_id: userId,
          member_count: 1
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as a leader member
      await supabase
        .from('community_members')
        .insert({
          community_id: data.id,
          user_id: userId,
          role: 'leader'
        });

      await loadCommunities();
      await loadUserCommunities(userId);

      toast({
        title: "Community created",
        description: "Your community has been created successfully!",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating community:', error);
      toast({
        title: "Error creating community",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      await loadCommunities();
      setLoading(false);
    };
    
    initLoad();
  }, []);

  return {
    communities,
    userCommunities,
    loading,
    loadCommunities,
    loadUserCommunities,
    joinCommunity,
    leaveCommunity,
    createCommunity
  };
};