import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useGetAdmins() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdmins();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSuperAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal | null>({
    queryKey: ['superAdmin'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSuperAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalStr: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalStr);
      await actor.addAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalStr: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalStr);
      await actor.removeAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useIsAdmin(principalStr: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin', principalStr],
    queryFn: async () => {
      if (!actor || !principalStr) return false;
      const principal = Principal.fromText(principalStr);
      return actor.isAdmin(principal);
    },
    enabled: !!actor && !isFetching && !!principalStr,
  });
}

export function useIsSuperAdmin(principalStr: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isSuperAdmin', principalStr],
    queryFn: async () => {
      if (!actor || !principalStr) return false;
      const principal = Principal.fromText(principalStr);
      return actor.isSuperAdmin(principal);
    },
    enabled: !!actor && !isFetching && !!principalStr,
  });
}

/**
 * Attempts to claim super admin for the currently logged-in user.
 * The backend auto-assigns super admin to the first caller of addAdmin
 * when no super admin exists yet (via ensureSuperAdminInitialized).
 * If a super admin already exists and the caller is not them, the call
 * will fail silently (the error is swallowed).
 */
export function useClaimSuperAdmin() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!actor || !identity) throw new Error('Not authenticated');

      // Check if super admin already exists first (query call)
      const existingSuperAdmin = await actor.getSuperAdmin();
      const callerPrincipal = identity.getPrincipal();

      if (existingSuperAdmin !== null) {
        // Super admin already exists — check if it's us
        return existingSuperAdmin.toString() === callerPrincipal.toString();
      }

      // No super admin yet — call addAdmin with our own principal.
      // The backend's ensureSuperAdminInitialized will set us as super admin
      // since this is an update call that persists state.
      await actor.addAdmin(callerPrincipal);
      return true;
    },
    onSuccess: (becameSuperAdmin: boolean) => {
      if (becameSuperAdmin) {
        queryClient.invalidateQueries({ queryKey: ['superAdmin'] });
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
        queryClient.invalidateQueries({ queryKey: ['isSuperAdmin'] });
        toast.success('You have been assigned as Super Admin!', {
          description: 'You now have full administrative access.',
          duration: 5000,
        });
      }
    },
    onError: () => {
      // Silently swallow errors — super admin may already be assigned
    },
  });
}
