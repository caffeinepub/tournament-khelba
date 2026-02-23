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
  const { data: myPrincipal } = useGetMyPrincipal();
  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();
  const [principalInput, setPrincipalInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Mock admin list - in real implementation, this would come from a backend query
  const adminList = myPrincipal ? [myPrincipal] : [];

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

    if (adminList.includes(principalInput.trim())) {
      toast.error('This principal is already an admin');
      return;
    }

    try {
      await addAdminMutation.mutateAsync(principalInput.trim());
      toast.success('Admin added successfully!');
      setPrincipalInput('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (principalId: string) => {
    if (adminList.length === 1) {
      toast.error('Cannot remove the last admin');
      return;
    }

    try {
      await removeAdminMutation.mutateAsync(principalId);
      toast.success('Admin removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove admin');
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-cyan-500/10 border-cyan-500/30">
        <Info className="h-4 w-4 text-cyan-400" />
        <AlertDescription className="text-cyan-200">
          <strong>Admin Management:</strong> Add or remove admin principals. At least one admin must remain at all times.
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
            Current Admins ({adminList.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            List of all principals with admin access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No admins found. Add the first admin above.
            </div>
          ) : (
            <div className="space-y-3">
              {adminList.map((principal, index) => (
                <div
                  key={principal}
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-orange-500/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Admin #{index + 1}
                      {principal === myPrincipal && (
                        <span className="ml-2 text-xs text-cyan-400">(You)</span>
                      )}
                    </p>
                    <p className="text-xs font-mono text-gray-500 truncate">
                      {principal}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={adminList.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-red-500/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Remove Admin Access</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to remove admin access for this principal? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveAdmin(principal)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={removeAdminMutation.isPending}
                        >
                          {removeAdminMutation.isPending ? 'Removing...' : 'Remove Admin'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
