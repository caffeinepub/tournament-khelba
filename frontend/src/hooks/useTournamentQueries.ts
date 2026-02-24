import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Tournament, TournamentUpdate } from '../backend';

export function useListTournaments() {
  const { actor, isFetching } = useActor();

  return useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTournaments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTournament(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Tournament | null>({
    queryKey: ['tournament', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getTournament(id);
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30s for room credential reveal
  });
}

export function useCreateTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      startDate: bigint;
      endDate: bigint;
      entryFee: bigint;
      maxParticipants: bigint;
      prizePool: bigint;
      gameType: string;
      roomId: string | null;
      roomPassword: string | null;
      roomVisibilityMinutes: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTournament(
        params.name,
        params.description,
        params.startDate,
        params.endDate,
        params.entryFee,
        params.maxParticipants,
        params.prizePool,
        params.gameType,
        params.roomId,
        params.roomPassword,
        params.roomVisibilityMinutes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

export function useUpdateTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: TournamentUpdate) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTournament(update);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.id.toString()] });
    },
  });
}

export function useIsUserRegistered(tournamentId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isUserRegistered', tournamentId.toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        // Check if user has an approved payment for this tournament
        // We use listPaymentsByTournament but that's admin-only.
        // Instead, we check via listPendingPayments is also admin-only.
        // The backend doesn't have a user-facing "isRegistered" query,
        // so we attempt submitPayment to detect registration indirectly.
        // Best approach: try to get payments for this tournament.
        // Since there's no user-facing endpoint, we return false for non-admins
        // and rely on the payment submission flow.
        // For now, we check if the user has submitted a payment by trying
        // to call a safe query. Since no direct endpoint exists, we return false.
        return false;
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
