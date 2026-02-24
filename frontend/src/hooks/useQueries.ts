import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '../backend';

// Re-export UserProfile for convenience
export type { UserProfile };

// ─── User Profile Hooks ───────────────────────────────────────────────────────

export function useGetMyProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useDeleteProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompleteness'] });
    },
  });
}

// Profile Completeness Query
export function useProfileCompleteness() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['profileCompleteness'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isProfileComplete();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ─── Payment Registration Hook ────────────────────────────────────────────────

export function useRegisterForTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitPayment(BigInt(tournamentId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['userTournaments'] });
    },
  });
}

// ─── Principal Hook ───────────────────────────────────────────────────────────

export function useGetMyPrincipal() {
  const { identity } = useInternetIdentity();

  return useQuery<string>({
    queryKey: ['myPrincipal', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) throw new Error('Not authenticated');
      return identity.getPrincipal().toString();
    },
    enabled: !!identity,
  });
}

// ─── Admin Check (re-exported from useAdminCheck for backward compat) ─────────

export { useAdminCheck } from './useAdminCheck';

// ─── Admin mutations (re-exported from useAdminQueries for backward compat) ───

export { useAddAdmin, useRemoveAdmin } from './useAdminQueries';

// ─── Notifications ────────────────────────────────────────────────────────────

export function useGetNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      return MOCK_NOTIFICATIONS;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUnreadNotificationCount() {
  const { data: notifications } = useGetNotifications();
  return notifications?.filter((n: any) => !n.read).length || 0;
}

export function useMarkNotificationAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_notificationId: string) => {
      if (!actor) throw new Error('Actor not available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ─── Player Statistics ────────────────────────────────────────────────────────

export function useGetPlayerStatistics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['playerStatistics'],
    queryFn: async () => {
      if (!actor) return null;
      return MOCK_PLAYER_STATS;
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Player Rank ──────────────────────────────────────────────────────────────

export function useGetPlayerRank() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['playerRank'],
    queryFn: async () => {
      if (!actor) return null;
      return MOCK_PLAYER_RANK;
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Tournament Comments ──────────────────────────────────────────────────────

export function useGetTournamentComments(tournamentId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['tournamentComments', tournamentId],
    queryFn: async () => {
      if (!actor) return [];
      return MOCK_COMMENTS;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePostComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentId, comment }: { tournamentId: string; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Post comment:', tournamentId, comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournamentComments', variables.tournamentId] });
    },
  });
}

// ─── Squads ───────────────────────────────────────────────────────────────────

export function useGetCurrentSquad() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['currentSquad'],
    queryFn: async () => {
      if (!actor) return null;
      return MOCK_SQUAD;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSquadInvitations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['squadInvitations'],
    queryFn: async () => {
      if (!actor) return [];
      return MOCK_SQUAD_INVITATIONS;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateSquad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, tag }: { name: string; tag: string }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Create squad:', name, tag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSquad'] });
    },
  });
}

export function useInviteSquadMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playerName: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Invite squad member:', playerName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSquad'] });
    },
  });
}

export function useAcceptSquadInvitation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Accept squad invitation:', invitationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squadInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['currentSquad'] });
    },
  });
}

export function useDeclineSquadInvitation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Decline squad invitation:', invitationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squadInvitations'] });
    },
  });
}

export function useDisbandSquad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('Disband squad');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSquad'] });
    },
  });
}

export function useLeaveSquad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('Leave squad');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSquad'] });
    },
  });
}

export function useRegisterSquadForTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Register squad for tournament:', tournamentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

// ─── Referrals ────────────────────────────────────────────────────────────────

export function useGetReferralStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['referralStats'],
    queryFn: async () => {
      if (!actor) return null;
      return MOCK_REFERRAL_STATS;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useValidateReferralCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (_code: string) => {
      if (!actor) throw new Error('Actor not available');
      return true;
    },
  });
}

// ─── Featured Tournaments ─────────────────────────────────────────────────────

export function useGetFeaturedTournaments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['featuredTournaments'],
    queryFn: async () => {
      if (!actor) return [];
      return MOCK_FEATURED_TOURNAMENTS;
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Practice Matches ─────────────────────────────────────────────────────────

export function useGetPracticeMatches() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['practiceMatches'],
    queryFn: async () => {
      if (!actor) return [];
      return MOCK_PRACTICE_MATCHES;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRegisterForPracticeMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Register for practice match:', matchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practiceMatches'] });
    },
  });
}

// ─── Tournament Templates (Admin) ─────────────────────────────────────────────

export function useGetTournamentTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['tournamentTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return MOCK_TOURNAMENT_TEMPLATES;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: unknown) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Save template:', template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournamentTemplates'] });
    },
  });
}

export function useDeleteTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Delete template:', templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournamentTemplates'] });
    },
  });
}

// ─── Bulk Tournament Creation (Admin) ─────────────────────────────────────────

export function useBulkCreateTournaments() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { occurrences: number }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Bulk create tournaments:', params);
      return { count: params.occurrences };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

// ─── User Verification (Admin) ────────────────────────────────────────────────

export function useVerifyUserUID() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Verify user UID:', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useVerifyUserPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Verify user payment:', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// ─── Legacy Admin Check (for backward compatibility) ─────────────────────────

export function useIsCallerAdmin() {
  return useAdminCheck();
}

// ─── Mock Tournament type (for legacy components) ─────────────────────────────

export interface MockTournament {
  id: string;
  mode: 'Solo' | 'Duo' | 'Squad';
  entryFee: number;
  prizePool: number;
  maxSlots: number;
  registeredPlayers: number;
  startTime: string;
  roomId: string;
  roomPassword: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured?: boolean;
  isPractice?: boolean;
  sponsor?: string;
}

