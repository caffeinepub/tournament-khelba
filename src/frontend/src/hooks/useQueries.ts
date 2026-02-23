import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Define PlayerProfile type locally since backend doesn't export it
export interface PlayerProfile {
  name: string;
  freeFireUid: string | null;
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PlayerProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend not implemented yet - return mock data
      return null;
    },
    enabled: !!actor && !actorFetching,
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
    mutationFn: async (profile: { name: string; freeFireUid: string; referralCode?: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend not implemented yet
      console.log('Save profile:', profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
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

// Tournament Registration Mutation
export function useRegisterForTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.registerForTournament(tournamentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['userTournaments'] });
    },
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Notifications
export function useGetNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend not implemented yet - return mock data
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
    mutationFn: async (notificationId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend not implemented yet
      console.log('Mark notification as read:', notificationId);
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet - return mock data
      return MOCK_REFERRAL_STATS;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useValidateReferralCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend not implemented yet
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet - return mock data
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
      // Backend not implemented yet
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
      // Backend not implemented yet - return mock data
      return MOCK_TOURNAMENT_TEMPLATES;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: any) => {
      if (!actor) throw new Error('Actor not available');
      // Backend not implemented yet
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
      // Backend not implemented yet
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
    mutationFn: async (params: any) => {
      if (!actor) throw new Error('Actor not available');
      // Backend not implemented yet
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
      // Backend not implemented yet
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
      // Backend not implemented yet
      console.log('Verify user payment:', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Tournament type definition
export interface Tournament {
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

// Mock data for demonstration
export const MOCK_TOURNAMENTS: Tournament[] = [
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
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-DUO-002',
    roomPassword: 'DUO456',
    status: 'upcoming',
    isFeatured: false,
    isPractice: false,
  },
  {
    id: '3',
    mode: 'Squad',
    entryFee: 200,
    prizePool: 5000,
    maxSlots: 25,
    registeredPlayers: 18,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-SQUAD-003',
    roomPassword: 'SQ789',
    status: 'upcoming',
    isFeatured: false,
    isPractice: false,
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    message: 'Solo Tournament #1 starts in 30 minutes!',
    type: 'reminder',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    message: 'Results for Duo Tournament #3 are now available',
    type: 'resultAnnouncement',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    message: 'Successfully registered for Squad Tournament #5',
    type: 'registrationConfirmation',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
];

const MOCK_PLAYER_STATS = {
  totalTournaments: 15,
  wins: 3,
  winRate: 20,
  averageKills: 8.5,
  totalEarnings: 1800,
  favoriteMode: 'Solo',
  winRateTrend: [
    { date: 'Week 1', winRate: 15 },
    { date: 'Week 2', winRate: 18 },
    { date: 'Week 3', winRate: 22 },
    { date: 'Week 4', winRate: 20 },
  ],
  killsPerTournament: [
    { tournament: 'T1', kills: 5 },
    { tournament: 'T2', kills: 12 },
    { tournament: 'T3', kills: 8 },
    { tournament: 'T4', kills: 10 },
    { tournament: 'T5', kills: 7 },
  ],
  earningsHistory: [
    { month: 'Jan', earnings: 300 },
    { month: 'Feb', earnings: 500 },
    { month: 'Mar', earnings: 1000 },
  ],
};

const MOCK_PLAYER_RANK = {
  tier: 'Gold',
  tierLevel: 3,
  progress: 65,
  nextTierRequirements: {
    winsNeeded: 5,
    winRateNeeded: 65,
  },
};

const MOCK_COMMENTS = [
  {
    id: '1',
    author: 'ProGamer',
    comment: 'Looking forward to this tournament! Good luck everyone!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    author: 'FireKing',
    comment: 'What time does the room open?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
];

const MOCK_SQUAD = {
  id: '1',
  name: 'Elite Warriors',
  tag: 'EW',
  captain: 'ProGamer',
  members: [
    { name: 'ProGamer', role: 'Captain', joinDate: '2024-01-15', stats: { wins: 8, kills: 120 } },
    { name: 'FireKing', role: 'Member', joinDate: '2024-01-20', stats: { wins: 5, kills: 85 } },
    { name: 'SquadLeader', role: 'Member', joinDate: '2024-02-01', stats: { wins: 6, kills: 95 } },
  ],
  performance: {
    tournamentsPlayed: 12,
    wins: 4,
    winRate: 33,
  },
};

const MOCK_SQUAD_INVITATIONS = [
  {
    id: '1',
    squadName: 'Thunder Squad',
    invitedBy: 'ThunderKing',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const MOCK_REFERRAL_STATS = {
  referralCode: 'PROG4M3R',
  totalReferrals: 5,
  completedReferrals: 3,
  totalEarnings: 150,
  referrals: [
    { name: 'NewPlayer1', status: 'completed', earnings: 50, date: '2024-02-10' },
    { name: 'NewPlayer2', status: 'completed', earnings: 50, date: '2024-02-15' },
    { name: 'NewPlayer3', status: 'pending', earnings: 0, date: '2024-02-20' },
  ],
};

const MOCK_FEATURED_TOURNAMENTS: Tournament[] = [
  {
    id: 'f1',
    mode: 'Squad',
    entryFee: 500,
    prizePool: 15000,
    maxSlots: 20,
    registeredPlayers: 12,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-FEATURED-001',
    roomPassword: 'FEAT123',
    status: 'upcoming',
    isFeatured: true,
    isPractice: false,
    sponsor: 'Code 11',
  },
];

const MOCK_PRACTICE_MATCHES: Tournament[] = [
  {
    id: 'p1',
    mode: 'Solo',
    entryFee: 0,
    prizePool: 0,
    maxSlots: 100,
    registeredPlayers: 45,
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    roomId: 'FF-PRACTICE-001',
    roomPassword: 'PRAC123',
    status: 'upcoming',
    isFeatured: false,
    isPractice: true,
  },
];

const MOCK_TOURNAMENT_TEMPLATES = [
  {
    id: 't1',
    name: 'Solo Quick',
    mode: 'Solo',
    entryFee: 50,
    prizePool: 1000,
    maxSlots: 100,
  },
  {
    id: 't2',
    name: 'Squad Premium',
    mode: 'Squad',
    entryFee: 200,
    prizePool: 5000,
    maxSlots: 25,
  },
];
