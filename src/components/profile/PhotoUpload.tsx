import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  userId: string;
  displayName: string;
  onPhotoUpdate: (url: string) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotoUrl,
  userId,
  displayName,
  onPhotoUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload the file to profiles bucket
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const photoUrl = urlData.publicUrl;

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: photoUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Delete old avatar if it exists
      if (currentPhotoUrl && currentPhotoUrl.includes('profiles/')) {
        const oldPath = currentPhotoUrl.split('/profiles/')[1];
        if (oldPath) {
          await supabase.storage.from('profiles').remove([oldPath]);
        }
      }

      onPhotoUpdate(photoUrl);
      setIsOpen(false);
      setPreview(null);
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    if (!currentPhotoUrl) return;

    setUploading(true);
    try {
      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Delete the file from storage if it's in our profiles bucket
      if (currentPhotoUrl.includes('profiles/')) {
        const filePath = currentPhotoUrl.split('/profiles/')[1];
        if (filePath) {
          await supabase.storage.from('profiles').remove([filePath]);
        }
      }

      onPhotoUpdate('');
      setIsOpen(false);
      
      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed.",
      });
    } catch (error: any) {
      console.error('Error removing photo:', error);
      toast({
        title: "Remove failed",
        description: error.message || "Failed to remove photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className="w-24 h-24">
            <AvatarImage src={currentPhotoUrl || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current/Preview Photo */}
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={preview || currentPhotoUrl || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* File Input */}
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>

            {preview && (
              <Button
                onClick={uploadPhoto}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            )}

            {currentPhotoUrl && (
              <Button
                variant="destructive"
                onClick={removePhoto}
                disabled={uploading}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Photo
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Supported formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};