import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Trophy, Target, Zap, DollarSign, Info } from 'lucide-react';
import { useGetPlayerStatistics } from '../../hooks/useQueries';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatisticsDashboard() {
  const { data: stats, isLoading } = useGetPlayerStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-12 w-12 text-cyan-400" />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
          Player Statistics
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Statistics are sample data. Backend statistics system not yet implemented.
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border-cyan-500/30">
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{stats.tournamentsPlayed}</p>
            <p className="text-sm text-gray-400">Tournaments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/10 border-green-500/30">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{stats.wins}</p>
            <p className="text-sm text-gray-400">Wins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{stats.winRate}%</p>
            <p className="text-sm text-gray-400">Win Rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 border-orange-500/30">
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{stats.avgKills}</p>
            <p className="text-sm text-gray-400">Avg Kills</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">৳{stats.earnings}</p>
            <p className="text-sm text-gray-400">Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white">Win Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #06B6D4' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="winRate" stroke="#06B6D4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white">Kills Per Tournament</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.killsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="tournament" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #10B981' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="kills" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.earningsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="earnings" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
