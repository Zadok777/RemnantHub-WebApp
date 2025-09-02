import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Edit, Eye, Mail } from 'lucide-react';

const DataRights = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Your Data Rights</h1>
        <p className="text-muted-foreground">Understand and exercise your rights regarding your personal data</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Email address (for authentication)</li>
                <li>Display name (optional)</li>
                <li>Profile picture (optional)</li>
                <li>Location information (city/state for community discovery)</li>
                <li>Bio and personal testimony (optional)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Community & Spiritual Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Prayer requests and responses</li>
                <li>Praise reports and testimonies</li>
                <li>Community memberships and roles</li>
                <li>Messages and interactions within communities</li>
                <li>Spiritual gifts and availability (optional)</li>
                <li>Reading plan participation and discussions</li>
                <li>Accountability partnership messages (private)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Leadership & Network Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Leader verification submissions and references</li>
                <li>Regional network memberships and discussions</li>
                <li>Community multiplication milestones</li>
                <li>Network event participation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Privacy Preferences</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Location sharing preferences</li>
                <li>Testimony visibility settings</li>
                <li>Meeting address disclosure preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Core Platform Functions</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Connecting you with local house church communities</li>
                <li>Facilitating prayer requests and spiritual support</li>
                <li>Enabling secure communication between members</li>
                <li>Managing community memberships and roles</li>
                <li>Supporting accountability partnerships and spiritual growth</li>
                <li>Coordinating reading plans and spiritual discussions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Community Building</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Matching members based on spiritual gifts and availability</li>
                <li>Facilitating regional networks and leadership connections</li>
                <li>Supporting church multiplication and discipleship</li>
                <li>Sharing testimonies and praise reports (with your consent)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Service Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Analyzing usage patterns to improve the platform</li>
                <li>Providing customer support</li>
                <li>Preventing fraud and abuse</li>
                <li>Ensuring leader verification and community safety</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">As a RemnantHub user, you have several rights regarding your personal data. We are committed to transparency and giving you control over your information.</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Right to Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You have the right to know what personal data we have about you and how it's being used.</p>
              <Button variant="outline" size="sm">
                Request Access
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Right to Rectification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You can request correction of inaccurate or incomplete personal data.</p>
              <Button variant="outline" size="sm">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Right to Portability</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You can request a copy of your data in a structured, machine-readable format.</p>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Right to Erasure</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You can request deletion of your personal data under certain circumstances.</p>
              <Button variant="outline" size="sm">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Additional Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Restriction</Badge>
              <div>
                <h4 className="font-semibold mb-1">Right to Restrict Processing</h4>
                <p className="text-muted-foreground text-sm">You can request limitation of how we process your data in certain situations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Objection</Badge>
              <div>
                <h4 className="font-semibold mb-1">Right to Object</h4>
                <p className="text-muted-foreground text-sm">You can object to processing of your personal data for direct marketing or other purposes.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Withdrawal</Badge>
              <div>
                <h4 className="font-semibold mb-1">Right to Withdraw Consent</h4>
                <p className="text-muted-foreground text-sm">You can withdraw consent for data processing at any time where consent is the legal basis.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Exercise Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Settings</h4>
              <p className="text-muted-foreground mb-2">Many data rights can be exercised directly through your account settings:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li>Update your profile information</li>
                <li>Change privacy settings</li>
                <li>Manage notification preferences</li>
                <li>Delete your account</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Contact Us</h4>
              <p className="text-muted-foreground mb-3">For rights that require our assistance, contact our Data Protection Officer:</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">dataprotection@remnanthub.org</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">We will respond to your data rights requests:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li><strong>Within 30 days</strong> for most requests</li>
              <li><strong>Within 72 hours</strong> for urgent security matters</li>
              <li><strong>Extended to 60 days</strong> for complex requests (with notification)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">To protect your privacy, we may need to verify your identity before processing certain requests. This may involve:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
              <li>Confirming account ownership</li>
              <li>Providing additional identification</li>
              <li>Answering security questions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataRights;