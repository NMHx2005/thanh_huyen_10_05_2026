"use client";

import { useCallback, useEffect, useState } from "react";

type SearchResponse = {
  items: unknown[];
  total: number;
};

export function useSearch(q: string, extraParams = "") {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    if (!q.trim()) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: q.trim() });
      if (extraParams) {
        const p = new URLSearchParams(extraParams);
        p.forEach((v, k) => params.set(k, v));
      }
      const res = await fetch(`/api/search?${params}`);
      if (res.ok) setData((await res.json()) as SearchResponse);
    } finally {
      setLoading(false);
    }
  }, [q, extraParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      void run();
    }, 300);
    return () => clearTimeout(t);
  }, [run]);

  return { data, loading };
}
