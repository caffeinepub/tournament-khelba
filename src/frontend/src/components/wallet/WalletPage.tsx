import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import TransactionList from './TransactionList';

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const mockBalance = 1250; // Mock balance

  const handleWithdraw = () => {
    toast.info('Backend withdrawal system not yet implemented');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <img 
          src="/assets/generated/wallet-icon.dim_128x128.png" 
          alt="Wallet" 
          className="h-12 w-12"
        />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
          My Wallet
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Wallet functionality requires backend implementation. 
          Balance and transactions shown are sample data.
        </AlertDescription>
      </Alert>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-cyan-500/20 to-green-500/20 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        <CardHeader>
          <CardTitle className="text-gray-300 text-lg">Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Wallet className="h-12 w-12 text-cyan-400" />
            <p className="text-5xl font-black text-white">৳{mockBalance}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/80 border-2 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5" />
              Deposit Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm">
              Contact admin to deposit funds via bKash/Nagad/Rocket
            </p>
            <Alert className="bg-cyan-500/10 border-cyan-500/30">
              <Info className="h-4 w-4 text-cyan-400" />
              <AlertDescription className="text-cyan-200 text-xs">
                Manual payment tracking - admin will credit your account after verification
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/80 border-2 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5" />
              Withdraw Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button 
              onClick={handleWithdraw}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
            >
              Request Withdrawal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>
    </div>
  );
}
