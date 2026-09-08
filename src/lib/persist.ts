import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function encodeState(obj: unknown): string {
  const json = JSON.stringify(obj);
  if (typeof window === "undefined") return "";
  return btoa(encodeURIComponent(json));
}

export function decodeState<T>(s: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(atob(s))) as T;
  } catch {
    return null;
  }
}
