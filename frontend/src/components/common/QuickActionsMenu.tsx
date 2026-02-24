import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Trophy, Wallet, Bell, Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: Trophy, label: 'Tournaments', path: '/', color: 'text-cyan-400' },
    { icon: Wallet, label: 'Wallet', path: '/wallet', color: 'text-green-400' },
    { icon: Bell, label: 'Notifications', path: '/notifications', color: 'text-orange-400' },
    { icon: Users, label: 'My Squad', path: '/squads', color: 'text-purple-400' },
  ];

  const handleAction = (path: string) => {
    navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
          {actions.map((action, index) => (
            <Button
              key={action.path}
              onClick={() => handleAction(action.path)}
              className={`h-12 px-4 bg-gray-900 border border-cyan-500/30 hover:bg-gray-800 hover:border-cyan-500/50 shadow-lg ${action.color}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <action.icon className="h-5 w-5 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-transform ${isOpen ? 'rotate-45' : ''}`}
      >
        <Zap className="h-6 w-6" />
      </Button>
    </div>
  );
}
