import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/tai-lieu`, lastModified: new Date() },
    { url: `${base}/tim-kiem`, lastModified: new Date() },
    { url: `${base}/dang-nhap`, lastModified: new Date() },
    { url: `${base}/dang-ky`, lastModified: new Date() },
  ];

  try {
    const [docs, cats] = await Promise.all([
      prisma.document.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ select: { slug: true, createdAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...docs.map((d) => ({
        url: `${base}/tai-lieu/${d.slug}`,
        lastModified: d.updatedAt,
      })),
      ...cats.map((c) => ({
        url: `${base}/danh-muc/${c.slug}`,
        lastModified: c.createdAt,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
