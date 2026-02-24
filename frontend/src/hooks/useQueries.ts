import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '../backend';
import { UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// Define PlayerProfile type locally since backend doesn't export it
export interface PlayerProfile {
  name: string;
  freeFireUid: string | null;
}

// Re-export UserProfile for convenience
export type { UserProfile };

// ─── User Profile (new full CRUD) ────────────────────────────────────────────

export function useGetMyProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyProfile();
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

// ─── Legacy / authorization component hooks ──────────────────────────────────

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

// Tournament Registration Mutation — submits a payment for the tournament
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

// Admin Check Hook - uses backend isCallerAdmin function
export function useAdminCheck() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
  };
}

// Get My Principal ID — derived from identity, no actor call needed
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

// Add Admin Mutation — assigns admin role to a user by principal text
export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalText);
      await actor.assignCallerUserRole(principal, UserRole.admin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// Remove Admin Mutation — demotes a user to regular user role
export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalText);
      await actor.assignCallerUserRole(principal, UserRole.user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// Legacy Admin Check (for backward compatibility)
export function useIsCallerAdmin() {
  return useAdminCheck();
}

// Notifications
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
  return notifications?.filter(n => !n.read).length || 0;
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

// Player Statistics
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

// Player Rank
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

// Tournament Comments
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

// Squads
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

// Referrals
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

// Featured Tournaments
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

// Practice Matches
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

// Tournament Templates (Admin)
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

// Bulk Tournament Creation (Admin)
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

// User Verification (Admin)
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

// Tournament type definition (local mock type, separate from backend Tournament)
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

// Mock data for demonstration
export const MOCK_TOURNAMENTS: MockTournament[] = [
  {
    id: '1',
    mode: 'Solo',
    entryFee: 50,
    prizePool: 1000,
    maxSlots: 100,
    registeredPlayers: 67,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-SOLO-001',
    roomPassword: 'PASS123',
    status: 'upcoming',
    isFeatured: false,
    isPractice: false,
  },
  {
    id: '2',
    mode: 'Duo',
    entryFee: 100,
    prizePool: 2500,
    maxSlots: 50,
    registeredPlayers: 42,
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-DUO-002',
    roomPassword: 'DUO456',
    status: 'upcoming',
    isFeatured: true,
    isPractice: false,
    sponsor: 'Code 11',
  },
  {
    id: '3',
    mode: 'Squad',
    entryFee: 200,
    prizePool: 5000,
    maxSlots: 25,
    registeredPlayers: 25,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-SQUAD-003',
    roomPassword: 'SQUAD789',
    status: 'ongoing',
    isFeatured: true,
    isPractice: false,
  },
  {
    id: '4',
    mode: 'Solo',
    entryFee: 0,
    prizePool: 0,
    maxSlots: 50,
    registeredPlayers: 12,
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-PRAC-004',
    roomPassword: 'PRAC000',
    status: 'upcoming',
    isFeatured: false,
    isPractice: true,
  },
];

export const MOCK_FEATURED_TOURNAMENTS: MockTournament[] = MOCK_TOURNAMENTS.filter(t => t.isFeatured);
export const MOCK_PRACTICE_MATCHES: MockTournament[] = MOCK_TOURNAMENTS.filter(t => t.isPractice);

// Mock Notifications
export interface MockNotification {
  id: string;
  title: string;
  message: string;
  type: 'tournamentUpdate' | 'resultAnnouncement' | 'reminder' | 'registrationConfirmation' | 'systemNotification';
  read: boolean;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: '1',
    title: 'Tournament Starting Soon',
    message: 'Solo Championship #1 starts in 30 minutes. Get ready!',
    type: 'reminder',
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Registration Confirmed',
    message: 'You have successfully registered for Duo Battle #5.',
    type: 'registrationConfirmation',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Results Announced',
    message: 'Squad Showdown results are now available. Check your ranking!',
    type: 'resultAnnouncement',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'New Tournament Available',
    message: 'A new Battle Royale tournament has been created. Register now!',
    type: 'tournamentUpdate',
    read: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Player Stats
export const MOCK_PLAYER_STATS = {
  tournamentsPlayed: 24,
  wins: 7,
  totalKills: 312,
  winRate: 29.2,
  avgKills: 13,
  earnings: 12500,
  history: [
    { month: 'Sep', winRate: 22 },
    { month: 'Oct', winRate: 25 },
    { month: 'Nov', winRate: 28 },
    { month: 'Dec', winRate: 24 },
    { month: 'Jan', winRate: 31 },
    { month: 'Feb', winRate: 29 },
  ],
  killsHistory: [
    { tournament: 'T1', kills: 8 },
    { tournament: 'T2', kills: 15 },
    { tournament: 'T3', kills: 11 },
    { tournament: 'T4', kills: 18 },
    { tournament: 'T5', kills: 9 },
    { tournament: 'T6', kills: 14 },
  ],
  earningsHistory: [
    { month: 'Sep', earnings: 1500 },
    { month: 'Oct', earnings: 2200 },
    { month: 'Nov', earnings: 1800 },
    { month: 'Dec', earnings: 3000 },
    { month: 'Jan', earnings: 2500 },
    { month: 'Feb', earnings: 1500 },
  ],
};

// Mock Player Rank
export const MOCK_PLAYER_RANK = {
  rank: 42,
  tier: 'Gold',
  points: 2840,
  nextTierPoints: 3000,
};

// Mock Comments
export const MOCK_COMMENTS = [
  {
    id: '1',
    author: 'ProPlayer99',
    content: 'This tournament looks amazing! Can\'t wait to compete.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    author: 'GamingLegend',
    content: 'The prize pool is insane. Good luck everyone!',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Squad
export const MOCK_SQUAD = {
  id: 'squad-1',
  name: 'Alpha Squad',
  tag: 'ALPH',
  captain: 'You',
  totalTournaments: 12,
  wins: 4,
  members: [
    { id: '1', name: 'You', role: 'Captain', kills: 145, wins: 4 },
    { id: '2', name: 'ProSniper', role: 'Member', kills: 132, wins: 4 },
    { id: '3', name: 'RushMaster', role: 'Member', kills: 98, wins: 3 },
    { id: '4', name: 'SupportKing', role: 'Member', kills: 67, wins: 4 },
  ],
};

// Mock Squad Invitations
export const MOCK_SQUAD_INVITATIONS = [
  {
    id: 'inv-1',
    squadName: 'Dragon Force',
    squadTag: 'DRGN',
    invitedBy: 'DragonLeader',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Referral Stats
export const MOCK_REFERRAL_STATS = {
  referralCode: 'CODE11-REF-XYZ',
  totalReferrals: 8,
  completedReferrals: 5,
  pendingReferrals: 3,
  totalEarnings: 400,
  referrals: [
    { id: '1', name: 'Player123', status: 'completed', joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', name: 'GamerX', status: 'completed', joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', name: 'ProGamer', status: 'pending', joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  ],
};

// Mock Tournament Templates
export const MOCK_TOURNAMENT_TEMPLATES = [
  { id: 'tmpl-1', name: 'Standard Solo', gameType: 'Solo', entryFee: 50, prizePool: 1000, maxParticipants: 100 },
  { id: 'tmpl-2', name: 'Premium Squad', gameType: 'Squad', entryFee: 200, prizePool: 5000, maxParticipants: 25 },
];
