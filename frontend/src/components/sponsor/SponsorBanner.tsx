interface SponsorBannerProps {
  className?: string;
}

export default function SponsorBanner({ className = '' }: SponsorBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-cyan-500/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5 animate-pulse" />
      <div className="relative flex items-center justify-center gap-4 py-4 px-6">
        <span className="text-gray-400 text-sm font-medium">Proudly Sponsored by</span>
        <img 
          src="/assets/generated/code11-logo.dim_200x60.png" 
          alt="Code 11" 
          className="h-10 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-[scale-pulse_3s_ease-in-out_infinite]"
        />
      </div>
      <div className="absolute inset-0 border border-cyan-500/20 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(0,255,255,0.1)]" />
    </div>
  );
}
