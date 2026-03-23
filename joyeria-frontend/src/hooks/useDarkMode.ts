import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === null) return false; // tema por defecto: claro
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
} 