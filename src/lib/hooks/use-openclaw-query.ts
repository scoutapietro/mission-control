"use client";

import { useState, useEffect, useRef } from "react";

const POLL_INTERVAL = 30_000;

export function useOpenClawQuery<T>(path: string): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  const pathRef = useRef(path);
  pathRef.current = path;

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(pathRef.current);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setData(json as T);
      } catch {
        // Silently retry on next poll
      }
    }

    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [path]);

  return data;
}