// Legacy Tournament alias kept for components that still reference it
export type Tournament = MockTournament;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_TOURNAMENTS: MockTournament[] = [
  {
    id: 'mock-1',
    mode: 'Solo',
    entryFee: 50,
    prizePool: 5000,
    maxSlots: 100,
    registeredPlayers: 67,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    roomId: 'ROOM123',
    roomPassword: 'pass123',
    status: 'upcoming',
    isFeatured: true,
    sponsor: 'Code 11',
  },
  {
    id: 'mock-2',
    mode: 'Duo',
    entryFee: 100,
    prizePool: 10000,
    maxSlots: 50,
    registeredPlayers: 32,
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    roomId: 'ROOM456',
    roomPassword: 'pass456',
    status: 'upcoming',
    isFeatured: true,
  },
  {
    id: 'mock-3',
    mode: 'Squad',
    entryFee: 200,
    prizePool: 20000,
    maxSlots: 25,
    registeredPlayers: 18,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    roomId: 'ROOM789',
    roomPassword: 'pass789',
    status: 'upcoming',
  },
  {
    id: 'mock-4',
    mode: 'Solo',
    entryFee: 0,
    prizePool: 0,
    maxSlots: 100,
    registeredPlayers: 45,
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    roomId: 'PRACTICE1',
    roomPassword: 'practice',
    status: 'upcoming',
    isPractice: true,
  },
];

const MOCK_FEATURED_TOURNAMENTS: MockTournament[] = MOCK_TOURNAMENTS.filter(t => t.isFeatured);
const MOCK_PRACTICE_MATCHES: MockTournament[] = MOCK_TOURNAMENTS.filter(t => t.isPractice);

const MOCK_TOURNAMENT_TEMPLATES = [
  { id: 'tpl-1', name: 'Solo Blitz', mode: 'Solo', entryFee: 50, prizePool: 5000, maxSlots: 100 },
  { id: 'tpl-2', name: 'Duo Classic', mode: 'Duo', entryFee: 100, prizePool: 10000, maxSlots: 50 },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'registrationConfirmation',
    message: 'Your registration for Solo Tournament has been confirmed!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
  },
  {
    id: 'notif-2',
    type: 'reminder',
    message: 'Tournament starts in 2 hours. Get ready!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'notif-3',
    type: 'resultAnnouncement',
    message: 'Results for last week\'s Squad Tournament are now available.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'notif-4',
    type: 'tournamentUpdate',
    message: 'Duo Tournament prize pool has been increased to ৳15,000!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

const MOCK_PLAYER_STATS = {
  tournamentsPlayed: 24,
  wins: 7,
  winRate: 29,
  avgKills: 4.2,
  earnings: 12500,
  history: [
    { month: 'Jan', winRate: 20 },
    { month: 'Feb', winRate: 25 },
    { month: 'Mar', winRate: 22 },
    { month: 'Apr', winRate: 30 },
    { month: 'May', winRate: 28 },
    { month: 'Jun', winRate: 35 },
  ],
  killsHistory: [
    { tournament: 'T1', kills: 3 },
    { tournament: 'T2', kills: 6 },
    { tournament: 'T3', kills: 2 },
    { tournament: 'T4', kills: 8 },
    { tournament: 'T5', kills: 5 },
    { tournament: 'T6', kills: 4 },
  ],
  earningsHistory: [
    { month: 'Jan', earnings: 0 },
    { month: 'Feb', earnings: 2000 },
    { month: 'Mar', earnings: 1500 },
    { month: 'Apr', earnings: 3000 },
    { month: 'May', earnings: 2500 },
    { month: 'Jun', earnings: 3500 },
  ],
};

const MOCK_PLAYER_RANK = {
  rank: 42,
  tier: 'Gold',
  points: 1250,
  nextTierPoints: 1500,
};

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: 'ProGamer99',
    message: 'This tournament looks amazing! Can\'t wait to compete.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'c2',
    author: 'FireStorm',
    message: 'Prize pool is insane. Good luck everyone!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const MOCK_SQUAD = {
  id: 'squad-1',
  name: 'Alpha Squad',
  tag: 'ALPH',
  captain: 'principal-1',
  totalTournaments: 12,
  wins: 4,
  members: [
    { id: 'm1', name: 'ProGamer99', role: 'Captain', kills: 156, wins: 4 },
    { id: 'm2', name: 'FireStorm', role: 'Member', kills: 134, wins: 3 },
    { id: 'm3', name: 'ShadowBlade', role: 'Member', kills: 98, wins: 2 },
    { id: 'm4', name: 'NightHawk', role: 'Member', kills: 112, wins: 3 },
  ],
};

const MOCK_SQUAD_INVITATIONS = [
  {
    id: 'inv-1',
    squadName: 'Dragon Squad',
    invitedBy: 'DragonMaster',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
];

const MOCK_REFERRAL_STATS = {
  referralCode: 'KHELBA2024',
  totalReferrals: 8,
  completedReferrals: 5,
  pendingReferrals: 3,
  totalEarnings: 2500,
  referrals: [
    { id: 'r1', name: 'Player123', status: 'completed', earnings: 500, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { id: 'r2', name: 'GamerX', status: 'completed', earnings: 500, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { id: 'r3', name: 'FireBolt', status: 'pending', earnings: 0, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ],
};

// Re-import useAdminCheck here so the re-export above works
import { useAdminCheck } from './useAdminCheck';
