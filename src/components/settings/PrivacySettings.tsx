import { useState, useEffect } from "react";
import { Shield, MapPin, Eye, Share } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PrivacySettings {
  share_approximate_location: boolean;
  hide_exact_address: boolean;
  share_testimonies_publicly: boolean;
}

export default function PrivacySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrivacySettings>({
    share_approximate_location: true,
    hide_exact_address: false,
    share_testimonies_publicly: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, [user]);

  const fetchPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("privacy_settings")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data?.privacy_settings) {
        const privacySettings = data.privacy_settings as any;
        if (typeof privacySettings === 'object' && privacySettings !== null) {
          setSettings({
            share_approximate_location: privacySettings.share_approximate_location ?? true,
            hide_exact_address: privacySettings.hide_exact_address ?? false,
            share_testimonies_publicly: privacySettings.share_testimonies_publicly ?? false,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching privacy settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySetting = async (key: keyof PrivacySettings, value: boolean) => {
    if (!user) return;

    setSaving(true);
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert([
          {
            user_id: user.id,
            privacy_settings: newSettings,
          },
        ], { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      // Revert the change
      setSettings(settings);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading privacy settings...</div>;
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy & Data Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You have full control over how your personal information is shared and used. 
              All settings are optional and can be changed at any time.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {/* Location Privacy */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Location Privacy</h3>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="share-location">Share approximate location for search purposes</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Eye className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Allows others to find house churches in your general area (city/state level). 
                            Your exact address is never shared.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Helps seekers find gatherings near them without revealing specific addresses
                    </p>
                  </div>
                  <Switch
                    id="share-location"
                    checked={settings.share_approximate_location}
                    onCheckedChange={(checked) => updatePrivacySetting("share_approximate_location", checked)}
                    disabled={saving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="hide-address">Hide exact meeting address until seeker is approved</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Eye className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Requires house church leaders to approve new visitors before sharing 
                            the exact meeting address for added security.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Provides an extra layer of security for home gatherings
                    </p>
                  </div>
                  <Switch
                    id="hide-address"
                    checked={settings.hide_exact_address}
                    onCheckedChange={(checked) => updatePrivacySetting("hide_exact_address", checked)}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Testimony Sharing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Share className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Testimony & Story Sharing</h3>
              </div>
              
              <div className="pl-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="share-testimonies">Share testimonies and praise reports publicly</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Eye className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Allows your praise reports and testimonies to be featured publicly 
                            to encourage other believers. You can always choose to post anonymously.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Helps encourage the broader community with your faith stories
                    </p>
                  </div>
                  <Switch
                    id="share-testimonies"
                    checked={settings.share_testimonies_publicly}
                    onCheckedChange={(checked) => updatePrivacySetting("share_testimonies_publicly", checked)}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Optional Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                All personal data fields including spiritual gifts, testimonies, and reading plan participation 
                are completely optional. You can add, modify, or remove this information at any time through 
                your profile settings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm">Data Rights</h3>
              <p className="text-sm text-muted-foreground">
                You have the right to access, modify, or request deletion of your personal data. 
                Visit our <a href="/data-rights" className="text-primary hover:underline">Data Rights page</a> for 
                more information about how your data is stored and protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}