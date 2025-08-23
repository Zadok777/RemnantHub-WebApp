import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Download, Shield, Bell, Eye, MessageSquare, Map, Calendar } from 'lucide-react';

interface SettingsState {
  emailNotifications: boolean;
  messageNotifications: boolean;
  weeklyDigest: boolean;
  profileVisibility: boolean;
  directMessages: boolean;
  showLocationOnMap: boolean;
  maxTravelDistance: number;
  preferredMeetingDays: string[];
  autoJoinVerifiedCommunities: boolean;
  showAgeOnProfile: boolean;
  allowEventInvitations: boolean;
  dataSharing: boolean;
}

interface SettingsManagerProps {
  onSettingsChange?: (settings: SettingsState) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    messageNotifications: true,
    weeklyDigest: false,
    profileVisibility: true,
    directMessages: false,
    showLocationOnMap: true,
    maxTravelDistance: 25,
    preferredMeetingDays: [],
    autoJoinVerifiedCommunities: false,
    showAgeOnProfile: false,
    allowEventInvitations: true,
    dataSharing: false,
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage and notify parent
  const updateSetting = (key: keyof SettingsState, value: boolean | number | string[]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Notify parent component
    onSettingsChange?.(newSettings);
    
    // Show success toast
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully`,
    });
  };

  const exportData = async () => {
    if (!user) return;

    try {
      // Get user's data from all tables
      const [profileData, communitiesData, prayerRequestsData] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id),
        supabase.from('community_members').select('*, communities(*)').eq('user_id', user.id),
        supabase.from('prayer_requests').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        profile: profileData.data?.[0] || null,
        communities: communitiesData.data || [],
        prayerRequests: prayerRequestsData.data || [],
        settings,
        exportDate: new Date().toISOString()
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `remnanthub-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );
    
    if (!confirmed) return;

    try {
      // Delete user data from all tables
      await Promise.all([
        supabase.from('community_members').delete().eq('user_id', user.id),
        supabase.from('prayer_requests').delete().eq('user_id', user.id),
        supabase.from('prayer_responses').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('user_id', user.id)
      ]);

      // Sign out the user
      await supabase.auth.signOut();

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete your account. Please contact support.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates for community activities
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="message-notifications">Message notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new messages
              </p>
            </div>
            <Switch 
              id="message-notifications" 
              checked={settings.messageNotifications}
              onCheckedChange={(checked) => updateSetting('messageNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of community activities
              </p>
            </div>
            <Switch 
              id="weekly-digest" 
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) => updateSetting('weeklyDigest', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="event-invitations">Event invitations</Label>
              <p className="text-sm text-muted-foreground">
                Allow communities to send you event invitations
              </p>
            </div>
            <Switch 
              id="event-invitations" 
              checked={settings.allowEventInvitations}
              onCheckedChange={(checked) => updateSetting('allowEventInvitations', checked)}
            />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Privacy</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visibility">Profile visibility</Label>
              <p className="text-sm text-muted-foreground">
                Allow community members to view your profile
              </p>
            </div>
            <Switch 
              id="profile-visibility" 
              checked={settings.profileVisibility}
              onCheckedChange={(checked) => updateSetting('profileVisibility', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="direct-messages">Direct messages</Label>
              <p className="text-sm text-muted-foreground">
                Allow other users to send you direct messages
              </p>
            </div>
            <Switch 
              id="direct-messages" 
              checked={settings.directMessages}
              onCheckedChange={(checked) => updateSetting('directMessages', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-location">Show location on map</Label>
              <p className="text-sm text-muted-foreground">
                Display your general location to help find nearby communities
              </p>
            </div>
            <Switch 
              id="show-location" 
              checked={settings.showLocationOnMap}
              onCheckedChange={(checked) => updateSetting('showLocationOnMap', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-age">Show age on profile</Label>
              <p className="text-sm text-muted-foreground">
                Display your age to help match with age-appropriate communities
              </p>
            </div>
            <Switch 
              id="show-age" 
              checked={settings.showAgeOnProfile}
              onCheckedChange={(checked) => updateSetting('showAgeOnProfile', checked)}
            />
          </div>
        </div>
      </div>

      {/* Community Preferences */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Community Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Maximum travel distance: {settings.maxTravelDistance} miles</Label>
            <Slider
              value={[settings.maxTravelDistance]}
              onValueChange={(value) => updateSetting('maxTravelDistance', value[0])}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-join">Auto-join verified communities</Label>
              <p className="text-sm text-muted-foreground">
                Automatically join communities with verified status
              </p>
            </div>
            <Switch 
              id="auto-join" 
              checked={settings.autoJoinVerifiedCommunities}
              onCheckedChange={(checked) => updateSetting('autoJoinVerifiedCommunities', checked)}
            />
          </div>
        </div>
      </div>

      {/* Data & Security */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Data & Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing">Allow data sharing for research</Label>
              <p className="text-sm text-muted-foreground">
                Share anonymized data to help improve the platform
              </p>
            </div>
            <Switch 
              id="data-sharing" 
              checked={settings.dataSharing}
              onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
            />
          </div>
          
          <div className="pt-4 space-y-3">
            <Button
              variant="outline"
              onClick={exportData}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            
            <Button
              variant="destructive"
              onClick={deleteAccount}
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};