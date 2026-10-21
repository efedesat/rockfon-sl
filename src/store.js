// Personal data stays in this browser (localStorage). It leaves the device only
// when the user chooses to: sending feedback (with the remembered name), or
// emailing or copying meeting notes from the cockpit.
import { useSyncExternalStore, useCallback, useRef } from 'react';

const PREFIX = 'slp:';
// Persisted keys: lastRead, notes, selfCheck, checks, tracker, records,
// cockpitNotes, cockpitAsked, dealRoom, meetingWith, meetingView, feedbackName.
const listeners = new Set();
const cache = {};

function read(key, fallback) {
  if (!(key in cache)) {
    try { const v = localStorage.getItem(PREFIX + key); cache[key] = v == null ? fallback : JSON.parse(v); } catch { cache[key] = fallback; }
  }
  return cache[key] === undefined ? fallback : cache[key];
}

function write(key, value) {
  cache[key] = value;
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  listeners.forEach(l => l());
}

const subscribe = l => { listeners.add(l); return () => listeners.delete(l); };

export function useStored(key, fallback) {
  const fb = useRef(fallback); fb.current = fallback;
  const value = useSyncExternalStore(subscribe, () => read(key, fallback));
  // Stable setter: callers may pass a fresh fallback literal on every render.
  const set = useCallback(v => write(key, typeof v === 'function' ? v(read(key, fb.current)) : v), [key]);
  return [value, set];
}

// Convenience for map-shaped stores: [map, setEntry(k, v)].
export function useStoredMap(key) {
  const [map, set] = useStored(key, EMPTY);
  const setEntry = useCallback((k, v) => set(m => ({ ...m, [k]: typeof v === 'function' ? v(m[k]) : v })), [set]);
  return [map, setEntry, set];
}
const EMPTY = {};

export function clearMyNotes() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  } catch { /* storage unavailable */ }
  Object.keys(cache).forEach(k => delete cache[k]);
  listeners.forEach(l => l());
}

// In-memory UI state shared across pages (not persisted), e.g. the meeting clock.
const mem = {};
const memListeners = new Set();
const memSubscribe = l => { memListeners.add(l); return () => memListeners.delete(l); };
export function useMem(key, fallback) {
  const fb = useRef(fallback); fb.current = fallback;
  const value = useSyncExternalStore(memSubscribe, () => { if (!(key in mem)) mem[key] = fallback; return mem[key]; });
  const set = useCallback(v => { mem[key] = typeof v === 'function' ? v(key in mem ? mem[key] : fb.current) : v; memListeners.forEach(l => l()); }, [key]);
  return [value, set];
}
