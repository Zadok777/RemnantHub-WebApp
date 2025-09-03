import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

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

      {/* Resources Grid */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {resources.length} resources
        </p>
      </div>
      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No resources available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const IconComponent = getIcon(resource.icon);
            
            return (
              <Card key={resource.id} className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
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