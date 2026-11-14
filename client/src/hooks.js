import { useEffect, useState } from 'react';

// Sets the browser tab title: "Login · BuildHire". Pass nothing for the plain brand title.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · BuildHire` : 'BuildHire';
  }, [title]);
}

// true while the browser reports a network connection.
export function useOnlineStatus() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  return online;
}
