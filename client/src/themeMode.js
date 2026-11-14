import { useSyncExternalStore } from 'react';
import { dark, light } from './theme';

// Light / dark mode. The choice lives in localStorage under 'bh-theme' (separate from the
// 'token' / 'user' session keys, so logging out never resets it). With no saved choice the
// app follows the operating system and keeps following it live.

const KEY = 'bh-theme';
const listeners = new Set();

export function getStoredMode() {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch (err) {
    return null;
  }
}

const systemMode = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

export const currentMode = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

export function setMode(mode, { persist = true } = {}) {
  document.documentElement.setAttribute('data-theme', mode);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'dark' ? dark.bg : light.bg);
  if (persist) {
    try {
      localStorage.setItem(KEY, mode);
    } catch (err) {
      /* private mode: the choice just won't persist */
    }
  }
  listeners.forEach(listener => listener());
}

// Call once at startup (public/index.html also sets the attribute before first paint, to avoid a flash).
export function initTheme() {
  setMode(getStoredMode() || systemMode(), { persist: false });
  if (window.matchMedia) {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const follow = () => { if (!getStoredMode()) setMode(systemMode(), { persist: false }); };
    if (query.addEventListener) query.addEventListener('change', follow);
    else if (query.addListener) query.addListener(follow);
  }
}

// Flip the theme. When the browser supports View Transitions the new theme is revealed as a circle
// growing out of the toggle button. Reduced-motion users get an instant switch.
export function toggleMode(origin) {
  const next = currentMode() === 'dark' ? 'light' : 'dark';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) {
    setMode(next);
    return;
  }
  const x = origin && typeof origin.x === 'number' ? origin.x : window.innerWidth / 2;
  const y = origin && typeof origin.y === 'number' ? origin.y : 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = document.startViewTransition(() => setMode(next));
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 450, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(() => {});
}

const subscribe = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useThemeMode() {
  return useSyncExternalStore(subscribe, currentMode, () => 'light');
}
