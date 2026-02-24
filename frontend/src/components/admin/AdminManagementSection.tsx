import React, { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAdmins, useGetSuperAdmin, useAddAdmin, useRemoveAdmin } from '../../hooks/useAdminQueries';
import { useIsSuperAdmin } from '../../hooks/useAdminQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Copy, UserPlus, UserMinus, Shield, Crown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function AdminManagementSection() {
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString() ?? null;

  const { data: admins, isLoading: adminsLoading } = useGetAdmins();
  const { data: superAdmin, isLoading: superAdminLoading } = useGetSuperAdmin();
  const { data: isSuperAdminUser } = useIsSuperAdmin(currentPrincipal);

  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();

  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);

  const isLoading = adminsLoading || superAdminLoading;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const validatePrincipal = (str: string): boolean => {
    try {
      Principal.fromText(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddAdmin = async () => {
    const trimmed = newAdminPrincipal.trim();
    if (!trimmed) {
      toast.error('Please enter a principal ID');
      return;
    }
    if (!validatePrincipal(trimmed)) {
      toast.error('Invalid principal ID format');
      return;
    }
    try {
      await addAdminMutation.mutateAsync(trimmed);
      toast.success('Admin added successfully!');
      setNewAdminPrincipal('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add admin';
      toast.error(msg.includes('Unauthorized') ? 'Only the super admin can add admins' : msg);
    }
  };

  const handleRemoveAdmin = async (principalStr: string) => {
    try {
      await removeAdminMutation.mutateAsync(principalStr);
      toast.success('Admin removed successfully!');
      setAdminToRemove(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove admin';
      toast.error(msg.includes('Unauthorized') ? 'Only the super admin can remove admins' : msg);
    }
  };

  const superAdminStr = superAdmin?.toString() ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
          <Shield className="w-5 h-5 text-neon-cyan" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Admin Management</h2>
          <p className="text-sm text-muted-foreground">Manage admin access to the platform</p>
        </div>
      </div>

      {/* Current User Info */}
      {currentPrincipal && (
        <div className="p-4 rounded-lg border border-border bg-card/50">
          <p className="text-xs text-muted-foreground mb-1">Your Principal ID</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-neon-cyan font-mono flex-1 truncate">{currentPrincipal}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => copyToClipboard(currentPrincipal)}
            >
              <Copy className="w-3 h-3" />
            </Button>
            {isSuperAdminUser && (
              <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/30 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Super Admin
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Super Admin Info */}
      {isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : superAdminStr ? (
        <div className="p-4 rounded-lg border border-neon-orange/30 bg-neon-orange/5">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-neon-orange" />
            <p className="text-sm font-semibold text-neon-orange">Super Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-foreground font-mono flex-1 truncate">{superAdminStr}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => copyToClipboard(superAdminStr)}
            >
              <Copy className="w-3 h-3" />
            </Button>
            {superAdminStr === currentPrincipal && (
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                You
              </Badge>
            )}
          </div>
        </div>
      ) : null}

      {/* Add Admin Form — super admin only */}
      {isSuperAdminUser && (
        <div className="p-4 rounded-lg border border-border bg-card/50 space-y-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-semibold text-foreground">Add New Admin</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter principal ID..."
              value={newAdminPrincipal}
              onChange={(e) => setNewAdminPrincipal(e.target.value)}
              className="font-mono text-xs bg-background border-border"
              onKeyDown={(e) => e.key === 'Enter' && handleAddAdmin()}
            />
            <Button
              onClick={handleAddAdmin}
              disabled={addAdminMutation.isPending || !newAdminPrincipal.trim()}
              className="bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30 shrink-0"
            >
              {addAdminMutation.isPending ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border border-neon-green border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Admin List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neon-cyan" />
          <h3 className="text-sm font-semibold text-foreground">
            Regular Admins
            {admins && (
              <span className="ml-2 text-xs text-muted-foreground">({admins.length})</span>
            )}
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : admins && admins.length > 0 ? (
          <div className="space-y-2">
            {admins.map((admin) => {
              const adminStr = admin.toString();
              const isCurrentUser = adminStr === currentPrincipal;
              return (
                <div
                  key={adminStr}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isCurrentUser
                      ? 'border-neon-cyan/40 bg-neon-cyan/5'
                      : 'border-border bg-card/30'
                  }`}
                >
                  <Shield className="w-4 h-4 text-neon-cyan shrink-0" />
                  <code className="text-xs font-mono text-foreground flex-1 truncate">{adminStr}</code>
                  {isCurrentUser && (
                    <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 text-xs shrink-0">
                      You
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => copyToClipboard(adminStr)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {isSuperAdminUser && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setAdminToRemove(adminStr)}
                        >
                          <UserMinus className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove admin access for:
                            <br />
                            <code className="text-xs font-mono text-neon-cyan break-all">{adminStr}</code>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleRemoveAdmin(adminStr)}
                            disabled={removeAdminMutation.isPending}
                          >
                            {removeAdminMutation.isPending ? 'Removing...' : 'Remove Admin'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-dashed border-border text-center">
            <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No regular admins added yet</p>
            {isSuperAdminUser && (
              <p className="text-xs text-muted-foreground mt-1">Use the form above to add admins</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
