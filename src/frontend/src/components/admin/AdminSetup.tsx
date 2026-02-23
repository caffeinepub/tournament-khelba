import { useState } from 'react';
import { useGetMyPrincipal, useAddAdmin } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSetup() {
  const { data: myPrincipal, isLoading: loadingPrincipal } = useGetMyPrincipal();
  const addAdminMutation = useAddAdmin();
  const [principalInput, setPrincipalInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyPrincipal = () => {
    if (myPrincipal) {
      navigator.clipboard.writeText(myPrincipal);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!principalInput.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      await addAdminMutation.mutateAsync(principalInput.trim());
      toast.success('Admin added successfully!');
      setPrincipalInput('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add admin');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Alert className="bg-cyan-500/10 border-cyan-500/30">
        <Info className="h-4 w-4 text-cyan-400" />
        <AlertDescription className="text-cyan-200">
          <strong>Initial Setup Required:</strong> The admin list is currently empty. 
          Copy your principal ID below and add it as the first admin to gain access to the admin panel.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-800/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Shield className="h-6 w-6" />
            Your Principal ID
          </CardTitle>
          <CardDescription className="text-gray-400">
            This is your unique Internet Identity principal ID. Copy it to add yourself as an admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingPrincipal ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={myPrincipal || ''}
                readOnly
                className="font-mono text-sm bg-gray-900 border-cyan-500/30"
              />
              <Button
                onClick={handleCopyPrincipal}
                variant="outline"
                className="border-cyan-500/30 hover:bg-cyan-500/10"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Shield className="h-6 w-6" />
            Add First Admin
          </CardTitle>
          <CardDescription className="text-gray-400">
            Paste the principal ID above (or another principal ID) to add the first admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principalId" className="text-gray-300">
                Principal ID
              </Label>
              <Input
                id="principalId"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                placeholder="Enter principal ID..."
                className="font-mono text-sm bg-gray-900 border-orange-500/30"
              />
            </div>
            <Button
              type="submit"
              disabled={addAdminMutation.isPending}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {addAdminMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Adding Admin...
                </>
              ) : (
                'Add First Admin'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
