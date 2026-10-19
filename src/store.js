// Personal data stays in this browser (localStorage) and is never sent anywhere.
import { useSyncExternalStore, useCallback } from 'react';

const PREFIX = 'slp:';
// Persisted keys: lastRead, notes, selfCheck, checks, tracker, worksheet,
// worksheetName, records, cockpitNotes, meetingView.
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
  const value = useSyncExternalStore(subscribe, () => read(key, fallback));
  const set = useCallback(v => write(key, typeof v === 'function' ? v(read(key, fallback)) : v), [key, fallback]);
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
  const value = useSyncExternalStore(memSubscribe, () => { if (!(key in mem)) mem[key] = fallback; return mem[key]; });
  const set = useCallback(v => { mem[key] = typeof v === 'function' ? v(key in mem ? mem[key] : fallback) : v; memListeners.forEach(l => l()); }, [key, fallback]);
  return [value, set];
}
