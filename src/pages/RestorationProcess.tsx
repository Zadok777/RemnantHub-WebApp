import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, BookOpen, CheckCircle, Clock, User } from 'lucide-react';

const RestorationProcess = () => {
  const steps = [
    {
      phase: "Initial Response",
      title: "Acknowledge & Assess",
      duration: "24-48 hours",
      description: "Upon receiving a formal report, leadership acknowledges receipt and begins initial assessment.",
      actions: [
        "Confirm receipt of report with all parties",
        "Pray for wisdom and guidance",
        "Review the situation objectively",
        "Determine if immediate action is needed for safety"
      ],
      scripture: "Galatians 6:1 - 'If someone is caught in a sin, you who live by the Spirit should restore that person gently.'"
    },
    {
      phase: "Investigation",
      title: "Gather Facts",
      duration: "1-2 weeks",
      description: "Leadership carefully investigates the situation with fairness and compassion for all involved.",
      actions: [
        "Interview all relevant parties separately",
        "Gather any necessary evidence or documentation",
        "Consult with other mature believers if needed",
        "Maintain confidentiality throughout the process"
      ],
      scripture: "Proverbs 18:17 - 'In a lawsuit the first to speak seems right, until someone comes forward and cross-examines.'"
    },
    {
      phase: "Confrontation",
      title: "Address the Issue",
      duration: "Ongoing",
      description: "If wrongdoing is confirmed, approach the person with truth, love, and a goal of restoration.",
      actions: [
        "Meet with the person in a spirit of gentleness",
        "Present the facts clearly and lovingly",
        "Call for repentance where appropriate",
        "Offer support and accountability for change"
      ],
      scripture: "2 Timothy 2:24-25 - 'The Lord's servant must not be quarrelsome but must be kind to everyone... gently instructing those who oppose the truth.'"
    },
    {
      phase: "Restoration",
      title: "Path to Healing",
      duration: "Varies",
      description: "When repentance occurs, focus shifts to restoration, healing, and preventing future issues.",
      actions: [
        "Establish clear steps for restoration",
        "Provide appropriate accountability and support",
        "Work toward reconciliation between parties",
        "Monitor progress and provide ongoing care"
      ],
      scripture: "2 Corinthians 2:7-8 - 'Now instead, you ought to forgive and comfort him, so that he will not be overwhelmed by excessive sorrow.'"
    },
    {
      phase: "Church Discipline",
      title: "Last Resort Measures",
      duration: "As needed",
      description: "If repentance is refused and the sin is serious, biblical church discipline may be necessary.",
      actions: [
        "Remove from positions of leadership if applicable",
        "Limit participation in certain church activities",
        "Continue to reach out with love and truth",
        "Always leave the door open for restoration"
      ],
      scripture: "Matthew 18:17 - 'If they still refuse to listen, tell it to the church; and if they refuse to listen even to the church, treat them as you would a pagan or a tax collector.'"
    }
  ];

  const principles = [
    {
      title: "Restoration Over Punishment",
      description: "The goal is always to restore the person to fellowship, not to punish or condemn.",
      icon: Heart
    },
    {
      title: "Community Healing",
      description: "Consider the impact on the entire community and work toward collective healing.",
      icon: Users
    },
    {
      title: "Biblical Foundation",
      description: "All actions are grounded in Scripture and guided by the Holy Spirit.",
      icon: BookOpen
    },
    {
      title: "Due Process",
      description: "Fair, thorough, and compassionate handling of all situations.",
      icon: CheckCircle
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Restoration Process</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          When conflicts arise in our community, we follow biblical principles that prioritize restoration, 
          reconciliation, and healing while maintaining the health and safety of our fellowship.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {principles.map((principle, index) => {
          const Icon = principle.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Process Steps */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center mb-8">The Restoration Process</h2>
        
        {steps.map((step, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{step.phase}</Badge>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{step.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Actions:</h4>
                  <ul className="space-y-2">
                    {step.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Biblical Foundation:</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm italic">{step.scripture}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Notes */}
      <Card className="mt-12 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Our Commitment to Love and Truth
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">For the Accused:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• You are loved and valued as a person</li>
                <li>• You have the right to present your perspective</li>
                <li>• Support and counseling are available</li>
                <li>• Restoration is always the goal</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">For the Community:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Confidentiality is maintained throughout</li>
                <li>• Gossip and speculation are discouraged</li>
                <li>• Prayer and support for all parties is encouraged</li>
                <li>• The health of the community is protected</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Remember:</strong> "Brothers and sisters, if someone is caught in a sin, you who live by the Spirit 
              should restore that person gently. But watch yourselves, or you also may be tempted. Carry each other's 
              burdens, and in this way you will fulfill the law of Christ." - Galatians 6:1-2
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help or Have Questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have questions about this process or need support during a difficult situation, 
            please don't hesitate to reach out to church leadership.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span>Contact your local church leadership or email: leadership@remnanthub.org</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestorationProcess;