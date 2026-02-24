import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Check, X, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useListPendingPayments, useApprovePayment, useRejectPayment } from '../../hooks/usePaymentQueries';
import type { Payment } from '../../hooks/usePaymentQueries';

function formatPrincipal(principal: { toString(): string }): string {
  const str = principal.toString();
  if (str.length <= 16) return str;
  return `${str.slice(0, 8)}...${str.slice(-8)}`;
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface PaymentRowProps {
  payment: Payment;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function PaymentRow({ payment, onApprove, onReject, isApproving, isRejecting }: PaymentRowProps) {
  const isBusy = isApproving || isRejecting;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 shrink-0">
            Payment #{payment.id.toString()}
          </Badge>
          <span className="text-xs text-gray-500">Tournament #{payment.tournamentId.toString()}</span>
        </div>
        <p className="text-sm text-gray-300 font-mono truncate">
          {formatPrincipal(payment.playerPrincipal)}
        </p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {formatDate(payment.submittedAt)}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600"
              disabled={isBusy}
            >
              {isApproving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Approve
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-green-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Approve Payment</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Approve payment #{payment.id.toString()} from{' '}
                <span className="font-mono text-gray-300">{formatPrincipal(payment.playerPrincipal)}</span>?
                This will allow the player to join Tournament #{payment.tournamentId.toString()}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onApprove(payment.id)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              disabled={isBusy}
            >
              {isRejecting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              ) : (
                <X className="h-4 w-4 mr-1" />
              )}
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-red-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Reject Payment</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Reject payment #{payment.id.toString()} from{' '}
                <span className="font-mono text-gray-300">{formatPrincipal(payment.playerPrincipal)}</span>?
                The player will not be able to join Tournament #{payment.tournamentId.toString()}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onReject(payment.id)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function PaymentManagementPanel() {
  const [processingId, setProcessingId] = useState<bigint | null>(null);
  const [processingAction, setProcessingAction] = useState<'approve' | 'reject' | null>(null);

  const { data: pendingPayments, isLoading, error, refetch } = useListPendingPayments();
  const approveMutation = useApprovePayment();
  const rejectMutation = useRejectPayment();

  const handleApprove = async (paymentId: bigint) => {
    setProcessingId(paymentId);
    setProcessingAction('approve');
    try {
      await approveMutation.mutateAsync(paymentId);
      toast.success(`Payment #${paymentId.toString()} approved successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve payment');
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  const handleReject = async (paymentId: bigint) => {
    setProcessingId(paymentId);
    setProcessingAction('reject');
    try {
      await rejectMutation.mutateAsync(paymentId);
      toast.success(`Payment #${paymentId.toString()} rejected`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject payment');
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-2 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              Pending Payment Requests
              {pendingPayments && pendingPayments.length > 0 && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                  {pendingPayments.length}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full bg-gray-800" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              <p>Failed to load pending payments.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-3 border-red-500/30 text-red-400"
              >
                Try Again
              </Button>
            </div>
          ) : !pendingPayments || pendingPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Check className="h-12 w-12 mx-auto mb-3 opacity-30 text-green-400" />
              <p>No pending payment requests.</p>
              <p className="text-sm mt-1">All payments have been processed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <PaymentRow
                  key={payment.id.toString()}
                  payment={payment}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isApproving={processingId === payment.id && processingAction === 'approve'}
                  isRejecting={processingId === payment.id && processingAction === 'reject'}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
