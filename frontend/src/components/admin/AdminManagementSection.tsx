import { useState } from 'react';
import { useGetMyPrincipal, useAddAdmin, useRemoveAdmin } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Shield, Trash2, UserPlus, Copy, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminManagementSection() {
  const { data: myPrincipal, isLoading: loadingPrincipal } = useGetMyPrincipal();
  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();
  const [principalInput, setPrincipalInput] = useState('');
  const [adminToRemove, setAdminToRemove] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyPrincipal = () => {
    if (myPrincipal) {
      navigator.clipboard.writeText(myPrincipal);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!principalInput.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    if (principalInput.trim() === myPrincipal) {
      toast.error('You are already an admin');
      return;
    }

    try {
      await addAdminMutation.mutateAsync(principalInput.trim());
      toast.success('Admin added successfully!');
      setPrincipalInput('');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add admin';
      toast.error(errorMessage);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!adminToRemove) return;

    try {
      await removeAdminMutation.mutateAsync(adminToRemove);
      toast.success('Admin removed successfully');
      setAdminToRemove('');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to remove admin';
      if (errorMessage.includes('Cannot remove yourself')) {
        toast.error('Cannot remove yourself as admin. At least one admin must remain in the system.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-cyan-500/10 border-cyan-500/30">
        <Info className="h-4 w-4 text-cyan-400" />
        <AlertDescription className="text-cyan-200">
          <strong>Admin Management:</strong> Add or remove admin principals. You cannot remove yourself to ensure at least one admin remains at all times.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Shield className="h-6 w-6" />
              Your Principal ID
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your unique Internet Identity principal ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPrincipal ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={myPrincipal || 'Loading...'}
                  readOnly
                  className="font-mono text-sm bg-gray-900 border-cyan-500/30"
                />
                <Button
                  onClick={handleCopyPrincipal}
                  variant="outline"
                  className="border-cyan-500/30 hover:bg-cyan-500/10"
                  disabled={!myPrincipal}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <UserPlus className="h-6 w-6" />
              Add New Admin
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter a principal ID to grant admin access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newAdminPrincipal" className="text-gray-300">
                  Principal ID
                </Label>
                <Input
                  id="newAdminPrincipal"
                  value={principalInput}
                  onChange={(e) => setPrincipalInput(e.target.value)}
                  placeholder="Enter principal ID..."
                  className="font-mono text-sm bg-gray-900 border-green-500/30"
                />
              </div>
              <Button
                type="submit"
                disabled={addAdminMutation.isPending}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {addAdminMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Shield className="h-6 w-6" />
            Remove Admin Access
          </CardTitle>
          <CardDescription className="text-gray-400">
            Remove admin privileges from a principal ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="removeAdminPrincipal" className="text-gray-300">
                Principal ID to Remove
              </Label>
              <Input
                id="removeAdminPrincipal"
                value={adminToRemove}
                onChange={(e) => setAdminToRemove(e.target.value)}
                placeholder="Enter principal ID to remove..."
                className="font-mono text-sm bg-gray-900 border-orange-500/30"
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  disabled={!adminToRemove.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Admin
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-red-500/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Remove Admin Access</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to remove admin access for this principal? 
                    This action cannot be undone. Note: You cannot remove yourself as admin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveAdmin}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={removeAdminMutation.isPending}
                  >
                    {removeAdminMutation.isPending ? 'Removing...' : 'Remove Admin'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
