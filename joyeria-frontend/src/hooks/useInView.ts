import { useEffect, useRef, useState } from 'react';

const defaultOptions: IntersectionObserverInit = {
  rootMargin: '0px 0px -40px 0px',
  threshold: 0.1,
};

/**
 * Hook que detecta si el elemento está visible en el viewport.
 * Útil para animaciones de reveal al hacer scroll.
 * Respeta prefers-reduced-motion: no hace nada si el usuario prefiere menos movimiento.
 */
export function useInView(options: IntersectionObserverInit = defaultOptions) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      options
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return { ref, isInView };
}
