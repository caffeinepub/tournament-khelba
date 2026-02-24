import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Trophy, Calendar, Users, DollarSign, ArrowLeft,
  Clock, Tag, Info, Key, Copy, Check, Lock, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useGetTournament } from '@/hooks/useTournamentQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useSubmitPayment } from '@/hooks/usePaymentQueries';

function formatDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatCurrency(amount: bigint): string {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

interface RoomCredentialsSectionProps {
  roomId?: string;
  roomPassword?: string;
  roomVisibilityMinutes?: bigint;
  startDate: bigint;
  isRegistered: boolean;
}

function RoomCredentialsSection({
  roomId,
  roomPassword,
  roomVisibilityMinutes,
  startDate,
  isRegistered,
}: RoomCredentialsSectionProps) {
  const [now, setNow] = useState(Date.now());
  const [copiedField, setCopiedField] = useState<'roomId' | 'roomPassword' | null>(null);

  // Update current time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!isRegistered) return null;

  // No room credentials configured at all
  if (!roomId && !roomPassword) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-base">
            <Key className="w-5 h-5 text-primary" />
            Room Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Room credentials have not been set yet. Check back closer to the tournament start time.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Compute reveal time
  const startMs = Number(startDate) / 1_000_000;
  const visibilityMs = roomVisibilityMinutes != null
    ? Number(roomVisibilityMinutes) * 60 * 1000
    : 0;
  const revealAtMs = startMs - visibilityMs;
  const isRevealed = now >= revealAtMs;

  const handleCopy = async (text: string, field: 'roomId' | 'roomPassword') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field === 'roomId' ? 'Room ID' : 'Password'} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!isRevealed) {
    const minutesLeft = Math.ceil((revealAtMs - now) / 60_000);
    const hoursLeft = Math.floor(minutesLeft / 60);
    const minsLeft = minutesLeft % 60;

    const timeStr = hoursLeft > 0
      ? `${hoursLeft}h ${minsLeft}m`
      : `${minutesLeft}m`;

    return (
      <Card className="bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-base">
            <Key className="w-5 h-5 text-primary" />
            Room Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="p-2 rounded-full bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">Credentials will be revealed soon</p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Room ID and Password will be visible in{' '}
                <span className="text-primary font-semibold">{timeStr}</span>
                {roomVisibilityMinutes != null && (
                  <span className="text-muted-foreground">
                    {' '}({roomVisibilityMinutes.toString()} minutes before start)
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span>This page auto-refreshes every 30 seconds</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Credentials are revealed
  return (
    <Card className="bg-card border-green-500/30">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Key className="w-5 h-5 text-green-400" />
          Room Credentials
          <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Use these credentials to join the tournament room:
        </p>
        {roomId && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Room ID</p>
              <p className="text-foreground font-mono font-semibold text-lg tracking-wider">{roomId}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(roomId, 'roomId')}
              className="border-border text-foreground hover:border-primary gap-1.5 shrink-0"
            >
              {copiedField === 'roomId' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedField === 'roomId' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}
        {roomPassword && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Room Password</p>
              <p className="text-foreground font-mono font-semibold text-lg tracking-wider">{roomPassword}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(roomPassword, 'roomPassword')}
              className="border-border text-foreground hover:border-primary gap-1.5 shrink-0"
            >
              {copiedField === 'roomPassword' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedField === 'roomPassword' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TournamentDetailPage() {
  const { tournamentId } = useParams({ strict: false }) as { tournamentId: string };
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const id = BigInt(tournamentId ?? '0');
  const { data: tournament, isLoading, error } = useGetTournament(id);
  const submitPayment = useSubmitPayment();

  // Track if user has registered (submitted payment) in this session
  const [hasRegistered, setHasRegistered] = useState(false);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to register for this tournament.');
      return;
    }
    try {
      await submitPayment.mutateAsync(id);
      setHasRegistered(true);
      toast.success('Registration submitted! Your payment is pending approval.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Tournament Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This tournament doesn&apos;t exist or has been removed.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="bg-primary text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tournaments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startMs = Number(tournament.startDate) / 1_000_000;
  const isUpcoming = startMs > Date.now();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="text-muted-foreground hover:text-foreground gap-2 -ml-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tournaments
      </Button>

      {/* Hero Card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                  {tournament.gameType}
                </Badge>
                {isUpcoming && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Upcoming
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{tournament.name}</h1>
              {tournament.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{tournament.description}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(tournament.prizePool)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Start Date</p>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {new Date(Number(tournament.startDate) / 1_000_000).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(Number(tournament.startDate) / 1_000_000).toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Max Players</p>
            <p className="text-xl font-bold text-foreground">{tournament.maxParticipants.toString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Entry Fee</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(tournament.entryFee)}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">End Date</p>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {new Date(Number(tournament.endDate) / 1_000_000).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-base">
            <Info className="w-5 h-5 text-primary" />
            Tournament Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tournament ID
            </span>
            <span className="text-foreground font-mono">#{tournament.id.toString()}</span>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Full Start Time
            </span>
            <span className="text-foreground text-sm">{formatDate(tournament.startDate)}</span>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Full End Time
            </span>
            <span className="text-foreground text-sm">{formatDate(tournament.endDate)}</span>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Game Type
            </span>
            <span className="text-foreground">{tournament.gameType}</span>
          </div>
        </CardContent>
      </Card>

      {/* Room Credentials — only for registered users */}
      {isAuthenticated && (
        <RoomCredentialsSection
          roomId={tournament.roomId}
          roomPassword={tournament.roomPassword}
          roomVisibilityMinutes={tournament.roomVisibilityMinutes}
          startDate={tournament.startDate}
          isRegistered={hasRegistered}
        />
      )}

      {/* Register CTA */}
      {isAuthenticated && !hasRegistered && (
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-foreground">Ready to compete?</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Entry fee: {formatCurrency(tournament.entryFee)} · Prize pool: {formatCurrency(tournament.prizePool)}
              </p>
            </div>
            <Button
              onClick={handleRegister}
              disabled={submitPayment.isPending}
              className="bg-primary text-primary-foreground gap-2 shrink-0"
            >
              {submitPayment.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  Register Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Log in to register for this tournament and view room credentials.</p>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="border-border text-foreground"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
