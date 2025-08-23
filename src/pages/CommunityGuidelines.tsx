import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Users, Book, MessageCircle, AlertTriangle } from 'lucide-react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: Heart,
      title: "Love & Respect",
      description: "Treat all members with Christian love, kindness, and respect",
      rules: [
        "Show genuine care and concern for fellow believers",
        "Respect different backgrounds and life experiences",
        "Avoid judgment and practice grace in all interactions",
        "Encourage and build up one another in faith"
      ]
    },
    {
      icon: Book,
      title: "Biblical Foundation",
      description: "Keep Christ and Scripture at the center of all discussions",
      rules: [
        "Base teachings and discussions on biblical truth",
        "Share insights that edify and strengthen faith",
        "Avoid divisive theological debates that don't build up",
        "Focus on New Testament ekklesia model of home fellowships"
      ]
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Foster authentic fellowship and spiritual growth",
      rules: [
        "Participate actively in community discussions and gatherings",
        "Share prayer requests and celebrate answered prayers",
        "Support members going through difficult times",
        "Maintain the intimate, family-like atmosphere of home fellowships"
      ]
    },
    {
      icon: MessageCircle,
      title: "Communication Standards",
      description: "Communicate with wisdom, grace, and truth",
      rules: [
        "Use language that honors Christ and edifies others",
        "Avoid gossip, slander, or speaking negatively about others",
        "Share concerns privately with leaders when appropriate",
        "Keep personal information and prayer requests confidential"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Protection",
      description: "Maintain a safe environment for all members",
      rules: [
        "Report any inappropriate behavior or content immediately",
        "Protect children and vulnerable members from harm",
        "Verify the identity and character of new community leaders",
        "Maintain appropriate boundaries in all relationships"
      ]
    }
  ];

  const violations = [
    "Sharing false teachings that contradict core Christian doctrine",
    "Harassment, bullying, or discriminatory behavior",
    "Sharing inappropriate content (sexual, violent, or offensive material)",
    "Attempting to recruit members for non-Christian purposes",
    "Promoting denominational divisions or institutional church models",
    "Violating privacy by sharing personal information without consent"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Community Guidelines</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our guidelines are rooted in Christian principles and designed to foster authentic 
          New Testament-style fellowship in home-based communities.
        </p>
      </div>

      <div className="mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Our Foundation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              RemnantHub is built on the New Testament ekklesia model - simple, home-based fellowships 
              where believers gather as family to worship, learn, and grow together. We believe in the 
              priesthood of all believers and the importance of intimate, authentic community without 
              denominational barriers or institutional structures.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Guidelines for Fellowship</h2>
        {guidelines.map((guideline, index) => {
          const IconComponent = guideline.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{guideline.title}</CardTitle>
                    <CardDescription>{guideline.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guideline.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Behavior That Is Not Acceptable</CardTitle>
          </div>
          <CardDescription>
            The following behaviors violate our community standards and may result in removal from communities or the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {violations.map((violation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{violation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reporting Issues</CardTitle>
            <CardDescription>
              If you encounter behavior that violates these guidelines, please report it immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Our moderation team reviews all reports within 24 hours and takes appropriate action to maintain a safe, Christ-centered environment.
            </p>
            <Badge variant="outline">Available 24/7</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grace & Restoration</CardTitle>
            <CardDescription>
              We believe in biblical restoration and second chances for those who sincerely repent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              When members violate guidelines, we seek restoration through loving correction, mentorship, and accountability rather than just punishment.
            </p>
            <Badge variant="outline">Matthew 18:15-17</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityGuidelines;