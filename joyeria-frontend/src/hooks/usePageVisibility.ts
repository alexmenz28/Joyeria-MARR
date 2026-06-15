import { useEffect, useRef } from 'react';

/** Calls `onVisible` when the tab becomes visible again (stock refresh without WebSockets). */
export function usePageVisibility(onVisible: () => void) {
  const callbackRef = useRef(onVisible);
  callbackRef.current = onVisible;

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') callbackRef.current();
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
}
