import { useState, useEffect } from "react";
import { Sprout, Users, Calendar, CheckCircle, Target, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MultiplicationMilestone {
  id: string;
  community_id: string;
  milestone_type: string;
  achieved_at: string | null;
  notes: string;
  created_at: string;
}

interface Community {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  leader_id: string;
}

interface Props {
  community: Community;
  isLeader: boolean;
}

const MILESTONE_TYPES = [
  {
    id: "established_disciples",
    title: "Core Disciples Established",
    description: "5+ committed disciples regularly participating",
    icon: Users,
    threshold: 5,
  },
  {
    id: "consistent_meetings",
    title: "Consistent Gatherings",
    description: "Regular weekly meetings for 6+ months",
    icon: Calendar,
    threshold: 26, // weeks
  },
  {
    id: "leadership_development",
    title: "Leaders in Training",
    description: "2+ members equipped for future leadership",
    icon: Target,
    threshold: 2,
  },
  {
    id: "spiritual_maturity",
    title: "Spiritual Maturity",
    description: "Evidence of discipleship and multiplication heart",
    icon: BookOpen,
    threshold: 1,
  },
  {
    id: "ready_to_multiply",
    title: "Ready for Multiplication",
    description: "Community prepared to plant a new house church",
    icon: Sprout,
    threshold: 1,
  },
];

const MULTIPLICATION_GUIDE = [
  {
    step: 1,
    title: "Identify and Prepare Leaders",
    description: "Select 1-2 mature disciples who demonstrate leadership potential and heart for multiplication.",
    details: [
      "Look for faithful attendance and participation",
      "Evidence of personal discipleship growth",
      "Ability to lead small group discussions",
      "Heart for reaching the lost",
    ]
  },
  {
    step: 2,
    title: "Provide Leadership Training",
    description: "Equip chosen leaders with practical skills for leading a house church.",
    details: [
      "Facilitate group discussions and Bible study",
      "Pastor and counsel group members",
      "Plan and lead worship times",
      "Develop new disciples",
    ]
  },
  {
    step: 3,
    title: "Form the Core Team",
    description: "Help new leaders identify 2-3 committed families to form the foundation of the new church.",
    details: [
      "Pray together about the new plant",
      "Commit to supporting the new leaders",
      "Identify the target community or neighborhood",
      "Plan the launch strategy",
    ]
  },
  {
    step: 4,
    title: "Launch with Support",
    description: "Send the team with prayer, resources, and ongoing mentorship.",
    details: [
      "Commission the new church publicly",
      "Provide initial financial support if needed",
      "Maintain regular contact and mentoring",
      "Celebrate the multiplication milestone",
    ]
  },
];

export default function MultiplicationTracker({ community, isLeader }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<MultiplicationMilestone[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, [community.id]);

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from("multiplication_milestones")
        .select("*")
        .eq("community_id", community.id);

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMilestoneAchieved = async (milestoneType: string) => {
    if (!user || !isLeader) return;

    try {
      const { error } = await supabase
        .from("multiplication_milestones")
        .upsert([
          {
            community_id: community.id,
            milestone_type: milestoneType,
            achieved_at: new Date().toISOString(),
            notes: `Milestone achieved on ${new Date().toLocaleDateString()}`,
          },
        ], { onConflict: "community_id,milestone_type" });

      if (error) throw error;

      toast({
        title: "Milestone Achieved!",
        description: "Congratulations on reaching this multiplication milestone.",
      });

      fetchMilestones();
    } catch (error) {
      console.error("Error marking milestone:", error);
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      });
    }
  };

  const getAchievedMilestone = (milestoneType: string) => {
    return milestones.find(m => m.milestone_type === milestoneType);
  };

  const calculateProgress = () => {
    const achievedCount = MILESTONE_TYPES.filter(type => 
      getAchievedMilestone(type.id)?.achieved_at
    ).length;
    return (achievedCount / MILESTONE_TYPES.length) * 100;
  };

  const isReadyForMultiplication = () => {
    return MILESTONE_TYPES.slice(0, -1).every(type => 
      getAchievedMilestone(type.id)?.achieved_at
    );
  };

  const communityAge = Math.floor(
    (new Date().getTime() - new Date(community.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (loading) {
    return <div>Loading multiplication tracker...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Multiplication Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(calculateProgress())}% Complete
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Community Age:</span>
                <span>{communityAge} months</span>
              </div>
              <div className="flex justify-between">
                <span>Current Members:</span>
                <span>{community.member_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Milestones Achieved:</span>
                <span>{MILESTONE_TYPES.filter(type => getAchievedMilestone(type.id)?.achieved_at).length} of {MILESTONE_TYPES.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isReadyForMultiplication() && !getAchievedMilestone("ready_to_multiply")?.achieved_at && (
        <Alert className="border-primary bg-primary/5">
          <Sprout className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                <strong>Ready for Multiplication!</strong>
                <p className="text-sm mt-1">
                  Your community has achieved the foundational milestones. Consider planting a new house church.
                </p>
              </div>
              <Button
                onClick={() => setShowGuide(true)}
                variant="outline"
                size="sm"
              >
                View Guide
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {MILESTONE_TYPES.map((milestone) => {
          const achieved = getAchievedMilestone(milestone.id);
          const Icon = milestone.icon;
          
          return (
            <Card key={milestone.id} className={achieved?.achieved_at ? "bg-primary/5 border-primary/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${achieved?.achieved_at ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {achieved?.achieved_at ? (
                      <Badge variant="default" className="bg-primary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Achieved
                      </Badge>
                    ) : (
                      isLeader && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markMilestoneAchieved(milestone.id)}
                        >
                          Mark Complete
                        </Button>
                      )
                    )}
                  </div>
                </div>
                
                {achieved?.achieved_at && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Achieved on {new Date(achieved.achieved_at).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              House Church Multiplication Guide
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Congratulations on reaching multiplication readiness! Here's a step-by-step guide to help you plant a new house church:
            </p>

            {MULTIPLICATION_GUIDE.map((step) => (
              <Card key={step.step}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {step.step}
                    </Badge>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                <strong>Remember:</strong> The goal is not just to start new groups, but to raise up mature disciples who can continue the multiplication process. Pray for wisdom, take time to prepare leaders well, and maintain ongoing relationships with new plants.
              </AlertDescription>
            </Alert>

            {isLeader && (
              <Button
                onClick={() => markMilestoneAchieved("ready_to_multiply")}
                className="w-full"
              >
                Mark Community as Ready for Multiplication
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}