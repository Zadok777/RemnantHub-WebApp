import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our services.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Essential</Badge>
              <div>
                <h4 className="font-semibold mb-1">Strictly Necessary Cookies</h4>
                <p className="text-muted-foreground text-sm">These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and accessibility.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline">Functional</Badge>
              <div>
                <h4 className="font-semibold mb-1">Functionality Cookies</h4>
                <p className="text-muted-foreground text-sm">These cookies remember your preferences and settings to provide a personalized experience, such as your preferred language or theme.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline">Analytics</Badge>
              <div>
                <h4 className="font-semibold mb-1">Performance Cookies</h4>
                <p className="text-muted-foreground text-sm">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specific Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Authentication Cookies</h4>
                  <Badge variant="secondary">Essential</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Used to keep you signed in and maintain your session.</p>
                <p className="text-xs text-muted-foreground">Duration: Session or 30 days</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Theme Preferences</h4>
                  <Badge variant="outline">Functional</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Remembers your light/dark theme preference.</p>
                <p className="text-xs text-muted-foreground">Duration: 1 year</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Location Preferences</h4>
                  <Badge variant="outline">Functional</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Stores your location preferences for finding nearby communities.</p>
                <p className="text-xs text-muted-foreground">Duration: 6 months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-muted-foreground">You can control and delete cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Essential Cookies</h4>
                <p className="text-muted-foreground">Essential cookies cannot be disabled as they are necessary for the website to function properly.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">We may use third-party services that set cookies, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Mapbox - for interactive maps and location services</li>
              <li>Supabase - for authentication and data storage</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">If you have questions about our use of cookies, please contact us at cookies@remnanthub.org</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;