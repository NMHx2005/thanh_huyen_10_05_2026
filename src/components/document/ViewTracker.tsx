"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ documentId }: { documentId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void fetch(`/api/documents/${documentId}/view`, { method: "POST" }).catch(
      () => {
        sent.current = false;
      },
    );
  }, [documentId]);

  return null;
}
