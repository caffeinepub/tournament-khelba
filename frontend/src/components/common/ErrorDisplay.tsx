import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function ErrorDisplay({ 
  title, 
  message, 
  severity = 'error',
  action,
  className = ''
}: ErrorDisplayProps) {
  const icons = {
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-200',
    warning: 'bg-orange-500/10 border-orange-500/30 text-orange-200',
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
  };

  const iconColors = {
    error: 'text-red-400',
    warning: 'text-orange-400',
    info: 'text-cyan-400',
  };

  return (
    <Alert className={`${styles[severity]} ${className}`}>
      <div className={iconColors[severity]}>
        {icons[severity]}
      </div>
      <div className="flex-1">
        {title && <AlertTitle className="font-bold mb-1">{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
        {action && (
          <Button
            onClick={action.onClick}
            variant="outline"
            size="sm"
            className="mt-3 border-current hover:bg-current/10"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Alert>
  );
}
