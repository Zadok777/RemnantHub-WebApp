import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Users, 
  Settings as SettingsIcon, 
  Search, 
  Filter,
  MoreVertical,
  UserPlus,
  Shield,
  Image,
  Paperclip,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GroupChatProps {
  communityId?: string;
  regionalNetworkId?: string;
  isLeader?: boolean;
}

interface GroupChat {
  id: string;
  name: string;
  chat_type: 'community' | 'regional_network';
  community_id?: string;
  regional_network_id?: string;
  created_by: string;
  is_active: boolean;
  moderation_settings: {
    require_approval: boolean;
    verified_users_only: boolean;
    allow_media: boolean;
    allow_links: boolean;
  };
  member_count?: number;
}

interface ChatMessage {
  id: string;
  message_text: string;
  message_type: 'text' | 'image' | 'file' | 'link';
  attachment_url?: string;
  is_approved: boolean;
  created_at: string;
  user_id: string;
  user_profile?: {
    display_name: string;
    avatar_url?: string;
  };
}

const GroupChat: React.FC<GroupChatProps> = ({ 
  communityId, 
  regionalNetworkId, 
  isLeader = false 
}) => {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [moderationSettings, setModerationSettings] = useState({
    require_approval: false,
    verified_users_only: false,
    allow_media: true,
    allow_links: true
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGroupChats();
  }, [communityId, regionalNetworkId]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
      setModerationSettings(selectedChat.moderation_settings);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadGroupChats = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('group_chats')
        .select(`
          *,
          group_chat_members:group_chat_members(count)
        `)
        .eq('is_active', true);

      if (communityId) {
        query = query.eq('community_id', communityId);
      } else if (regionalNetworkId) {
        query = query.eq('regional_network_id', regionalNetworkId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const chatsWithCounts = data?.map(chat => ({
        ...chat,
        chat_type: chat.chat_type as 'community' | 'regional_network',
        moderation_settings: chat.moderation_settings as {
          require_approval: boolean;
          verified_users_only: boolean;
          allow_media: boolean;
          allow_links: boolean;
        },
        member_count: chat.group_chat_members?.[0]?.count || 0
      })) || [];

      setGroupChats(chatsWithCounts);
      
      if (chatsWithCounts.length > 0 && !selectedChat) {
        setSelectedChat(chatsWithCounts[0]);
      }
    } catch (error: any) {
      console.error('Error loading group chats:', error);
      toast({
        title: "Error loading chats",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat || !user) return;

    try {
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select('*')
        .eq('group_chat_id', selectedChat.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      const messagesWithProfiles = data?.map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file' | 'link',
        user_profile: { display_name: 'User', avatar_url: undefined } // Simplified for now
      })) || [];

      setMessages(messagesWithProfiles);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert({
          group_chat_id: selectedChat.id,
          user_id: user.id,
          message_text: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages(); // Reload messages to show the new one
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const updateModerationSettings = async () => {
    if (!selectedChat || !isLeader) return;

    try {
      const { error } = await supabase
        .from('group_chats')
        .update({ moderation_settings: moderationSettings })
        .eq('id', selectedChat.id);

      if (error) throw error;

      setSelectedChat(prev => prev ? {
        ...prev,
        moderation_settings: moderationSettings
      } : null);

      toast({
        title: "Settings updated",
        description: "Chat moderation settings have been saved."
      });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(timestamp));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.message_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-background rounded-lg border overflow-hidden">
      {/* Chat List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Group Chats</h3>
            {isLeader && (
              <Button size="sm" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Chat
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search chats..."
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {groupChats.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No group chats yet
              </p>
              <p className="text-sm text-muted-foreground">
                {isLeader ? 'Create the first group chat' : 'Waiting for group chats to be created'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {groupChats.map(chat => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors mb-2 ${
                    selectedChat?.id === chat.id ? 'bg-secondary' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{chat.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {String(chat.member_count)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {chat.chat_type === 'community' ? 'Community Chat' : 'Regional Network'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedChat.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChat.member_count || 0} members • {selectedChat.chat_type.replace('_', ' ')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-9 w-48"
                  />
                </div>
                {isLeader && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Moderation Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="w-4 h-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Moderation Settings Panel */}
            {showSettings && isLeader && (
              <div className="p-4 border-b bg-secondary/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-approval">Require Message Approval</Label>
                    <Switch
                      id="require-approval"
                      checked={moderationSettings.require_approval}
                      onCheckedChange={(checked) =>
                        setModerationSettings(prev => ({ ...prev, require_approval: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verified-only">Verified Users Only</Label>
                    <Switch
                      id="verified-only"
                      checked={moderationSettings.verified_users_only}
                      onCheckedChange={(checked) =>
                        setModerationSettings(prev => ({ ...prev, verified_users_only: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-media">Allow Media</Label>
                    <Switch
                      id="allow-media"
                      checked={moderationSettings.allow_media}
                      onCheckedChange={(checked) =>
                        setModerationSettings(prev => ({ ...prev, allow_media: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-links">Allow Links</Label>
                    <Switch
                      id="allow-links"
                      checked={moderationSettings.allow_links}
                      onCheckedChange={(checked) =>
                        setModerationSettings(prev => ({ ...prev, allow_links: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button size="sm" onClick={updateModerationSettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No messages found' : 'No messages yet. Start the conversation!'}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message, index) => {
                    const isCurrentUser = message.user_id === user?.id;
                    const showDateHeader = index === 0 || 
                      formatDate(message.created_at) !== formatDate(filteredMessages[index - 1].created_at);

                    return (
                      <div key={message.id}>
                        {showDateHeader && (
                          <div className="text-center my-4">
                            <span className="bg-secondary px-3 py-1 rounded-full text-sm text-muted-foreground">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : ''}`}>
                            {!isCurrentUser && (
                              <div className="flex items-center space-x-2 mb-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={message.user_profile?.avatar_url} />
                                  <AvatarFallback className="text-xs">
                                    {message.user_profile?.display_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {message.user_profile?.display_name || 'User'}
                                </span>
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary'
                              }`}
                            >
                              <p className="text-sm">{message.message_text}</p>
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                <span className={`text-xs ${
                                  isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {formatTime(message.created_at)}
                                </span>
                                {isCurrentUser && (
                                  <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <div className="flex-1 flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col space-y-1">
                    {selectedChat.moderation_settings.allow_media && (
                      <Button variant="outline" size="sm" className="px-2">
                        <Image className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="px-2">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                  {sending ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;