import slugify from "slugify";

/** Slug anh Việt: bỏ dấu qua slugify locale + mở rộng ký tự đặc biệt. */
export function toSlug(input: string): string {
  const base = slugify(input.trim(), {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
  return base || "tai-lieu";
}

export async function uniqueDocumentSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const slug = toSlug(title);
  if (!(await exists(slug))) return slug;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${slug}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${slug}-${Date.now()}`;
}
