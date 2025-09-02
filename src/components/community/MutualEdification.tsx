import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, User, Gift, Plus, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MutualEdificationProps {
  communityId: string;
  isLeader: boolean;
}

interface MemberGift {
  id: string;
  user_id: string;
  gift_category: string;
  description: string;
  is_available: boolean;
  profiles?: {
    display_name: string | null;
  } | null;
}

interface Assignment {
  id: string;
  assignment_type: string;
  title: string;
  description: string;
  scheduled_date: string;
  status: string;
  assigned_to: string;
  assigned_by: string;
  profiles?: {
    display_name: string | null;
  } | null;
}

const GIFT_CATEGORIES = [
  'teaching', 'hospitality', 'prophecy', 'mercy', 'administration', 
  'music', 'prayer', 'evangelism', 'counseling', 'children'
];

const ASSIGNMENT_TYPES = [
  'lesson', 'prayer_night', 'shared_meal', 'worship', 'cleanup', 'setup'
];

const MutualEdification: React.FC<MutualEdificationProps> = ({ communityId, isLeader }) => {
  const [gifts, setGifts] = useState<MemberGift[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGift, setShowAddGift] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newGift, setNewGift] = useState({
    gift_category: '',
    description: ''
  });

  const [newAssignment, setNewAssignment] = useState({
    assignment_type: '',
    title: '',
    description: '',
    scheduled_date: '',
    assigned_to: ''
  });

  const [communityMembers, setCommunityMembers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [communityId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load gifts with profiles
      const { data: giftsData, error: giftsError } = await supabase
        .from('member_gifts')
        .select('*')
        .eq('community_id', communityId);

      if (giftsError) throw giftsError;

      // Get profile info for gifts
      const giftsWithProfiles = await Promise.all(
        (giftsData || []).map(async (gift) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', gift.user_id)
            .single();
          
          return {
            ...gift,
            profiles: profile
          };
        })
      );

      setGifts(giftsWithProfiles);

      // Load assignments with profiles
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('community_assignments')
        .select('*')
        .eq('community_id', communityId)
        .order('scheduled_date', { ascending: true });

      if (assignmentsError) throw assignmentsError;

      // Get profile info for assignments
      const assignmentsWithProfiles = await Promise.all(
        (assignmentsData || []).map(async (assignment) => {
          if (!assignment.assigned_to) {
            return { ...assignment, profiles: null };
          }
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', assignment.assigned_to)
            .single();
          
          return {
            ...assignment,
            profiles: profile
          };
        })
      );

      setAssignments(assignmentsWithProfiles);

      // Load community members for assignment dropdown
      if (isLeader) {
        const { data: membersData, error: membersError } = await supabase
          .from('community_members')
          .select('user_id')
          .eq('community_id', communityId);

        if (membersError) throw membersError;

        // Get profile info for members
        const membersWithProfiles = await Promise.all(
          (membersData || []).map(async (member) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', member.user_id)
              .single();
            
            return {
              ...member,
              profiles: profile
            };
          })
        );

        setCommunityMembers(membersWithProfiles);
      }

    } catch (error) {
      console.error('Error loading mutual edification data:', error);
      toast({
        title: "Error",
        description: "Failed to load community data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGift = async () => {
    if (!user || !newGift.gift_category) return;

    try {
      const { error } = await supabase
        .from('member_gifts')
        .insert({
          user_id: user.id,
          community_id: communityId,
          gift_category: newGift.gift_category,
          description: newGift.description
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your gift has been added to the community"
      });

      setNewGift({ gift_category: '', description: '' });
      setShowAddGift(false);
      loadData();
    } catch (error) {
      console.error('Error adding gift:', error);
      toast({
        title: "Error",
        description: "Failed to add your gift",
        variant: "destructive"
      });
    }
  };

  const handleCreateAssignment = async () => {
    if (!user || !newAssignment.assignment_type || !newAssignment.title) return;

    try {
      const { error } = await supabase
        .from('community_assignments')
        .insert({
          community_id: communityId,
          assigned_by: user.id,
          assigned_to: newAssignment.assigned_to || null,
          assignment_type: newAssignment.assignment_type,
          title: newAssignment.title,
          description: newAssignment.description,
          scheduled_date: newAssignment.scheduled_date || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment created successfully"
      });

      setNewAssignment({
        assignment_type: '',
        title: '',
        description: '',
        scheduled_date: '',
        assigned_to: ''
      });
      setShowCreateAssignment(false);
      loadData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive"
      });
    }
  };

  const updateAssignmentStatus = async (assignmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('community_assignments')
        .update({ status })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Assignment ${status}`
      });

      loadData();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mutual Edification</h2>
        <Button onClick={() => setShowAddGift(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Your Gift
        </Button>
      </div>

      {/* Spiritual Gifts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Spiritual Gifts & Service Areas
          </CardTitle>
          <CardDescription>
            Members can share their spiritual gifts and areas of service to build up the body of Christ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gifts.map((gift) => (
              <div key={gift.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {gift.gift_category.replace('_', ' ')}
                  </Badge>
                  {gift.is_available && (
                    <Badge variant="outline" className="text-green-600">
                      Available
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium mb-1">
                  {gift.profiles?.display_name || 'Member'}
                </p>
                {gift.description && (
                  <p className="text-sm text-muted-foreground">{gift.description}</p>
                )}
              </div>
            ))}
          </div>

          {showAddGift && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Add Your Gift</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="gift-category">Gift Category</Label>
                  <Select value={newGift.gift_category} onValueChange={(value) => 
                    setNewGift(prev => ({ ...prev, gift_category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gift area" />
                    </SelectTrigger>
                    <SelectContent>
                      {GIFT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gift-description">Description (optional)</Label>
                  <Textarea
                    id="gift-description"
                    placeholder="Describe your experience or how you'd like to serve..."
                    value={newGift.description}
                    onChange={(e) => setNewGift(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddGift}>Add Gift</Button>
                  <Button variant="outline" onClick={() => setShowAddGift(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Community Assignments
            </div>
            {isLeader && (
              <Button onClick={() => setShowCreateAssignment(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Upcoming lessons, prayer nights, and shared meal responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium capitalize">
                      {assignment.assignment_type.replace('_', ' ')}: {assignment.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {assignment.profiles?.display_name ? 
                        `Assigned to: ${assignment.profiles.display_name}` : 
                        'Open assignment'
                      }
                    </p>
                  </div>
                  <Badge variant={
                    assignment.status === 'completed' ? 'default' :
                    assignment.status === 'accepted' ? 'secondary' :
                    assignment.status === 'declined' ? 'destructive' : 'outline'
                  }>
                    {assignment.status}
                  </Badge>
                </div>
                {assignment.description && (
                  <p className="text-sm mb-2">{assignment.description}</p>
                )}
                {assignment.scheduled_date && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {new Date(assignment.scheduled_date).toLocaleDateString()}
                  </p>
                )}
                {user && assignment.assigned_to === user.id && assignment.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={() => updateAssignmentStatus(assignment.id, 'accepted')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAssignmentStatus(assignment.id, 'declined')}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showCreateAssignment && isLeader && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Create New Assignment</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="assignment-type">Assignment Type</Label>
                  <Select value={newAssignment.assignment_type} onValueChange={(value) => 
                    setNewAssignment(prev => ({ ...prev, assignment_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignment-title">Title</Label>
                  <Input
                    id="assignment-title"
                    placeholder="Assignment title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="assignment-description">Description</Label>
                  <Textarea
                    id="assignment-description"
                    placeholder="Assignment details..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="assigned-to">Assign To (optional)</Label>
                  <Select value={newAssignment.assigned_to} onValueChange={(value) => 
                    setNewAssignment(prev => ({ ...prev, assigned_to: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member (leave empty for open assignment)" />
                    </SelectTrigger>
                    <SelectContent>
                      {communityMembers.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.profiles?.display_name || 'Member'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled-date">Scheduled Date (optional)</Label>
                  <Input
                    id="scheduled-date"
                    type="datetime-local"
                    value={newAssignment.scheduled_date}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, scheduled_date: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateAssignment}>Create Assignment</Button>
                  <Button variant="outline" onClick={() => setShowCreateAssignment(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MutualEdification;