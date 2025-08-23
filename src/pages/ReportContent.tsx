import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, MessageSquare, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportContent = () => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Report Submitted",
      description: "Thank you for your report. We will review it within 24 hours.",
    });

    setReportType('');
    setDescription('');
    setUserEmail('');
    setContentUrl('');
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Flag className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Report Content</h1>
        <p className="text-muted-foreground">Help us maintain a safe and respectful community</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Report</CardTitle>
              <CardDescription>
                If you've encountered inappropriate content or behavior, please let us know so we can take appropriate action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reportType">Type of Report</Label>
                  <Select value={reportType} onValueChange={setReportType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                      <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                      <SelectItem value="spam">Spam or Scam</SelectItem>
                      <SelectItem value="misinformation">False Information</SelectItem>
                      <SelectItem value="violence">Threats or Violence</SelectItem>
                      <SelectItem value="copyright">Copyright Violation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contentUrl">Content URL or Location (optional)</Label>
                  <Input
                    id="contentUrl"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="https://remnanthub.app/community/123"
                  />
                </div>

                <div>
                  <Label htmlFor="userEmail">Your Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide details about the issue you're reporting..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All reports are reviewed by our moderation team. False reports may result in account restrictions.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Emergency Situations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                If you or someone else is in immediate danger, contact local emergency services:
              </p>
              <div className="space-y-2 text-sm">
                <div><strong>US:</strong> 911</div>
                <div><strong>UK:</strong> 999</div>
                <div><strong>EU:</strong> 112</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Alternative Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                You can also reach our safety team directly:
              </p>
              <div className="text-sm space-y-1">
                <div>Email: safety@remnanthub.org</div>
                <div>Response time: Within 24 hours</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li><strong>1.</strong> We review your report within 24 hours</li>
                <li><strong>2.</strong> We investigate the reported content</li>
                <li><strong>3.</strong> We take appropriate action if needed</li>
                <li><strong>4.</strong> We follow up with you via email</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;