import { useState, useEffect } from "react";
import { Book, FileText, Video, Download, ExternalLink, Tag, Filter, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  resource_type: string;
  external_url: string | null;
  content: string | null;
  tags: string[];
  recommended_communities: string[];
  is_approved: boolean;
  created_at: string;
}

const CATEGORIES = [
  { id: "early-church", name: "Early Church History", icon: Book },
  { id: "doctrine", name: "Doctrine & Theology", icon: FileText },
  { id: "house-church", name: "House Church How-To", icon: Video },
  { id: "discipleship", name: "Discipleship Guides", icon: Download },
];

const RESOURCE_TYPES = [
  { id: "article", name: "Article" },
  { id: "book", name: "Book" },
  { id: "video", name: "Video" },
  { id: "audio", name: "Audio/Podcast" },
  { id: "guide", name: "Practical Guide" },
  { id: "template", name: "Template" },
];

export default function ResourceLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    resource_type: "article",
    external_url: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedCategory, searchTerm]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resource_library")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  };

  const submitResource = async () => {
    if (!user) return;

    try {
      const tags = newResource.tags.split(",").map(tag => tag.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from("resource_library")
        .insert([
          {
            ...newResource,
            tags,
            created_by: user.id,
            recommended_communities: [],
          },
        ]);

      if (error) throw error;

      toast({
        title: "Resource Submitted",
        description: "Your resource has been submitted for review",
      });

      setShowSubmitDialog(false);
      setNewResource({
        title: "",
        description: "",
        author: "",
        category: "",
        resource_type: "article",
        external_url: "",
        content: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error submitting resource:", error);
      toast({
        title: "Error",
        description: "Failed to submit resource",
        variant: "destructive",
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "book": return Book;
      case "video": return Video;
      case "audio": return Download;
      default: return FileText;
    }
  };

  const getCategoryResources = (categoryId: string) => {
    return resources.filter(resource => resource.category === categoryId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resource Library</h1>
          <p className="text-muted-foreground mt-2">
            Curated resources for house church leaders, doctrine, and discipleship
          </p>
        </div>
        
        {user && (
          <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Submit Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit a New Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newResource.author}
                    onChange={(e) => setNewResource({ ...newResource, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newResource.category}
                    onValueChange={(value) => setNewResource({ ...newResource, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="resource-type">Resource Type</Label>
                  <Select
                    value={newResource.resource_type}
                    onValueChange={(value) => setNewResource({ ...newResource, resource_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="external-url">External URL (optional)</Label>
                  <Input
                    id="external-url"
                    type="url"
                    value={newResource.external_url}
                    onChange={(e) => setNewResource({ ...newResource, external_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newResource.tags}
                    onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                    placeholder="discipleship, leadership, prayer"
                  />
                </div>
                <Button onClick={submitResource} className="w-full">
                  Submit for Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => {
              const ResourceIcon = getResourceIcon(resource.resource_type);
              return (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  icon={ResourceIcon}
                />
              );
            })}
          </div>
        </TabsContent>

        {CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-muted-foreground">
                {getCategoryDescription(category.id)}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getCategoryResources(category.id).map((resource) => {
                const ResourceIcon = getResourceIcon(resource.resource_type);
                return (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    icon={ResourceIcon}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ResourceCard({ resource, icon: Icon }: { resource: Resource; icon: any }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <Badge variant="secondary">{resource.resource_type}</Badge>
          </div>
          {resource.external_url && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
        </div>
        <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
        <div className="text-sm text-muted-foreground">by {resource.author}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {resource.description}
        </p>
        
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {resource.external_url ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Resource
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getCategoryDescription(categoryId: string): string {
  switch (categoryId) {
    case "early-church":
      return "Learn from the patterns and practices of the first-century church";
    case "doctrine":
      return "Essential theological resources and doctrinal statements";
    case "house-church":
      return "Practical guides for starting and leading house churches";
    case "discipleship":
      return "Resources for making disciples and spiritual formation";
    default:
      return "";
  }
}