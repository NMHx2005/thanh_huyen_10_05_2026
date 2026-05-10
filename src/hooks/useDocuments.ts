"use client";

import { useCallback, useEffect, useState } from "react";

type ListResponse = {
  items: unknown[];
  total: number;
  page: number;
  totalPages: number;
};

export function useDocuments(query: string) {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents?${query}`);
      if (!res.ok) throw new Error();
      const json = (await res.json()) as ListResponse;
      setData(json);
    } catch {
      setError("Không tải được danh sách.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  return { data, loading, error, refetch: fetchList };
}
