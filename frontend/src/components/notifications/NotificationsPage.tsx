import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Trophy, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { useGetNotifications, useMarkNotificationAsRead } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useGetNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(notificationId, {
        onSuccess: () => {
          toast.success('Notification marked as read');
        },
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-5 w-5 text-cyan-400" />;
      case 'resultAnnouncement':
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 'registrationConfirmation':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'tournamentUpdate':
        return <AlertCircle className="h-5 w-5 text-orange-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-12 w-12 text-cyan-400" />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
          Notifications
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Notifications are sample data. Backend notification system not yet implemented.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {!notifications || notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.read)}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                      : 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="p-2 bg-gray-900 rounded-lg">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`${notification.read ? 'text-gray-400' : 'text-white font-semibold'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <Badge className="bg-cyan-500 text-white">New</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
