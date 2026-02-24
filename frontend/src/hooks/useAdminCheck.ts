import { useInternetIdentity } from './useInternetIdentity';
import { useIsAdmin, useIsSuperAdmin } from './useAdminQueries';

export function useAdminCheck() {
  const { identity } = useInternetIdentity();
  const principalStr = identity ? identity.getPrincipal().toString() : null;

  const { data: isAdminData, isLoading: isAdminLoading } = useIsAdmin(principalStr);
  const { data: isSuperAdminData, isLoading: isSuperAdminLoading } = useIsSuperAdmin(principalStr);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return {
      isAdmin: false,
      isSuperAdmin: false,
      isLoading: false,
    };
  }

  return {
    isAdmin: isAdminData ?? false,
    isSuperAdmin: isSuperAdminData ?? false,
    isLoading: isAdminLoading || isSuperAdminLoading,
  };
}
