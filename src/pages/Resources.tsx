import { useEffect, useState } from "react";
import { ExternalLink, Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Resource {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  publication_date: string;
  tags: string[];
  resource_url: string;
  icon: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { toast } = useToast();

  const categories = [
    "all",
    "Gospels & Acts",
    "Pauline & General Epistles", 
    "Early Church Fathers",
    "Theological Studies"
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    // Extract unique tags from all resources
    const allTags = resources.flatMap(resource => resource.tags || []);
    const uniqueTags = [...new Set(allTags)].sort();
    setAvailableTags(uniqueTags);
  }, [resources]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    // Category filter
    const categoryMatch = selectedCategory === "all" || resource.category === selectedCategory;
    
    // Search filter (title, author, tags)
    const searchMatch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tag filter
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.some(selectedTag => resource.tags.includes(selectedTag));
    
    return categoryMatch && searchMatch && tagMatch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategory("all");
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? IconComponent : LucideIcons.Book;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Resources</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Discover a curated collection of theological resources, commentaries, and studies to deepen your faith and understanding.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters & Clear */}
        {(searchQuery || selectedTags.length > 0 || selectedCategory !== "all") && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary">
                Category: {selectedCategory}
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary">
                Tag: {tag}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Resources Grid */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No resources found for the selected category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const IconComponent = getIcon(resource.icon);
            
            return (
              <Card key={resource.id} className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge 
                          variant="default" 
                          className="text-xs font-medium"
                        >
                          {resource.category}
                        </Badge>
                        {resource.tags.slice(0, 2).map((tag, index) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg leading-tight">{resource.title}</CardTitle>
                  <CardDescription className="text-sm">
                    By <span className="font-medium">{resource.author}</span> • {format(new Date(resource.publication_date), 'MMM yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-0">
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    {resource.summary}
                  </p>
                  
                  {/* All Tags Display */}
                  {resource.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs hover:bg-primary/10 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Read More Button */}
                  <Button asChild className="w-full mt-auto group">
                    <a 
                      href={resource.resource_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Read More
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Resources;