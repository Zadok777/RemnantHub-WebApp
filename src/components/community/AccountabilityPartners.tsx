import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MessageCircle, 
  Plus,
  CheckCircle,
  Heart,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface AccountabilityPartnership {
  id: string;
  community_id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  partner_profile?: {
    display_name: string;
  };
}

interface AccountabilityMessage {
  id: string;
  partnership_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  sender_profile?: {
    display_name: string;
  };
}

interface CommunityMember {
  user_id: string;
  profiles?: {
    display_name: string;
  } | null;
}

interface AccountabilityPartnersProps {
  communityId: string;
}

const AccountabilityPartners: React.FC<AccountabilityPartnersProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [partnerships, setPartnerships] = useState<AccountabilityPartnership[]>([]);
  const [availableMembers, setAvailableMembers] = useState<CommunityMember[]>([]);
  const [selectedPartnership, setSelectedPartnership] = useState<AccountabilityPartnership | null>(null);
  const [messages, setMessages] = useState<AccountabilityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPartnerRequest, setShowPartnerRequest] = useState(false);

  useEffect(() => {
    loadPartnerships();
    loadAvailableMembers();
  }, [communityId, user]);

  useEffect(() => {
    if (selectedPartnership) {
      loadMessages();
    }
  }, [selectedPartnership]);

  const loadPartnerships = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('accountability_partnerships')
        .select('*')
        .eq('community_id', communityId)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active');

      if (error) throw error;

      // Load partner profiles
      const partnershipsWithProfiles = await Promise.all(
        (data || []).map(async (partnership) => {
          const partnerId = partnership.user1_id === user.id ? partnership.user2_id : partnership.user1_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', partnerId)
            .maybeSingle();

          return {
            ...partnership,
            partner_profile: profile
          };
        })
      );

      setPartnerships(partnershipsWithProfiles);
    } catch (error) {
      console.error('Error loading partnerships:', error);
      toast({
        title: "Error",
        description: "Failed to load accountability partnerships",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableMembers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('community_id', communityId)
        .neq('user_id', user.id);

      if (error) throw error;

      // Load profiles separately
      const membersWithProfiles = await Promise.all(
        (data || []).map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', member.user_id)
            .maybeSingle();

          return {
            user_id: member.user_id,
            profiles: profile
          };
        })
      );

      setAvailableMembers(membersWithProfiles);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedPartnership) return;

    try {
      const { data, error } = await supabase
        .from('accountability_messages')
        .select('*')
        .eq('partnership_id', selectedPartnership.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Load sender profiles
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', message.sender_id)
            .maybeSingle();

          return {
            ...message,
            sender_profile: profile
          };
        })
      );

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleRequestPartner = async () => {
    if (!user || !selectedPartner) return;

    try {
      const { error } = await supabase
        .from('accountability_partnerships')
        .insert({
          community_id: communityId,
          user1_id: user.id,
          user2_id: selectedPartner,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Partner Request Sent",
        description: "Your accountability partnership has been established!"
      });

      setSelectedPartner('');
      setShowPartnerRequest(false);
      loadPartnerships();
    } catch (error) {
      console.error('Error requesting partner:', error);
      toast({
        title: "Error",
        description: "Failed to establish partnership",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPartnership || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('accountability_messages')
        .insert({
          partnership_id: selectedPartnership.id,
          sender_id: user.id,
          message_text: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading accountability partners...</div>;
  }

  if (!user) {
    return (
      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          Please sign in to view accountability partnership features.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Accountability Partners
          </h3>
          <p className="text-muted-foreground mt-1">
            "Confess your faults one to another, and pray one for another" - James 5:16
          </p>
        </div>
        {partnerships.length === 0 && (
          <Button onClick={() => setShowPartnerRequest(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Find Partner
          </Button>
        )}
      </div>

      {showPartnerRequest && (
        <Card>
          <CardHeader>
            <CardTitle>Request Accountability Partner</CardTitle>
            <CardDescription>
              Choose someone from your household of faith to partner with for prayer and mutual encouragement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="partner">Select Partner</Label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a community member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.profiles?.display_name || 'Unknown Member'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRequestPartner} disabled={!selectedPartner}>
                  Establish Partnership
                </Button>
                <Button variant="outline" onClick={() => setShowPartnerRequest(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partnerships List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Partnerships</CardTitle>
          </CardHeader>
          <CardContent>
            {partnerships.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No accountability partnerships yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Partner with someone for prayer and mutual encouragement.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {partnerships.map((partnership) => (
                  <Card 
                    key={partnership.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedPartnership?.id === partnership.id ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedPartnership(partnership)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {partnership.partner_profile?.display_name || 'Unknown Partner'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Partnership established {formatDistanceToNow(new Date(partnership.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Private Messages
            </CardTitle>
            <CardDescription>
              {selectedPartnership ? 
                `Chatting with ${selectedPartnership.partner_profile?.display_name || 'your partner'}` : 
                'Select a partnership to view messages'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPartnership ? (
              <div className="space-y-4">
                <ScrollArea className="h-64 w-full border rounded p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.sender_id === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent'
                          }`}
                        >
                          <p className="text-sm">{message.message_text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select a partnership to start messaging.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountabilityPartners;