import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-in fade-in duration-250" style={{ transform: 'translateZ(0)' }}>
      {children}
    </div>
  );
}
