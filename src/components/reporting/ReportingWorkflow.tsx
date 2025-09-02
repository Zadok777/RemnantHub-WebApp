import { useState, useEffect } from "react";
import { AlertTriangle, MessageCircle, Users, FileText, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReportingWorkflow {
  id: string;
  issue_description: string;
  current_step: string;
  private_address_attempted: boolean;
  private_address_date: string | null;
  private_address_notes: string | null;
  witness_brought: boolean;
  witness_date: string | null;
  witness_notes: string | null;
  formal_report_submitted: boolean;
  formal_report_date: string | null;
  resolution_status: string;
  created_at: string;
}

interface Props {
  reportedUserId?: string;
  reportedCommunityId?: string;
  initialDescription?: string;
  onComplete?: () => void;
}

const STEPS = [
  {
    id: "private_address",
    title: "Address Privately",
    description: "First, try to resolve the issue through private conversation",
    scriptureRef: "Matthew 18:15",
    icon: MessageCircle,
  },
  {
    id: "bring_witness",
    title: "Bring a Witness",
    description: "If private conversation fails, involve trusted witnesses",
    scriptureRef: "Matthew 18:16",
    icon: Users,
  },
  {
    id: "formal_report",
    title: "Submit Formal Report",
    description: "As a last resort, bring the matter to church leadership",
    scriptureRef: "Matthew 18:17",
    icon: FileText,
  },
];

export default function ReportingWorkflow({ 
  reportedUserId, 
  reportedCommunityId, 
  initialDescription = "",
  onComplete 
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentWorkflow, setCurrentWorkflow] = useState<ReportingWorkflow | null>(null);
  const [showGuidance, setShowGuidance] = useState(true);
  const [description, setDescription] = useState(initialDescription);
  const [stepNotes, setStepNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportedUserId || reportedCommunityId) {
      fetchExistingWorkflow();
    }
  }, [reportedUserId, reportedCommunityId]);

  const fetchExistingWorkflow = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("reporting_workflows")
        .select("*")
        .eq("reporter_id", user.id)
        .eq(reportedUserId ? "reported_user_id" : "reported_community_id", reportedUserId || reportedCommunityId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setCurrentWorkflow(data);
        setDescription(data.issue_description);
      }
    } catch (error) {
      console.error("Error fetching workflow:", error);
    }
  };

  const createWorkflow = async () => {
    if (!user || !description.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reporting_workflows")
        .insert([
          {
            reporter_id: user.id,
            reported_user_id: reportedUserId,
            reported_community_id: reportedCommunityId,
            issue_description: description,
            current_step: "private_address",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setCurrentWorkflow(data);
      setShowGuidance(false);

      toast({
        title: "Reporting Workflow Started",
        description: "Following the biblical process outlined in Matthew 18",
      });
    } catch (error) {
      console.error("Error creating workflow:", error);
      toast({
        title: "Error",
        description: "Failed to start reporting workflow",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (stepCompleted: string, notes: string) => {
    if (!currentWorkflow) return;

    setLoading(true);
    try {
      const updates: any = {
        [`${stepCompleted}_attempted`]: true,
        [`${stepCompleted}_date`]: new Date().toISOString(),
        [`${stepCompleted}_notes`]: notes,
      };

      // Update current step
      if (stepCompleted === "private_address") {
        updates.current_step = "bring_witness";
      } else if (stepCompleted === "witness_brought") {
        updates.current_step = "formal_report";
      } else if (stepCompleted === "formal_report") {
        updates.formal_report_submitted = true;
        updates.resolution_status = "formal_review";
      }

      const { data, error } = await supabase
        .from("reporting_workflows")
        .update(updates)
        .eq("id", currentWorkflow.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentWorkflow(data);
      setStepNotes("");

      toast({
        title: "Step Completed",
        description: "Your progress has been recorded",
      });

      if (stepCompleted === "formal_report" && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error updating step:", error);
      toast({
        title: "Error",
        description: "Failed to update step",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!currentWorkflow) return 0;
    return STEPS.findIndex(step => step.id === currentWorkflow.current_step);
  };

  const isStepCompleted = (stepId: string) => {
    if (!currentWorkflow) return false;
    
    switch (stepId) {
      case "private_address":
        return currentWorkflow.private_address_attempted;
      case "bring_witness":
        return currentWorkflow.witness_brought;
      case "formal_report":
        return currentWorkflow.formal_report_submitted;
      default:
        return false;
    }
  };

  if (showGuidance && !currentWorkflow) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Biblical Conflict Resolution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Following Matthew 18:15-17:</strong> Jesus outlined a clear process for addressing 
              conflicts and concerns within the church. This process prioritizes restoration over punishment 
              and seeks to preserve relationships while addressing legitimate issues.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Before We Begin:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Have you prayed about this situation and examined your own heart?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Is this a matter of genuine sin or just a personal preference?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Are you approaching this with a spirit of humility and love?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Is your goal restoration and reconciliation?
              </li>
            </ul>
          </div>

          <div>
            <Label htmlFor="issue-description">Describe the Issue</Label>
            <Textarea
              id="issue-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the situation clearly and objectively..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={createWorkflow}
              disabled={!description.trim() || loading}
              className="flex-1"
            >
              Begin Biblical Process
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowGuidance(false)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentWorkflow) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No active reporting workflow found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conflict Resolution Progress</CardTitle>
          <div className="text-sm text-muted-foreground">
            Following the biblical process outlined in Matthew 18:15-17
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Original Issue:</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {currentWorkflow.issue_description}
            </p>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = getCurrentStepIndex() === index;
              const isPast = index < getCurrentStepIndex();

              return (
                <Card key={step.id} className={`${isCurrent ? "ring-2 ring-primary" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        isCompleted ? "bg-green-100 text-green-600" :
                        isCurrent ? "bg-primary/10 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{step.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {step.scriptureRef}
                          </Badge>
                          {isCompleted && (
                            <Badge variant="default" className="bg-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>

                        {isCompleted && (
                          <div className="bg-muted p-3 rounded text-sm">
                            <div className="font-medium mb-1">
                              Completed: {new Date(
                                step.id === "private_address" ? currentWorkflow.private_address_date! :
                                step.id === "bring_witness" ? currentWorkflow.witness_date! :
                                currentWorkflow.formal_report_date!
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {step.id === "private_address" ? currentWorkflow.private_address_notes :
                               step.id === "bring_witness" ? currentWorkflow.witness_notes :
                               "Formal report submitted to leadership"}
                            </div>
                          </div>
                        )}

                        {isCurrent && !isCompleted && (
                          <div className="space-y-3">
                            <Textarea
                              value={stepNotes}
                              onChange={(e) => setStepNotes(e.target.value)}
                              placeholder={`Describe your attempt to ${step.title.toLowerCase()}...`}
                              rows={3}
                            />
                            <Button
                              onClick={() => updateStep(
                                step.id === "bring_witness" ? "witness_brought" : 
                                step.id === "formal_report" ? "formal_report" :
                                "private_address",
                                stepNotes
                              )}
                              disabled={!stepNotes.trim() || loading}
                              size="sm"
                            >
                              Mark as Completed
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {currentWorkflow.formal_report_submitted && (
            <Alert className="mt-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Formal Report Submitted:</strong> The matter is now being reviewed by church leadership. 
                The goal remains restoration and reconciliation according to Galatians 6:1.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Step Guidance</DialogTitle>
          </DialogHeader>
          {/* Add step-specific guidance content here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}