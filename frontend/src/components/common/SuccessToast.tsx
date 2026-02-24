import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    className: 'border-green-500/30 bg-green-500/10',
    duration: 3000,
  });
}

export function showErrorToast(message: string, description?: string) {
  toast.error(message, {
    description,
    className: 'border-red-500/30 bg-red-500/10',
    duration: 4000,
  });
}

export function showInfoToast(message: string, description?: string) {
  toast.info(message, {
    description,
    className: 'border-cyan-500/30 bg-cyan-500/10',
    duration: 3000,
  });
}
