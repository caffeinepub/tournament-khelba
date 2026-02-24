import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SuccessAnimation({ onComplete, duration = 800 }: SuccessAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="animate-in zoom-in duration-300">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <CheckCircle className="h-24 w-24 text-green-400 opacity-75" />
          </div>
          <CheckCircle className="h-24 w-24 text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
        </div>
      </div>
    </div>
  );
}
