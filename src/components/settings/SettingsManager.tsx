import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SettingsState {
  emailNotifications: boolean;
  messageNotifications: boolean;
  weeklyDigest: boolean;
  profileVisibility: boolean;
  directMessages: boolean;
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
  });

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
  const updateSetting = (key: keyof SettingsState, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Notify parent component
    onSettingsChange?.(newSettings);
    
    // Show success toast
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
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
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Privacy</h3>
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
        </div>
      </div>
    </div>
  );
};