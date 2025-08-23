import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import MessageCenter from '@/components/messaging/MessageCenter';
import { SettingsManager } from '@/components/settings/SettingsManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MapPin, 
  Edit3, 
  Users, 
  Calendar, 
  MessageCircle, 
  Star,
  Settings,
  Heart,
  Church,
  Plus,
  Eye,
  UserPlus,
  MessageSquare,
  Save,
  Loader2
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_state: string | null;
  created_at: string;
  updated_at: string;
}

interface Community {
  id: string;
  name: string;
  description: string | null;
  meeting_day: string;
  meeting_time: string;
  trust_level: string;
  member_count: number;
  role?: string;
}

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location_city: '',
    location_state: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user profile and communities
  useEffect(() => {
    if (user) {
      loadProfile();
      loadCommunities();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          location_city: data.location_city || '',
          location_state: data.location_state || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCommunities = async () => {
    try {
      // Get communities where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select(`
          role,
          communities (
            id,
            name,
            description,
            meeting_day,
            meeting_time,
            trust_level,
            member_count
          )
        `)
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      const communitiesWithRole = memberData?.map(item => ({
        ...item.communities,
        role: item.role
      })) || [];

      setCommunities(communitiesWithRole);
    } catch (error) {
      console.error('Error loading communities:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        email: user.email,
        display_name: formData.display_name || null,
        bio: formData.bio || null,
        location_city: formData.location_city || null,
        location_state: formData.location_state || null
      };

      // Use upsert with onConflict to handle existing profiles
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const location = profile?.location_city && profile?.location_state 
    ? `${profile.location_city}, ${profile.location_state}` 
    : 'Location not set';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and community connections</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <Card className="community-card md:col-span-2">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">Welcome back, {displayName}!</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {profile?.bio || 'No bio added yet. Edit your profile to add a personal bio.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">House Church Member</Badge>
                    <Badge variant="secondary">Fellowship Seeker</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="community-card">
                <CardHeader>
                  <CardTitle className="text-lg">Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Church className="w-5 h-5 text-primary" />
                      <span>Communities</span>
                    </div>
                    <span className="font-semibold">{communities.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span>Connections</span>
                    </div>
                    <span className="font-semibold">{communities.reduce((acc, c) => acc + c.member_count, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Events Attended</span>
                    </div>
                    <span className="font-semibold">{communities.length * 4}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="community-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communities.length > 0 ? (
                      communities.slice(0, 3).map((community, index) => (
                        <div key={community.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="text-sm">
                              {index === 0 && `Joined ${community.name}`}
                              {index === 1 && `Active in ${community.name}`}
                              {index === 2 && `Member of ${community.name}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 && 'Recently'}
                              {index === 1 && 'This week'}
                              {index === 2 && 'Member'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent activity yet. Join a community to get started!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="community-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <a href="/search">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Community
                    </a>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <a href="/search">
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Communities
                    </a>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" disabled>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Friends (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="community-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" disabled>
                      <User className="w-4 h-4 mr-2" />
                      Change Photo (Coming Soon)
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={formData.display_name} 
                      onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_city">City</Label>
                    <Input 
                      id="location_city" 
                      value={formData.location_city} 
                      onChange={(e) => setFormData({...formData, location_city: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_state">State</Label>
                    <Input 
                      id="location_state" 
                      value={formData.location_state} 
                      onChange={(e) => setFormData({...formData, location_state: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell others about yourself and your faith journey..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input 
                    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently joined'} 
                    disabled
                    className="bg-muted"
                  />
                </div>

                {isEditing && (
                  <div className="flex space-x-3">
                    <Button onClick={saveProfile} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        display_name: profile?.display_name || '',
                        bio: profile?.bio || '',
                        location_city: profile?.location_city || '',
                        location_state: profile?.location_state || ''
                      });
                    }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Communities</h2>
              <Button asChild>
                <a href="/search">
                  <Plus className="w-4 h-4 mr-2" />
                  Join New Community
                </a>
              </Button>
            </div>

            <div className="grid gap-6">
              {communities.length > 0 ? (
                communities.map((community) => (
                  <Card key={community.id} className="community-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{community.name}</CardTitle>
                          <CardDescription>
                            {community.role} • Meets {community.meeting_day}s at {community.meeting_time}
                          </CardDescription>
                        </div>
                        <Badge 
                          className={
                            community.trust_level === 'Verified' ? 'bg-green-100 text-green-800' :
                            community.trust_level === 'Established' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {community.trust_level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {community.member_count} members
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {community.meeting_day}s at {community.meeting_time}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {community.description || 'A Christ-centered community gathering in homes for fellowship and worship.'}
                      </p>
                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Messages
                        </Button>
                        {community.role === 'leader' && (
                          <Button variant="outline" className="flex-1">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="community-card text-center py-12">
                  <CardContent>
                    <Church className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <CardTitle className="mb-2">No Communities Yet</CardTitle>
                    <CardDescription className="mb-4">
                      You haven't joined any communities yet. Start by browsing or creating a new house church community.
                    </CardDescription>
                    <Button asChild>
                      <a href="/search">
                        <Eye className="w-4 h-4 mr-2" />
                        Browse Communities
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="community-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Messages</h2>
                  <p className="text-muted-foreground">
                    Connect with community leaders and members
                  </p>
                </div>
                <Button onClick={() => {
                  const messagesTab = document.querySelector('[data-state="inactive"][value="messages"]') as HTMLElement;
                  if (messagesTab) messagesTab.click();
                }}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </div>
              
              <MessageCenter />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="community-card">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and privacy settings</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsManager 
                  onSettingsChange={(settings) => {
                    console.log('Settings updated:', settings);
                  }}
                />

                <div className="pt-6 border-t mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                    <Button variant="destructive" onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        toast({
                          title: "Account deletion",
                          description: "This feature is not yet implemented.",
                          variant: "destructive"
                        });
                      }
                    }}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;