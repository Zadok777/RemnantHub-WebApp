import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <p className="text-muted-foreground">We collect information you provide directly, including your name, email address, profile information, and community participation data.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Location Data</h4>
              <p className="text-muted-foreground">With your permission, we collect location data to help you find nearby communities and enhance your experience.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Information</h4>
              <p className="text-muted-foreground">We automatically collect information about how you use our platform, including pages visited and features used.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and maintain our services</li>
              <li>To connect you with nearby Christian communities</li>
              <li>To send you important updates and notifications</li>
              <li>To improve our platform and user experience</li>
              <li>To ensure the safety and security of our community</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">We do not sell your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>With community leaders when you join their communities</li>
              <li>When required by law or to protect our rights</li>
              <li>With service providers who help us operate our platform</li>
              <li>With your explicit consent</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">If you have questions about this Privacy Policy, please contact us at privacy@remnanthub.org</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;