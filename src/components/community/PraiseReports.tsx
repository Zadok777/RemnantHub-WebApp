import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Plus, 
  Clock, 
  User,
  Heart,
  CheckCircle,
  Gift
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PraiseReport {
  id: string;
  community_id: string;
  user_id: string;
  title: string;
  description: string;
  prayer_request_id: string | null;
  created_at: string;
  profiles?: {
    display_name: string;
  } | null;
  prayer_requests?: {
    title: string;
  } | null;
}

interface PrayerRequest {
  id: string;
  title: string;
}

interface PraiseReportsProps {
  communityId: string;
}

const PraiseReports: React.FC<PraiseReportsProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [praiseReports, setPraiseReports] = useState<PraiseReport[]>([]);
  const [userPrayerRequests, setUserPrayerRequests] = useState<PrayerRequest[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkedPrayerRequest, setLinkedPrayerRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPraiseReports();
    if (user) loadUserPrayerRequests();
  }, [communityId, user]);

  const loadPraiseReports = async () => {
    try {
      const { data, error } = await supabase
        .from('praise_reports')
        .select('*')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load profiles and prayer request details
      const reportsWithDetails = await Promise.all(
        (data || []).map(async (report) => {
          const [profileData, prayerRequestData] = await Promise.all([
            supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', report.user_id)
              .maybeSingle(),
            report.prayer_request_id ? 
              supabase
                .from('prayer_requests')
                .select('title')
                .eq('id', report.prayer_request_id)
                .maybeSingle() : 
              Promise.resolve({ data: null })
          ]);

          return {
            ...report,
            profiles: profileData.data,
            prayer_requests: prayerRequestData.data
          };
        })
      );

      setPraiseReports(reportsWithDetails);
    } catch (error) {
      console.error('Error loading praise reports:', error);
      toast({
        title: "Error",
        description: "Failed to load praise reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPrayerRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('id, title')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPrayerRequests(data || []);
    } catch (error) {
      console.error('Error loading user prayer requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('praise_reports')
        .insert({
          community_id: communityId,
          user_id: user.id,
          title,
          description,
          prayer_request_id: linkedPrayerRequest || null
        });

      if (error) throw error;

      toast({
        title: "Praise Report Shared",
        description: "Your testimony has been shared with the community!"
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLinkedPrayerRequest('');
      setShowCreateForm(false);

      // Reload data
      loadPraiseReports();
    } catch (error) {
      console.error('Error submitting praise report:', error);
      toast({
        title: "Error",
        description: "Failed to submit praise report",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading praise reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Praise Reports
          </h3>
          <p className="text-muted-foreground mt-1">
            Share testimonies of God's faithfulness and answered prayers
          </p>
        </div>
        {user && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Share Praise
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Share a Praise Report</CardTitle>
            <CardDescription>
              Tell the community how God has been faithful in your life
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for your praise report"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Testimony</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share how God has answered prayer or shown His faithfulness..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {userPrayerRequests.length > 0 && (
                <div>
                  <Label htmlFor="linked-prayer">Link to Prayer Request (Optional)</Label>
                  <Select value={linkedPrayerRequest} onValueChange={setLinkedPrayerRequest}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a prayer request this answers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None - General Praise</SelectItem>
                      {userPrayerRequests.map((request) => (
                        <SelectItem key={request.id} value={request.id}>
                          {request.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sharing...' : 'Share Praise Report'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            Please sign in to share praise reports and view community testimonies.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {praiseReports.map((report) => (
          <Card key={report.id} className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5 text-amber-500" />
                      {report.title}
                    </CardTitle>
                    {report.prayer_requests && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Answered Prayer
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {report.profiles?.display_name || 'Community Member'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {report.prayer_requests && (
                    <div className="text-sm text-muted-foreground bg-accent/50 p-2 rounded">
                      <span className="font-medium">Related Prayer Request:</span> {report.prayer_requests.title}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{report.description}</p>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="italic">"Give thanks to the Lord, for he is good; his love endures forever." - Psalm 107:1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {praiseReports.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Praise Reports Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share how God has been faithful in your life!
              </p>
              {user && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Share First Praise Report
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PraiseReports;