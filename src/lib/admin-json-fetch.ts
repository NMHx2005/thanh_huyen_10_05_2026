/**
 * Gọi API `/api/admin/*` kèm cookie NextAuth (tránh thiếu session khi fetch từ client).
 */
export async function adminJsonFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{ res: Response; data: Record<string, unknown> }> {
  const res = await fetch(input, { ...init, credentials: "include" });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { res, data };
}

export function adminErrorMessage(data: Record<string, unknown>, fallback: string): string {
  return typeof data.error === "string" ? data.error : fallback;
}
