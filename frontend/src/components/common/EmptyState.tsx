import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon | string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: IconComponent, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        {typeof IconComponent === 'string' ? (
          <img src={IconComponent} alt="" className="h-24 w-24 opacity-50" />
        ) : IconComponent ? (
          <div className="h-24 w-24 rounded-full bg-gray-800/50 flex items-center justify-center">
            <IconComponent className="h-12 w-12 text-gray-600" />
          </div>
        ) : null}
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
