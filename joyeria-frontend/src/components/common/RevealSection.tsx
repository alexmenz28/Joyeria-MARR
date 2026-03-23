import React from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Retraso en ms para stagger (ej: 0, 80, 160) */
  delay?: number;
  /** true = animación un poco más lenta (500ms) */
  slow?: boolean;
}

/**
 * Envuelve contenido que debe revelarse al entrar en viewport.
 * Usa opacity + translateY; respeta prefers-reduced-motion.
 */
export default function RevealSection({ children, className = '', delay = 0, slow = false }: RevealSectionProps) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={className}>
      <div
        className={
          isInView ? (slow ? 'animate-reveal-slow' : 'animate-reveal') : 'opacity-0 translate-y-3'
        }
        style={isInView ? { animationDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
