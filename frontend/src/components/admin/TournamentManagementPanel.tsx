import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trophy, Users, Calendar, DollarSign, Key, Eye, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useListTournaments, useCreateTournament, useUpdateTournament } from '@/hooks/useTournamentQueries';
import { Tournament } from '../../backend';

interface TournamentFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  entryFee: string;
  maxParticipants: string;
  prizePool: string;
  gameType: string;
  roomId: string;
  roomPassword: string;
  roomVisibilityMinutes: string;
}

const emptyForm: TournamentFormData = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  entryFee: '',
  maxParticipants: '',
  prizePool: '',
  gameType: '',
  roomId: '',
  roomPassword: '',
  roomVisibilityMinutes: '',
};

function tournamentToForm(t: Tournament): TournamentFormData {
  const toDatetimeLocal = (ns: bigint) => {
    const ms = Number(ns) / 1_000_000;
    const d = new Date(ms);
    // Format as YYYY-MM-DDTHH:MM
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return {
    name: t.name,
    description: t.description,
    startDate: toDatetimeLocal(t.startDate),
    endDate: toDatetimeLocal(t.endDate),
    entryFee: t.entryFee.toString(),
    maxParticipants: t.maxParticipants.toString(),
    prizePool: t.prizePool.toString(),
    gameType: t.gameType,
    roomId: t.roomId ?? '',
    roomPassword: t.roomPassword ?? '',
    roomVisibilityMinutes: t.roomVisibilityMinutes != null ? t.roomVisibilityMinutes.toString() : '',
  };
}

interface EditTournamentModalProps {
  tournament: Tournament;
  open: boolean;
  onClose: () => void;
}

function EditTournamentModal({ tournament, open, onClose }: EditTournamentModalProps) {
  const [form, setForm] = useState<TournamentFormData>(tournamentToForm(tournament));
  const updateTournament = useUpdateTournament();

  useEffect(() => {
    if (open) {
      setForm(tournamentToForm(tournament));
    }
  }, [open, tournament]);

  const handleChange = (field: keyof TournamentFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate || !form.gameType) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const toNanoseconds = (dateStr: string): bigint => {
      return BigInt(new Date(dateStr).getTime()) * 1_000_000n;
    };

    try {
      await updateTournament.mutateAsync({
        id: tournament.id,
        name: form.name || undefined,
        description: form.description || undefined,
        startDate: form.startDate ? toNanoseconds(form.startDate) : undefined,
        endDate: form.endDate ? toNanoseconds(form.endDate) : undefined,
        entryFee: form.entryFee ? BigInt(form.entryFee) : undefined,
        maxParticipants: form.maxParticipants ? BigInt(form.maxParticipants) : undefined,
        prizePool: form.prizePool ? BigInt(form.prizePool) : undefined,
        gameType: form.gameType || undefined,
        roomId: form.roomId || undefined,
        roomPassword: form.roomPassword || undefined,
        roomVisibilityMinutes: form.roomVisibilityMinutes ? BigInt(form.roomVisibilityMinutes) : undefined,
      });
      toast.success('Tournament updated successfully!');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update tournament';
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Edit Tournament
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update tournament details. All fields can be modified at any time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
            <div>
              <Label htmlFor="edit-name" className="text-foreground">Tournament Name *</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="bg-background border-border text-foreground mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-foreground">Description</Label>
              <Textarea
                id="edit-description"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                className="bg-background border-border text-foreground mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-gameType" className="text-foreground">Game Type *</Label>
              <Input
                id="edit-gameType"
                value={form.gameType}
                onChange={e => handleChange('gameType', e.target.value)}
                className="bg-background border-border text-foreground mt-1"
                placeholder="e.g. Battle Royale, Squad, Duo"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Schedule</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-startDate" className="text-foreground">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate" className="text-foreground">End Date *</Label>
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={e => handleChange('endDate', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Financials & Capacity</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-entryFee" className="text-foreground">Entry Fee (₹)</Label>
                <Input
                  id="edit-entryFee"
                  type="number"
                  min="0"
                  value={form.entryFee}
                  onChange={e => handleChange('entryFee', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-prizePool" className="text-foreground">Prize Pool (₹)</Label>
                <Input
                  id="edit-prizePool"
                  type="number"
                  min="0"
                  value={form.prizePool}
                  onChange={e => handleChange('prizePool', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-maxParticipants" className="text-foreground">Max Players</Label>
                <Input
                  id="edit-maxParticipants"
                  type="number"
                  min="1"
                  value={form.maxParticipants}
                  onChange={e => handleChange('maxParticipants', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                />
              </div>
            </div>
          </div>

          {/* Room Credentials */}
          <div className="space-y-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4" />
              Room Credentials
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-roomId" className="text-foreground">Room ID</Label>
                <Input
                  id="edit-roomId"
                  value={form.roomId}
                  onChange={e => handleChange('roomId', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                  placeholder="Enter room ID"
                />
              </div>
              <div>
                <Label htmlFor="edit-roomPassword" className="text-foreground">Room Password</Label>
                <Input
                  id="edit-roomPassword"
                  value={form.roomPassword}
                  onChange={e => handleChange('roomPassword', e.target.value)}
                  className="bg-background border-border text-foreground mt-1"
                  placeholder="Enter room password"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-roomVisibilityMinutes" className="text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Reveal Credentials (minutes before start)
              </Label>
              <Input
                id="edit-roomVisibilityMinutes"
                type="number"
                min="1"
                max="120"
                value={form.roomVisibilityMinutes}
                onChange={e => handleChange('roomVisibilityMinutes', e.target.value)}
                className="bg-background border-border text-foreground mt-1 max-w-xs"
                placeholder="e.g. 15"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Room ID and Password will become visible to registered players this many minutes before the tournament starts.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateTournament.isPending}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateTournament.isPending}
              className="bg-primary text-primary-foreground"
            >
              {updateTournament.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TournamentManagementPanel() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [form, setForm] = useState<TournamentFormData>(emptyForm);

  const { data: tournaments, isLoading: tournamentsLoading } = useListTournaments();
  const createTournament = useCreateTournament();

  const handleChange = (field: keyof TournamentFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate || !form.gameType) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const toNanoseconds = (dateStr: string): bigint => {
      return BigInt(new Date(dateStr).getTime()) * 1_000_000n;
    };

    try {
      await createTournament.mutateAsync({
        name: form.name,
        description: form.description,
        startDate: toNanoseconds(form.startDate),
        endDate: toNanoseconds(form.endDate),
        entryFee: BigInt(form.entryFee || '0'),
        maxParticipants: BigInt(form.maxParticipants || '0'),
        prizePool: BigInt(form.prizePool || '0'),
        gameType: form.gameType,
        roomId: form.roomId || null,
        roomPassword: form.roomPassword || null,
        roomVisibilityMinutes: form.roomVisibilityMinutes ? BigInt(form.roomVisibilityMinutes) : null,
      });
      toast.success('Tournament created successfully!');
      setForm(emptyForm);
      setShowCreateForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create tournament';
      toast.error(msg);
    }
  };

  const formatDate = (ns: bigint) => {
    return new Date(Number(ns) / 1_000_000).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Tournament Management</h2>
          <p className="text-sm text-muted-foreground">Create and manage all tournaments</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(v => !v)}
          className="bg-primary text-primary-foreground gap-2"
        >
          {showCreateForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreateForm ? 'Hide Form' : 'New Tournament'}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Create New Tournament
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
                <div>
                  <Label htmlFor="name" className="text-foreground">Tournament Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="bg-background border-border text-foreground mt-1"
                    placeholder="e.g. Code 11 Grand Prix"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="bg-background border-border text-foreground mt-1"
                    rows={3}
                    placeholder="Tournament description..."
                  />
                </div>
                <div>
                  <Label htmlFor="gameType" className="text-foreground">Game Type *</Label>
                  <Input
                    id="gameType"
                    value={form.gameType}
                    onChange={e => handleChange('gameType', e.target.value)}
                    className="bg-background border-border text-foreground mt-1"
                    placeholder="e.g. Battle Royale, Squad, Duo"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Schedule</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startDate" className="text-foreground">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={form.startDate}
                      onChange={e => handleChange('startDate', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-foreground">End Date *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={form.endDate}
                      onChange={e => handleChange('endDate', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Financials & Capacity</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="entryFee" className="text-foreground">Entry Fee (₹)</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      min="0"
                      value={form.entryFee}
                      onChange={e => handleChange('entryFee', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prizePool" className="text-foreground">Prize Pool (₹)</Label>
                    <Input
                      id="prizePool"
                      type="number"
                      min="0"
                      value={form.prizePool}
                      onChange={e => handleChange('prizePool', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxParticipants" className="text-foreground">Max Players</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      value={form.maxParticipants}
                      onChange={e => handleChange('maxParticipants', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>

              {/* Room Credentials */}
              <div className="space-y-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Room Credentials (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="roomId" className="text-foreground">Room ID</Label>
                    <Input
                      id="roomId"
                      value={form.roomId}
                      onChange={e => handleChange('roomId', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      placeholder="Enter room ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomPassword" className="text-foreground">Room Password</Label>
                    <Input
                      id="roomPassword"
                      value={form.roomPassword}
                      onChange={e => handleChange('roomPassword', e.target.value)}
                      className="bg-background border-border text-foreground mt-1"
                      placeholder="Enter room password"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roomVisibilityMinutes" className="text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Reveal Credentials (minutes before start)
                  </Label>
                  <Input
                    id="roomVisibilityMinutes"
                    type="number"
                    min="1"
                    max="120"
                    value={form.roomVisibilityMinutes}
                    onChange={e => handleChange('roomVisibilityMinutes', e.target.value)}
                    className="bg-background border-border text-foreground mt-1 max-w-xs"
                    placeholder="e.g. 15"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Room credentials will become visible to registered players this many minutes before start.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={createTournament.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {createTournament.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tournament
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowCreateForm(false); setForm(emptyForm); }}
                  className="border-border text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tournament List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          All Tournaments
          {tournaments && (
            <Badge variant="secondary" className="ml-2">{tournaments.length}</Badge>
          )}
        </h3>

        {tournamentsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : !tournaments || tournaments.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No tournaments yet. Create your first one above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tournaments.map(tournament => (
              <Card key={tournament.id.toString()} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground truncate">{tournament.name}</h4>
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary shrink-0">
                          {tournament.gameType}
                        </Badge>
                        {tournament.roomId && (
                          <Badge variant="secondary" className="text-xs shrink-0 gap-1">
                            <Key className="w-3 h-3" />
                            Room Set
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(tournament.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {tournament.maxParticipants.toString()} players
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          ₹{tournament.prizePool.toString()} prize
                        </span>
                        {tournament.roomVisibilityMinutes != null && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            Reveals {tournament.roomVisibilityMinutes.toString()}m before start
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTournament(tournament)}
                      className="border-border text-foreground hover:border-primary hover:text-primary shrink-0 gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTournament && (
        <EditTournamentModal
          tournament={editingTournament}
          open={!!editingTournament}
          onClose={() => setEditingTournament(null)}
        />
      )}
    </div>
  );
}
