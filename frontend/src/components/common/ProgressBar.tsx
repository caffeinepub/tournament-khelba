interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ value, max, className = '', showLabel = false }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = () => {
    if (percentage > 50) return 'from-green-500 to-green-400';
    if (percentage > 25) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 ease-out shadow-[0_0_10px_currentColor]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{value} filled</span>
          <span>{max - value} remaining</span>
        </div>
      )}
    </div>
  );
}
