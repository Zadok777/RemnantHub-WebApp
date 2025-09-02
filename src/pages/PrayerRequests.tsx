import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Plus, 
  Clock, 
  Users, 
  MessageCircle, 
  AlertCircle,
  Hand,
  Search,
  Trash2,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  is_anonymous: boolean;
  is_urgent: boolean;
  prayer_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string;
  } | null;
}

const PrayerRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [userPrayers, setUserPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'health', label: 'Health & Healing' },
    { value: 'family', label: 'Family' },
    { value: 'work', label: 'Work & Career' },
    { value: 'spiritual', label: 'Spiritual Growth' },
    { value: 'relationship', label: 'Relationships' },
    { value: 'guidance', label: 'Guidance & Wisdom' },
    { value: 'gratitude', label: 'Praise & Gratitude' }
  ];

  useEffect(() => {
    loadPrayerRequests();
    if (user) loadUserPrayers();
  }, [user]);

  const loadPrayerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Load profiles separately to avoid relation issues
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', request.user_id)
            .maybeSingle();
          
          return {
            ...request,
            profiles: profile
          };
        })
      );
      
      setPrayerRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error loading prayer requests:', error);
      toast({
        title: "Error",
        description: "Failed to load prayer requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPrayers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPrayers(data || []);
    } catch (error) {
      console.error('Error loading user prayers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          is_anonymous: isAnonymous,
          is_urgent: isUrgent
        });

      if (error) throw error;

      toast({
        title: "Prayer Request Submitted",
        description: "Your prayer request has been shared with the community."
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('general');
      setIsAnonymous(false);
      setIsUrgent(false);
      setShowCreateForm(false);

      // Reload data
      loadPrayerRequests();
      loadUserPrayers();
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast({
        title: "Error",
        description: "Failed to submit prayer request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (requestId: string) => {
    if (!user) return;

    try {
      // Insert prayer response
      const { error: responseError } = await supabase
        .from('prayer_responses')
        .insert({
          prayer_request_id: requestId,
          user_id: user.id
        });

      if (responseError) {
        if (responseError.code === '23505') {
          toast({
            title: "Already Prayed",
            description: "You've already prayed for this request."
          });
          return;
        }
        throw responseError;
      }

      // Increment prayer count
      await supabase.rpc('increment_prayer_count', { request_id: requestId });

      toast({
        title: "Prayer Added",
        description: "Thank you for praying. Your prayers matter!"
      });

      loadPrayerRequests();
    } catch (error) {
      console.error('Error adding prayer:', error);
      toast({
        title: "Error",
        description: "Failed to record prayer",
        variant: "destructive"
      });
    }
  };

  const handleDeletePrayer = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Prayer Request Deleted",
        description: "Your prayer request has been removed."
      });

      loadUserPrayers();
      loadPrayerRequests();
    } catch (error) {
      console.error('Error deleting prayer request:', error);
      toast({
        title: "Error",
        description: "Failed to delete prayer request",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = prayerRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading prayer requests...</div>
      </div>
    );
  }

  return (
    <div className="page-container bg-spiritual-hands faded-overlay">
      <div className="content-container section-spacing">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-glow">Prayer Requests</h1>
          <p className="text-muted-foreground text-lg">Share your prayer needs and pray for others in our community</p>
        </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Requests</TabsTrigger>
          <TabsTrigger value="my-prayers">My Prayers</TabsTrigger>
        </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Praise Reports Section */}
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Star className="h-5 w-5" />
                  Praise Reports
                </CardTitle>
                <CardDescription>
                  Rejoice with others as they share testimonies of God's faithfulness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
                  View All Praise Reports
                </Button>
              </CardContent>
            </Card>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prayer requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {user && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            )}
          </div>

            {showCreateForm && (
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Share a Prayer Request</CardTitle>
                <CardDescription>Let the community know how they can pray for you</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief title for your prayer request"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Share details about your prayer request..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                      />
                      <Label htmlFor="anonymous">Post anonymously</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="urgent"
                        checked={isUrgent}
                        onCheckedChange={(checked) => setIsUrgent(checked === true)}
                      />
                      <Label htmlFor="urgent">Mark as urgent</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className={`card-hover ${request.is_urgent ? 'border-orange-500' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        {request.is_urgent && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {categories.find(c => c.value === request.category)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          By {request.is_anonymous ? 'Anonymous' : request.profiles?.display_name || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {request.prayer_count} prayers
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{request.description}</p>
                  {user && (
                    <Button 
                      onClick={() => handlePray(request.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Pray for This
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredRequests.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No prayer requests found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-prayers" className="space-y-6">
          {!user ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to view and manage your prayer requests.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {userPrayers.map((prayer) => (
                <Card key={prayer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{prayer.title}</CardTitle>
                          {prayer.is_urgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                          <Badge variant="secondary">
                            {categories.find(c => c.value === prayer.category)?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {prayer.prayer_count} prayers
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{prayer.description}</p>
                    <Button 
                      onClick={() => handleDeletePrayer(prayer.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Prayer
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {userPrayers.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">You haven't submitted any prayer requests yet.</p>
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="mt-4"
                    >
                      Create Your First Prayer Request
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default PrayerRequests;