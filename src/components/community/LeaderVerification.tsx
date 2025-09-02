import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface LeaderVerification {
  id: string;
  user_id: string;
  testimony_of_faith: string;
  doctrinal_affirmation: string;
  reference_leaders: string[];
  reference_contacts: string[];
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
}

const LeaderVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verification, setVerification] = useState<LeaderVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [testimonyOfFaith, setTestimonyOfFaith] = useState('');
  const [doctrinalAffirmation, setDoctrinalAffirmation] = useState('');
  const [referenceLeaders, setReferenceLeaders] = useState(['', '', '']);
  const [referenceContacts, setReferenceContacts] = useState(['', '', '']);

  useEffect(() => {
    if (user) {
      loadVerification();
    }
  }, [user]);

  const loadVerification = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leader_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setVerification(data);
    } catch (error) {
      console.error('Error loading verification:', error);
      toast({
        title: "Error",
        description: "Failed to load verification status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate references
    const validLeaders = referenceLeaders.filter(ref => ref.trim() !== '');
    const validContacts = referenceContacts.filter(ref => ref.trim() !== '');

    if (validLeaders.length < 2) {
      toast({
        title: "Incomplete References",
        description: "Please provide at least 2 leader references",
        variant: "destructive"
      });
      return;
    }

    if (validContacts.length < 2) {
      toast({
        title: "Incomplete Contact Information",
        description: "Please provide contact information for at least 2 references",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('leader_verifications')
        .insert({
          user_id: user.id,
          testimony_of_faith: testimonyOfFaith,
          doctrinal_affirmation: doctrinalAffirmation,
          reference_leaders: validLeaders,
          reference_contacts: validContacts
        });

      if (error) throw error;

      toast({
        title: "Verification Submitted",
        description: "Your leader verification has been submitted for review according to 1 Timothy 3 standards."
      });

      setShowForm(false);
      loadVerification();
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Commended</Badge>;
      case 'pending':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Commended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading verification status...</div>;
  }

  if (!user) {
    return (
      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access leader verification.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Leader Commendation</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          House church leaders are commended according to 1 Timothy 3 standards. This process ensures 
          biblical qualifications for those who would shepherd God's people in intimate gatherings.
        </p>
      </div>

      {verification ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(verification.status)}
                  Leader Verification Status
                </CardTitle>
                <CardDescription>
                  Submitted {formatDistanceToNow(new Date(verification.submitted_at), { addSuffix: true })}
                </CardDescription>
              </div>
              {getStatusBadge(verification.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {verification.status === 'pending' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your verification is currently under review. We will contact your references 
                  and review your submission according to biblical standards for church leadership.
                </AlertDescription>
              </Alert>
            )}

            {verification.status === 'approved' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Congratulations! You have been commended as a house church leader. 
                  You may now plant and lead house church gatherings in the RemnantHub community.
                </AlertDescription>
              </Alert>
            )}

            {verification.status === 'rejected' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your verification was not approved at this time. Please consider growing in the areas 
                  of feedback provided and reapply when ready.
                </AlertDescription>
              </Alert>
            )}

            {verification.notes && (
              <div className="bg-accent/50 p-4 rounded">
                <h4 className="font-medium mb-2">Review Notes</h4>
                <p className="text-sm text-muted-foreground">{verification.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              To lead a house church, you must be commended according to 1 Timothy 3:1-7 standards. 
              This includes demonstrating spiritual maturity, sound doctrine, and having references from other leaders.
            </AlertDescription>
          </Alert>

          {!showForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Begin Verification Process</CardTitle>
                <CardDescription>
                  Submit your testimony, doctrinal affirmation, and leader references for review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Leader Commendation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Leader Verification Application</CardTitle>
                <CardDescription>
                  Complete this application to be considered for house church leadership commendation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="testimony">Testimony of Faith</Label>
                    <Textarea
                      id="testimony"
                      value={testimonyOfFaith}
                      onChange={(e) => setTestimonyOfFaith(e.target.value)}
                      placeholder="Share your testimony of how you came to faith in Christ and your calling to ministry..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctrine">Doctrinal Affirmation</Label>
                    <Textarea
                      id="doctrine"
                      value={doctrinalAffirmation}
                      onChange={(e) => setDoctrinalAffirmation(e.target.value)}
                      placeholder="Affirm your commitment to biblical doctrine including the Trinity, salvation by grace through faith, the authority of Scripture, etc..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <Label>Leader References (At least 2 required)</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Provide references from pastors, elders, or other house church leaders who can vouch for your character and calling.
                    </p>
                    <div className="space-y-3">
                      {referenceLeaders.map((ref, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            value={ref}
                            onChange={(e) => {
                              const newRefs = [...referenceLeaders];
                              newRefs[index] = e.target.value;
                              setReferenceLeaders(newRefs);
                            }}
                            placeholder={`Reference ${index + 1} - Name and Title`}
                          />
                          <Input
                            value={referenceContacts[index]}
                            onChange={(e) => {
                              const newContacts = [...referenceContacts];
                              newContacts[index] = e.target.value;
                              setReferenceContacts(newContacts);
                            }}
                            placeholder="Email or Phone"
                            type="email"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderVerification;