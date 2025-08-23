import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">By accessing and using RemnantHub, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">RemnantHub is a platform designed to connect Christians with local communities, facilitate fellowship, and provide resources for spiritual growth.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Security</h4>
                <p className="text-muted-foreground">You are responsible for maintaining the confidentiality of your account and password.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Conduct Guidelines</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Treat all community members with respect and kindness</li>
                  <li>Share content that aligns with Christian values</li>
                  <li>Respect the beliefs and practices of different Christian denominations</li>
                  <li>Do not engage in harassment, hate speech, or inappropriate behavior</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-muted-foreground">Our platform is built on Christian principles of love, respect, and community. We expect all users to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Foster a welcoming environment for all believers</li>
                <li>Share prayer requests and encouragement</li>
                <li>Participate in discussions with grace and wisdom</li>
                <li>Report any inappropriate content or behavior</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Prohibited Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Posting content that is offensive, inappropriate, or contrary to Christian values</li>
              <li>Harassment or discrimination based on any characteristic</li>
              <li>Sharing false or misleading information</li>
              <li>Attempting to compromise the security of the platform</li>
              <li>Using the platform for commercial purposes without permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Content Ownership</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You retain ownership of content you post, but grant RemnantHub a license to use, display, and distribute your content on the platform.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">RemnantHub is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">For questions about these Terms of Service, contact us at support@remnanthub.org</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;