import { Badge } from '@/components/ui/badge';
import { ArrowDownToLine, ArrowUpFromLine, Trophy, Coins } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'winnings',
    amount: 500,
    status: 'completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: 'Solo Tournament #1 - 1st Place',
  },
  {
    id: '2',
    type: 'entry_fee',
    amount: -50,
    status: 'completed',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    description: 'Solo Tournament Registration',
  },
  {
    id: '3',
    type: 'deposit',
    amount: 1000,
    status: 'completed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: 'bKash Deposit',
  },
  {
    id: '4',
    type: 'withdrawal',
    amount: -200,
    status: 'pending',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: 'Withdrawal Request',
  },
];

export default function TransactionList() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownToLine className="h-5 w-5 text-green-400" />;
      case 'withdrawal': return <ArrowUpFromLine className="h-5 w-5 text-orange-400" />;
      case 'winnings': return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 'entry_fee': return <Coins className="h-5 w-5 text-cyan-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {MOCK_TRANSACTIONS.map((transaction) => (
        <div 
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-900 rounded-lg">
              {getIcon(transaction.type)}
            </div>
            <div>
              <p className="text-white font-semibold">{transaction.description}</p>
              <p className="text-sm text-gray-400">
                {transaction.date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="text-right flex items-center gap-4">
            <div>
              <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.amount > 0 ? '+' : ''}৳{Math.abs(transaction.amount)}
              </p>
              {getStatusBadge(transaction.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
