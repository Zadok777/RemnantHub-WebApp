import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  MessageSquare, 
  Share2, 
  Heart,
  Calendar,
  BookOpen,
  Shield,
  Camera
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCommunities } from '@/hooks/useCommunities';

const Community = () => {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadCommunity = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setCommunity(data);
      } catch (error) {
        console.error('Error loading community:', error);
        toast({
          title: "Error",
          description: "Failed to load community details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCommunity();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community details...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Community Not Found</h1>
          <p className="text-muted-foreground mb-6">The community you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/search">Back to Search</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Established': return 'bg-green-100 text-green-800';
      case 'Verified': return 'bg-primary/10 text-primary';
      case 'Endorsed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="page-container bg-holy-book faded-overlay">
      <div className="content-container section-spacing">
        {/* Header */}
        <div className="community-card mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{community.name}</h1>
                <Badge className={getTrustLevelColor(community.trust_level)}>
                  <Shield className="w-4 h-4 mr-1" />
                  {community.trust_level}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {community.location_city}, {community.location_state}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {community.member_count} members
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {community.meeting_day}s at {community.meeting_time}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Est. {new Date(community.created_at).getFullYear()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {community.tags && community.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFavorited(!isFavorited)}
                className="flex items-center"
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Leader
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card className="community-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Our Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {community.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Meeting Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            <span className="text-sm">{community.meeting_day}s at {community.meeting_time}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            <span className="text-sm">Max capacity: {community.max_capacity || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          {community.contact_info?.email && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              <span className="text-sm">{community.contact_info.email}</span>
                            </div>
                          )}
                          {community.contact_info?.denomination && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              <span className="text-sm">{community.contact_info.denomination}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leadership">
                <Card className="community-card">
                  <CardHeader>
                    <CardTitle>Leadership Team</CardTitle>
                    <CardDescription>
                      Contact the leadership for more information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        For leadership information and contact details, please reach out through the contact form.
                      </p>
                      <Button className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Community Leader
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <Card className="community-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Community Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Photos will be available once uploaded by the community leader.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card className="community-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Location & Meeting Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <p className="font-medium">{community.location_city}, {community.location_state}</p>
                      <p className="text-muted-foreground">Contact for specific address details</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-medium mb-2">Meeting Time</h4>
                        <p className="text-muted-foreground">{community.meeting_day}s at {community.meeting_time}</p>
                      </div>
                      
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-medium mb-2">Community Size</h4>
                        <p className="text-muted-foreground">{community.member_count} members</p>
                      </div>
                    </div>

                    {/* Placeholder for future interactive map */}
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Interactive map coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="community-card">
              <CardHeader>
                <CardTitle>Ready to Visit?</CardTitle>
                <CardDescription>
                  Connect with our community and join us for fellowship
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  Request to Join
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>
              </CardContent>
            </Card>

            {/* Trust Level Details */}
            <Card className="community-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Trust Level: {community.trust_level}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {community.trust_level === 'Verified' && (
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Leader references verified
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Community information confirmed
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Meeting location verified
                    </div>
                  </div>
                )}
                {community.trust_level === 'New' && (
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Recently created community
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Verification in progress
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="community-card">
              <CardHeader>
                <CardTitle>Get Connected</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/search">
                    Explore More Communities
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/prayer-requests">
                    View Prayer Requests
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;