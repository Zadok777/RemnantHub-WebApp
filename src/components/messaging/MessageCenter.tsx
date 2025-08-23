import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus,
  Circle,
  CheckCircle2,
  Users,
  Filter
} from 'lucide-react';
import { mockMessages, mockCommunities, mockUsers } from '@/data/mockData';

const MessageCenter = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Group messages by conversation
  const conversations = mockMessages.reduce((acc, message) => {
    const otherUserId = message.fromUserId === '1' ? message.toUserId : message.fromUserId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, typeof mockMessages>);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="h-[600px] bg-background rounded-lg border overflow-hidden">
      <Tabs defaultValue="conversations" className="h-full flex flex-col">
        <div className="border-b p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversations">Messages</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 flex overflow-hidden min-h-0">
          <TabsContent value="conversations" className="flex-1 flex m-0 h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r flex flex-col min-h-0">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {Object.entries(conversations).map(([userId, messages]) => {
                  const lastMessage = messages[messages.length - 1];
                  const user = mockUsers.find(u => u.id === userId);
                  const community = mockCommunities.find(c => c.id === lastMessage.communityId);
                  
                  return (
                    <div
                      key={userId}
                      className={`p-4 border-b cursor-pointer hover:bg-secondary/50 transition-colors ${
                        selectedConversation === userId ? 'bg-secondary' : ''
                      }`}
                      onClick={() => setSelectedConversation(userId)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {user?.name || 'Unknown User'}
                            </p>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                              {!lastMessage.read && (
                                <Circle className="w-2 h-2 fill-primary text-primary" />
                              )}
                            </div>
                          </div>
                          {community && (
                            <p className="text-xs text-primary mb-1">{community.name}</p>
                          )}
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message View */}
            <div className="flex-1 flex flex-col min-h-0">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {mockUsers.find(u => u.id === selectedConversation)?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {mockUsers.find(u => u.id === selectedConversation)?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {conversations[selectedConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.fromUserId === '1' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.fromUserId === '1'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end mt-1 space-x-1">
                            <span className={`text-xs ${
                              message.fromUserId === '1' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.timestamp)}
                            </span>
                            {message.fromUserId === '1' && (
                              <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t flex-shrink-0">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none flex-1"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} size="sm" className="px-3">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="flex-1 m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Community Messages</h3>
                <Button size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-3">
                {mockCommunities.map((community) => (
                  <Card key={community.id} className="community-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{community.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {community.members} members
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect with {community.leader.name} and other community members
                      </p>
                      <Button size="sm" className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Conversation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compose" className="flex-1 m-0 p-4 overflow-y-auto">
            <Card className="max-h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  New Message
                </CardTitle>
                <CardDescription>
                  Start a conversation with a community leader or member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">To</label>
                  <Input placeholder="Search for users or communities..." className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Message subject..." className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Write your message..."
                    className="mt-1 h-32 resize-none"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MessageCenter;