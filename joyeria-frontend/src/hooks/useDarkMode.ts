import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Sincronizar si el usuario cambia la preferencia del sistema
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('darkMode');
      if (stored === null) {
        setDarkMode(e.matches);
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return [darkMode, setDarkMode] as const;
} 