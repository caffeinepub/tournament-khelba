import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Payment } from '../backend';

export type { Payment };

export function useListPendingPayments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['pendingPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPendingPayments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListPaymentsByTournament(tournamentId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['paymentsByTournament', tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || tournamentId === null) return [];
      return actor.listPaymentsByTournament(tournamentId);
    },
    enabled: !!actor && !actorFetching && tournamentId !== null,
  });
}

export function useApprovePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: bigint): Promise<void> => {
      if (!actor) throw new Error('Actor not available');
      await actor.approvePayment(paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentsByTournament'] });
    },
  });
}

export function useRejectPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: bigint): Promise<void> => {
      if (!actor) throw new Error('Actor not available');
      await actor.rejectPayment(paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentsByTournament'] });
    },
  });
}

export function useSubmitPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: bigint): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPayment(tournamentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentsByTournament'] });
    },
  });
}
