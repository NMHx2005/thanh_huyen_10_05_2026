/**
 * Helpers for file URLs from Uploadthing (or any HTTPS URL).
 */

export function isAllowedPdfUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    return u.pathname.toLowerCase().endsWith(".pdf") || url.includes("/f/");
  } catch {
    return false;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
