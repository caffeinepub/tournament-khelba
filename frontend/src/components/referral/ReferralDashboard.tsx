import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, Copy, Users, DollarSign, CheckCircle, Clock, Info } from 'lucide-react';
import { useGetReferralStats } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function ReferralDashboard() {
  const { data: stats, isLoading } = useGetReferralStats();

  const handleCopyCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      toast.success('Referral code copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Gift className="h-12 w-12 text-cyan-400" />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
          Referral Program
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Referral system requires backend implementation. Data shown is sample data.
        </AlertDescription>
      </Alert>

      {/* Referral Banner */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30 overflow-hidden">
        <div className="relative h-48">
          <img
            src="/assets/generated/referral-banner.dim_1200x400.png"
            alt="Referral Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent flex items-center px-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Invite Friends, Earn Rewards!</h2>
              <p className="text-gray-300">Get ৳50 for each friend who completes their first tournament</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Referral Code */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-800 border-2 border-cyan-500/30 rounded-lg p-4">
              <p className="text-3xl font-black text-cyan-400 text-center tracking-wider">
                {stats?.referralCode || 'LOADING...'}
              </p>
            </div>
            <Button onClick={handleCopyCode} className="bg-cyan-500 hover:bg-cyan-600">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border-cyan-500/30">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{stats?.totalReferrals || 0}</p>
            <p className="text-sm text-gray-400">Total Referrals</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/10 border-green-500/30">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{stats?.completedReferrals || 0}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">৳{stats?.totalEarnings || 0}</p>
            <p className="text-sm text-gray-400">Total Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral List */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.referrals || stats.referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No referrals yet. Start inviting friends!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.referrals.map((referral: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      referral.status === 'completed' ? 'bg-green-500/20' : 'bg-orange-500/20'
                    }`}>
                      {referral.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{referral.name}</p>
                      <p className="text-sm text-gray-400">{referral.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={referral.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}>
                      {referral.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                    {referral.earnings > 0 && (
                      <p className="text-sm text-green-400 mt-1">+৳{referral.earnings}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
