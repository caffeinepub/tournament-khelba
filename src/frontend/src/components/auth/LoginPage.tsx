import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/assets/generated/hero-banner.dim_1200x400.png')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/tournament-khelba-logo.dim_400x120.png" 
            alt="Tournament Khelba" 
            className="h-20 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]"
          />
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 mb-3">
            TOURNAMENT KHELBA
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Bangladesh's Premier Free Fire Tournament Platform
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Presented by</span>
            <img 
              src="/assets/generated/code11-logo.dim_200x60.png" 
              alt="Code 11" 
              className="h-6"
            />
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg p-8 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Join the Battle</h2>
              <p className="text-gray-400">
                Sign in to compete in tournaments and win prizes
              </p>
            </div>

            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-300"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Login with Internet Identity'
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Secure authentication powered by Internet Computer</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Tournament Khelba. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
