import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_PENDING = [
  { id: '1', userName: 'ProGamer', type: 'withdrawal', amount: 200, date: '2 hours ago' },
  { id: '2', userName: 'FireKing', type: 'deposit', amount: 500, date: '5 hours ago' },
];

export default function PaymentManagementPanel() {
  const handleApprove = () => {
    toast.info('Backend payment approval not yet implemented');
  };

  const handleReject = () => {
    toast.info('Backend payment rejection not yet implemented');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-2 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-white">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_PENDING.map((request) => (
              <div 
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div>
                  <p className="text-white font-bold">{request.userName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={
                      request.type === 'deposit' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                    }>
                      {request.type}
                    </Badge>
                    <span className="text-gray-400 text-sm">৳{request.amount}</span>
                    <span className="text-gray-500 text-xs">• {request.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleApprove}
                    size="sm" 
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    onClick={handleReject}
                    size="sm" 
                    variant="outline" 
                    className="border-red-500/30 text-red-400"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
