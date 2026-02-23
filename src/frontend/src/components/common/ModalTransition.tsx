import { ReactNode } from 'react';

interface ModalTransitionProps {
  children: ReactNode;
}

export default function ModalTransition({ children }: ModalTransitionProps) {
  return (
    <div className="animate-in zoom-in-95 fade-in duration-200" style={{ transform: 'translateZ(0)' }}>
      {children}
    </div>
  );
}
