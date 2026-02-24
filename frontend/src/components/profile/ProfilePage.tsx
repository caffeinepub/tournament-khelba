import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Edit2,
  Save,
  X,
  Trash2,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Image,
  Bell,
  Eye,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  useGetMyProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
} from '../../hooks/useQueries';
import type { UserProfile } from '../../backend';

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  pushNotifications: true,
  publicProfile: true,
};

const EMPTY_PROFILE: UserProfile = {
  displayName: '',
  avatarUrl: '',
  bio: '',
  email: '',
  phone: '',
  country: '',
  preferences: DEFAULT_PREFERENCES,
};

function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full bg-gray-800" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48 bg-gray-800" />
              <Skeleton className="h-4 w-64 bg-gray-800" />
              <Skeleton className="h-4 w-40 bg-gray-800" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-4 w-32 bg-gray-800" />
          <Skeleton className="h-10 w-full bg-gray-800" />
          <Skeleton className="h-4 w-32 bg-gray-800" />
          <Skeleton className="h-10 w-full bg-gray-800" />
        </CardContent>
      </Card>
    </div>
  );
}

function CreateProfilePrompt({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-6">
          <div className="h-20 w-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center">
            <UserPlus className="h-10 w-10 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">No Profile Yet</h2>
            <p className="text-gray-400 max-w-sm">
              Create your player profile to participate in tournaments, track your stats, and connect with other players.
            </p>
          </div>
          <Button
            onClick={onCreate}
            className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold px-8"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: profile, isLoading, isFetched } = useGetMyProfile();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(EMPTY_PROFILE);

  // Redirect unauthenticated users to home (login is shown at root level)
  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  if (isLoading || !isFetched) {
    return <ProfileSkeleton />;
  }

  const startCreate = () => {
    setFormData(EMPTY_PROFILE);
    setIsCreating(true);
  };

  const startEdit = () => {
    if (profile) {
      setFormData({ ...profile });
    }
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setFormData(EMPTY_PROFILE);
  };

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    try {
      if (isCreating) {
        await createProfile.mutateAsync(formData);
        toast.success('Profile created successfully!');
        setIsCreating(false);
      } else {
        await updateProfile.mutateAsync(formData);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
      setFormData(EMPTY_PROFILE);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save profile. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile.mutateAsync();
      toast.success('Profile deleted successfully.');
      navigate({ to: '/' });
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete profile. Please try again.');
    }
  };

  const isSaving = createProfile.isPending || updateProfile.isPending;

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updatePref = (key: keyof UserProfile['preferences'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  // ── No profile exists ──────────────────────────────────────────────────────
  if (!profile && !isCreating) {
    return <CreateProfilePrompt onCreate={startCreate} />;
  }

  // ── Create form ────────────────────────────────────────────────────────────
  if (isCreating) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Create Your Profile</h1>
          <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
        <ProfileForm
          formData={formData}
          updateField={updateField}
          updatePref={updatePref}
          onSave={handleSave}
          onCancel={cancelEdit}
          isSaving={isSaving}
          isNew
        />
      </div>
    );
  }

  // ── View / Edit ────────────────────────────────────────────────────────────
  const displayProfile = isEditing ? formData : profile!;
  const avatarSrc = displayProfile.avatarUrl || '/assets/generated/default-avatar.dim_200x200.png';
  const initials = displayProfile.displayName
    ? displayProfile.displayName.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">My Profile</h1>
        {!isEditing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={startEdit}
              className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-red-500/40 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Profile?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. Your profile and all associated data will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteProfile.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteProfile.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...</>
                    ) : (
                      'Delete Profile'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4 mr-1" /> Save</>
              )}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Avatar + Display Name */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-cyan-500/50 shrink-0">
              <AvatarImage src={avatarSrc} alt={displayProfile.displayName} />
              <AvatarFallback className="bg-gray-800 text-2xl font-bold text-cyan-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Display Name *</Label>
                    <Input
                      value={formData.displayName}
                      onChange={e => updateField('displayName', e.target.value)}
                      placeholder="Your display name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                      <Image className="h-3 w-3" /> Avatar URL
                    </Label>
                    <Input
                      value={formData.avatarUrl}
                      onChange={e => updateField('avatarUrl', e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-white truncate">{displayProfile.displayName}</h2>
                  {displayProfile.bio && (
                    <p className="text-gray-400 mt-1 text-sm line-clamp-2">{displayProfile.bio}</p>
                  )}
                  {displayProfile.country && (
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {displayProfile.country}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" /> Personal Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-1">
                <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Bio
                </Label>
                <Textarea
                  value={formData.bio}
                  onChange={e => updateField('bio', e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Country
                  </Label>
                  <Input
                    value={formData.country}
                    onChange={e => updateField('country', e.target.value)}
                    placeholder="e.g. Bangladesh"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {displayProfile.bio && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Bio
                  </p>
                  <p className="text-gray-200 text-sm">{displayProfile.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayProfile.email && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="text-gray-200 text-sm">{displayProfile.email}</p>
                  </div>
                )}
                {displayProfile.phone && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="text-gray-200 text-sm">{displayProfile.phone}</p>
                  </div>
                )}
                {displayProfile.country && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Country
                    </p>
                    <p className="text-gray-200 text-sm">{displayProfile.country}</p>
                  </div>
                )}
              </div>
              {!displayProfile.bio && !displayProfile.email && !displayProfile.phone && !displayProfile.country && (
                <p className="text-gray-500 text-sm italic">No personal info added yet. Click Edit to add details.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-cyan-400" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" /> Email Notifications
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Receive tournament updates via email</p>
            </div>
            <Switch
              checked={isEditing ? formData.preferences.emailNotifications : displayProfile.preferences.emailNotifications}
              onCheckedChange={v => isEditing && updatePref('emailNotifications', v)}
              disabled={!isEditing}
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-400" /> Push Notifications
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Get real-time alerts in the app</p>
            </div>
            <Switch
              checked={isEditing ? formData.preferences.pushNotifications : displayProfile.preferences.pushNotifications}
              onCheckedChange={v => isEditing && updatePref('pushNotifications', v)}
              disabled={!isEditing}
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" /> Public Profile
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Allow other players to view your profile</p>
            </div>
            <Switch
              checked={isEditing ? formData.preferences.publicProfile : displayProfile.preferences.publicProfile}
              onCheckedChange={v => isEditing && updatePref('publicProfile', v)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Shared form used for "Create" flow ────────────────────────────────────────
interface ProfileFormProps {
  formData: UserProfile;
  updateField: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  updatePref: (key: keyof UserProfile['preferences'], value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isNew?: boolean;
}

function ProfileForm({ formData, updateField, updatePref, onSave, onCancel, isSaving, isNew }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      {/* Avatar preview */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-cyan-500/50 shrink-0">
              <AvatarImage
                src={formData.avatarUrl || '/assets/generated/default-avatar.dim_200x200.png'}
                alt="Avatar preview"
              />
              <AvatarFallback className="bg-gray-800 text-xl font-bold text-cyan-400">
                {formData.displayName ? formData.displayName.slice(0, 2).toUpperCase() : '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <Label className="text-gray-400 text-xs uppercase tracking-wider">Display Name *</Label>
                <Input
                  value={formData.displayName}
                  onChange={e => updateField('displayName', e.target.value)}
                  placeholder="Your display name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Image className="h-3 w-3" /> Avatar URL
                </Label>
                <Input
                  value={formData.avatarUrl}
                  onChange={e => updateField('avatarUrl', e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" /> Personal Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
              <FileText className="h-3 w-3" /> Bio
            </Label>
            <Textarea
              value={formData.bio}
              onChange={e => updateField('bio', e.target.value)}
              placeholder="Tell others about yourself..."
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="you@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <Globe className="h-3 w-3" /> Country
              </Label>
              <Input
                value={formData.country}
                onChange={e => updateField('country', e.target.value)}
                placeholder="e.g. Bangladesh"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-cyan-400" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Email Notifications</p>
              <p className="text-gray-500 text-xs mt-0.5">Receive tournament updates via email</p>
            </div>
            <Switch
              checked={formData.preferences.emailNotifications}
              onCheckedChange={v => updatePref('emailNotifications', v)}
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Push Notifications</p>
              <p className="text-gray-500 text-xs mt-0.5">Get real-time alerts in the app</p>
            </div>
            <Switch
              checked={formData.preferences.pushNotifications}
              onCheckedChange={v => updatePref('pushNotifications', v)}
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Public Profile</p>
              <p className="text-gray-500 text-xs mt-0.5">Allow other players to view your profile</p>
            </div>
            <Switch
              checked={formData.preferences.publicProfile}
              onCheckedChange={v => updatePref('publicProfile', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
          ) : isNew ? (
            <><UserPlus className="h-4 w-4 mr-2" /> Create Profile</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Save Changes</>
          )}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
