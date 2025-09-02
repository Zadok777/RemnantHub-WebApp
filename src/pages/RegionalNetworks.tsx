import { useState, useEffect } from "react";
import { Plus, MessageSquare, Calendar, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RegionalNetwork {
  id: string;
  name: string;
  description: string;
  region_state: string;
  region_city: string;
  leader_id: string;
  created_at: string;
  member_count?: number;
}

interface NetworkDiscussion {
  id: string;
  network_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  profiles?: { display_name: string } | null;
}

interface NetworkEvent {
  id: string;
  network_id: string;
  organizer_id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees: number;
  created_at: string;
  profiles?: { display_name: string } | null;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function RegionalNetworks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [networks, setNetworks] = useState<RegionalNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<RegionalNetwork | null>(null);
  const [discussions, setDiscussions] = useState<NetworkDiscussion[]>([]);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateNetwork, setShowCreateNetwork] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [newNetwork, setNewNetwork] = useState({
    name: "",
    description: "",
    region_state: "",
    region_city: ""
  });

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: ""
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    max_attendees: 20
  });

  useEffect(() => {
    fetchNetworks();
  }, []);

  useEffect(() => {
    if (selectedNetwork) {
      fetchDiscussions(selectedNetwork.id);
      fetchEvents(selectedNetwork.id);
    }
  }, [selectedNetwork]);

  const fetchNetworks = async () => {
    try {
      const { data, error } = await supabase
        .from("regional_networks")
        .select(`
          *,
          network_memberships(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const networksWithCount = data?.map(network => ({
        ...network,
        member_count: network.network_memberships?.[0]?.count || 0
      })) || [];
      
      setNetworks(networksWithCount);
    } catch (error) {
      console.error("Error fetching networks:", error);
      toast({
        title: "Error",
        description: "Failed to load regional networks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async (networkId: string) => {
    try {
      const { data, error } = await supabase
        .from("network_discussions")
        .select("*")
        .eq("network_id", networkId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const fetchEvents = async (networkId: string) => {
    try {
      const { data, error } = await supabase
        .from("network_events")
        .select("*")
        .eq("network_id", networkId)
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const createNetwork = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("regional_networks")
        .insert([
          {
            ...newNetwork,
            leader_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Regional network created successfully",
      });

      setShowCreateNetwork(false);
      setNewNetwork({ name: "", description: "", region_state: "", region_city: "" });
      fetchNetworks();
    } catch (error) {
      console.error("Error creating network:", error);
      toast({
        title: "Error",
        description: "Failed to create network",
        variant: "destructive",
      });
    }
  };

  const joinNetwork = async (networkId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("network_memberships")
        .insert([
          {
            network_id: networkId,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Joined network successfully",
      });

      fetchNetworks();
    } catch (error) {
      console.error("Error joining network:", error);
      toast({
        title: "Error",
        description: "Failed to join network",
        variant: "destructive",
      });
    }
  };

  const createDiscussion = async () => {
    if (!user || !selectedNetwork) return;

    try {
      const { error } = await supabase
        .from("network_discussions")
        .insert([
          {
            ...newDiscussion,
            network_id: selectedNetwork.id,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion created successfully",
      });

      setShowCreateDiscussion(false);
      setNewDiscussion({ title: "", content: "" });
      fetchDiscussions(selectedNetwork.id);
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
    }
  };

  const createEvent = async () => {
    if (!user || !selectedNetwork) return;

    try {
      const { error } = await supabase
        .from("network_events")
        .insert([
          {
            ...newEvent,
            network_id: selectedNetwork.id,
            organizer_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setShowCreateEvent(false);
      setNewEvent({ title: "", description: "", event_date: "", location: "", max_attendees: 20 });
      fetchEvents(selectedNetwork.id);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Regional Networks</h1>
          <p className="text-muted-foreground mt-2">
            Connect with house church leaders in your region for fellowship, support, and resource sharing.
          </p>
        </div>
        
        <Dialog open={showCreateNetwork} onOpenChange={setShowCreateNetwork}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Network
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Regional Network</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="network-name">Network Name</Label>
                <Input
                  id="network-name"
                  value={newNetwork.name}
                  onChange={(e) => setNewNetwork({ ...newNetwork, name: e.target.value })}
                  placeholder="e.g., Central Texas House Churches"
                />
              </div>
              <div>
                <Label htmlFor="network-description">Description</Label>
                <Textarea
                  id="network-description"
                  value={newNetwork.description}
                  onChange={(e) => setNewNetwork({ ...newNetwork, description: e.target.value })}
                  placeholder="Describe the purpose and vision of this network..."
                />
              </div>
              <div>
                <Label htmlFor="network-state">State</Label>
                <Select
                  value={newNetwork.region_state}
                  onValueChange={(value) => setNewNetwork({ ...newNetwork, region_state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="network-city">City (Optional)</Label>
                <Input
                  id="network-city"
                  value={newNetwork.region_city}
                  onChange={(e) => setNewNetwork({ ...newNetwork, region_city: e.target.value })}
                  placeholder="Austin"
                />
              </div>
              <Button onClick={createNetwork} className="w-full">
                Create Network
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!selectedNetwork ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {networks.map((network) => (
            <Card key={network.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{network.name}</span>
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {network.member_count}
                  </Badge>
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {network.region_city ? `${network.region_city}, ` : ""}{network.region_state}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {network.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedNetwork(network)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => joinNetwork(network.id)}
                  >
                    Join Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedNetwork(null)}
            >
              ← Back to Networks
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedNetwork.name}</h2>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedNetwork.region_city ? `${selectedNetwork.region_city}, ` : ""}{selectedNetwork.region_state}
              </div>
            </div>
          </div>

          <Tabs defaultValue="discussions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="discussions">
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Network Discussions</h3>
                <Dialog open={showCreateDiscussion} onOpenChange={setShowCreateDiscussion}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start a Discussion</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="discussion-title">Title</Label>
                        <Input
                          id="discussion-title"
                          value={newDiscussion.title}
                          onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                          placeholder="Discussion topic..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="discussion-content">Content</Label>
                        <Textarea
                          id="discussion-content"
                          value={newDiscussion.content}
                          onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                          placeholder="Share your thoughts, questions, or resources..."
                          rows={4}
                        />
                      </div>
                      <Button onClick={createDiscussion} className="w-full">
                        Post Discussion
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{discussion.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        By Anonymous • {new Date(discussion.created_at).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{discussion.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Network Events</h3>
                <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Network Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input
                          id="event-title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="e.g., Regional Leaders Gathering"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea
                          id="event-description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Event details and agenda..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-date">Date & Time</Label>
                        <Input
                          id="event-date"
                          type="datetime-local"
                          value={newEvent.event_date}
                          onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-location">Location</Label>
                        <Input
                          id="event-location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Address or online meeting link"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-capacity">Max Attendees</Label>
                        <Input
                          id="event-capacity"
                          type="number"
                          value={newEvent.max_attendees}
                          onChange={(e) => setNewEvent({ ...newEvent, max_attendees: parseInt(e.target.value) })}
                        />
                      </div>
                      <Button onClick={createEvent} className="w-full">
                        Create Event
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Organized by Anonymous • {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(event.event_date).toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Max {event.max_attendees}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}