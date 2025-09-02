import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Users, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Clock,
  FileText,
  Paperclip,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCommunities } from '@/hooks/useCommunities';

interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: 'community' | 'regional_network' | 'global';
  community_id?: string;
  regional_network_id?: string;
  created_by: string;
  attachment_urls: string[];
  is_published: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expires_at?: string;
  created_at: string;
  updated_at: string;
  community?: {
    name: string;
  };
  regional_network?: {
    name: string;
  };
  creator_profile?: {
    display_name: string;
  };
  is_read?: boolean;
}

interface AnnouncementsSectionProps {
  isLeader?: boolean;
  communityIds?: string[];
  regionalNetworkIds?: string[];
}

const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ 
  isLeader = false,
  communityIds = [],
  regionalNetworkIds = []
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    announcement_type: 'community' as 'community' | 'regional_network',
    target_id: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    expires_at: '',
    is_published: false
  });
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const { userCommunities } = useCommunities();

  useEffect(() => {
    loadAnnouncements();
  }, [communityIds, regionalNetworkIds]);

  const loadAnnouncements = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Add filters for community and network announcements
      if (communityIds.length > 0 || regionalNetworkIds.length > 0) {
        const filters = [];
        if (communityIds.length > 0) {
          filters.push(`community_id.in.(${communityIds.join(',')})`);
        }
        if (regionalNetworkIds.length > 0) {
          filters.push(`regional_network_id.in.(${regionalNetworkIds.join(',')})`);
        }
        filters.push(`announcement_type.eq.global`);
        
        query = query.or(filters.join(','));
      } else {
        // If no specific communities/networks, show global announcements
        query = query.eq('announcement_type', 'global');
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const announcementsWithReadStatus = data?.map(announcement => ({
        ...announcement,
        announcement_type: announcement.announcement_type as 'community' | 'regional_network' | 'global',
        priority: announcement.priority as 'low' | 'normal' | 'high' | 'urgent',
        is_read: false // Simplified for now
      })) || [];

      setAnnouncements(announcementsWithReadStatus);
    } catch (error: any) {
      console.error('Error loading announcements:', error);
      toast({
        title: "Error loading announcements",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async () => {
    if (!user || !formData.title.trim() || !formData.content.trim()) return;

    setCreating(true);
    try {
      const announcementData: any = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        announcement_type: formData.announcement_type,
        created_by: user.id,
        priority: formData.priority,
        is_published: formData.is_published,
        attachment_urls: []
      };

      if (formData.announcement_type === 'community' && formData.target_id) {
        announcementData.community_id = formData.target_id;
      } else if (formData.announcement_type === 'regional_network' && formData.target_id) {
        announcementData.regional_network_id = formData.target_id;
      }

      if (formData.expires_at) {
        announcementData.expires_at = new Date(formData.expires_at).toISOString();
      }

      const { error } = await supabase
        .from('announcements')
        .insert(announcementData);

      if (error) throw error;

      setShowCreateDialog(false);
      setFormData({
        title: '',
        content: '',
        announcement_type: 'community',
        target_id: '',
        priority: 'normal',
        expires_at: '',
        is_published: false
      });
      
      loadAnnouncements();
      
      toast({
        title: "Announcement created",
        description: formData.is_published ? "Your announcement has been published." : "Your announcement has been saved as draft."
      });
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error creating announcement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const markAsRead = async (announcementId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('announcement_reads')
        .upsert({ 
          announcement_id: announcementId, 
          user_id: user.id 
        }, { 
          onConflict: 'announcement_id,user_id' 
        });

      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === announcementId ? { ...ann, is_read: true } : ann
        )
      );
    } catch (error: any) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const unreadCount = announcements.filter(ann => !ann.is_read).length;

  return (
    <Card className="community-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="flex items-center">
              <Megaphone className="w-5 h-5 mr-2" />
              Announcements
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {isLeader && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                  <DialogDescription>
                    Share important news with your community or network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={formData.announcement_type}
                        onValueChange={(value: 'community' | 'regional_network') =>
                          setFormData(prev => ({ ...prev, announcement_type: value, target_id: '' }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="regional_network">Regional Network</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target</Label>
                      <Select
                        value={formData.target_id}
                        onValueChange={(value) =>
                          setFormData(prev => ({ ...prev, target_id: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target..." />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.announcement_type === 'community' && 
                            userCommunities.map(community => (
                              <SelectItem key={community.id} value={community.id}>
                                {community.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Announcement title..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      placeholder="Write your announcement..."
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') =>
                          setFormData(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Expires (optional)</Label>
                      <Input
                        type="datetime-local"
                        value={formData.expires_at}
                        onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="publish"
                        checked={formData.is_published}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, is_published: checked }))
                        }
                      />
                      <Label htmlFor="publish">Publish immediately</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={createAnnouncement} 
                        disabled={creating || !formData.title.trim() || !formData.content.trim()}
                      >
                        {creating ? 'Creating...' : (formData.is_published ? 'Publish' : 'Save Draft')}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No announcements yet
              </p>
              <p className="text-sm text-muted-foreground">
                {isLeader ? 'Create your first announcement' : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map(announcement => (
                <Card 
                  key={announcement.id} 
                  className={`cursor-pointer transition-colors hover:bg-secondary/50 ${
                    !announcement.is_read ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(announcement.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-base">{announcement.title}</CardTitle>
                          {!announcement.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>
                            by Community Leader
                          </span>
                          <span>•</span>
                          <span>{formatDate(announcement.created_at)}</span>
                          {announcement.expires_at && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Expires {formatDate(announcement.expires_at)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        {announcement.announcement_type === 'community' && (
                          <Badge variant="outline">
                            Community
                          </Badge>
                        )}
                        {announcement.announcement_type === 'regional_network' && (
                          <Badge variant="outline">
                            Regional Network
                          </Badge>
                        )}
                        {announcement.announcement_type === 'global' && (
                          <Badge variant="outline">
                            Global
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {announcement.content}
                    </p>
                    {announcement.attachment_urls && announcement.attachment_urls.length > 0 && (
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Paperclip className="w-4 h-4 mr-1" />
                        {announcement.attachment_urls.length} attachment(s)
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsSection;