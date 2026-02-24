import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, Phone, Globe, FileText, Image, Bell, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useGetMyProfile, useCreateProfile, useUpdateProfile } from '../../hooks/useQueries';
import type { UserProfile } from '../../backend';

interface ProfileSetupModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contextMessage?: string;
  onSuccess?: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  avatarUrl: '',
  bio: '',
  email: '',
  phone: '',
  country: '',
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    publicProfile: true,
  },
};

export default function ProfileSetupModal({
  open = false,
  onOpenChange,
  contextMessage,
  onSuccess,
}: ProfileSetupModalProps) {
  const { data: existingProfile } = useGetMyProfile();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState<UserProfile>(DEFAULT_PROFILE);

  // Pre-fill form when existing profile data is available
  useEffect(() => {
    if (existingProfile) {
      setFormData({ ...existingProfile });
    } else {
      setFormData(DEFAULT_PROFILE);
    }
  }, [existingProfile, open]);

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updatePref = (key: keyof UserProfile['preferences'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    try {
      if (existingProfile) {
        await updateProfile.mutateAsync(formData);
      } else {
        await createProfile.mutateAsync(formData);
      }
      toast.success('Profile saved successfully!');

      if (onSuccess) {
        onSuccess();
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save profile. Please try again.');
    }
  };

  const isSaving = createProfile.isPending || updateProfile.isPending;
  const isUpdate = !!existingProfile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            {isUpdate ? 'Update Your Profile' : contextMessage ? 'Complete Your Profile' : 'Set Up Your Profile'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {contextMessage || (isUpdate ? 'Update your player details below' : 'Fill in your player details to get started')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Display Name */}
          <div className="space-y-1">
            <Label htmlFor="displayName" className="text-gray-300 flex items-center gap-1">
              <User className="h-3 w-3" /> Display Name *
            </Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={e => updateField('displayName', e.target.value)}
              placeholder="Your display name"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          {/* Avatar URL */}
          <div className="space-y-1">
            <Label htmlFor="avatarUrl" className="text-gray-300 flex items-center gap-1">
              <Image className="h-3 w-3" /> Avatar URL
            </Label>
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={e => updateField('avatarUrl', e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label htmlFor="bio" className="text-gray-300 flex items-center gap-1">
              <FileText className="h-3 w-3" /> Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={e => updateField('bio', e.target.value)}
              placeholder="Tell others about yourself..."
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={2}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="you@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-gray-300 flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-1">
            <Label htmlFor="country" className="text-gray-300 flex items-center gap-1">
              <Globe className="h-3 w-3" /> Country
            </Label>
            <Input
              id="country"
              value={formData.country}
              onChange={e => updateField('country', e.target.value)}
              placeholder="e.g. Bangladesh"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Separator className="bg-gray-800" />

          {/* Preferences */}
          <div className="space-y-3">
            <p className="text-gray-400 text-sm font-medium flex items-center gap-1">
              <Bell className="h-3 w-3" /> Preferences
            </p>
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-500" /> Email Notifications
              </Label>
              <Switch
                checked={formData.preferences.emailNotifications}
                onCheckedChange={v => updatePref('emailNotifications', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm flex items-center gap-2">
                <Bell className="h-3 w-3 text-gray-500" /> Push Notifications
              </Label>
              <Switch
                checked={formData.preferences.pushNotifications}
                onCheckedChange={v => updatePref('pushNotifications', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm flex items-center gap-2">
                <Eye className="h-3 w-3 text-gray-500" /> Public Profile
              </Label>
              <Switch
                checked={formData.preferences.publicProfile}
                onCheckedChange={v => updatePref('publicProfile', v)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {onOpenChange && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
            >
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : isUpdate ? (
                'Update Profile'
              ) : (
                'Create Profile'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
