/**
 * Chuẩn hoá URL ảnh bìa cho next/image và OG.
 * Một số bản ghi lỗi ghép hai URL (vd: …ufs.sh/…AfZahttp://localhost…) — chỉ giữ URL đầu tiên.
 */
export function sanitizeThumbnailUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  let s = raw.trim();
  const schemes = Array.from(s.matchAll(/https?:\/\//gi));
  if (schemes.length > 1 && schemes[1].index != null) {
    s = s.slice(0, schemes[1].index);
  }
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}
