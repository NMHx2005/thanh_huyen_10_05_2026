import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const DOCUMENT_CARD_INCLUDE = {
  category: { select: { name: true, slug: true, color: true, icon: true } },
} as const;

export type DocumentListOptions = {
  page?: number;
  pageSize?: number;
  q?: string | null;
  categorySlug?: string | null;
  grade?: string | null;
  subject?: string | null;
  sort?: string | null;
  publishedOnly?: boolean;
};

export async function listDocuments(opts: DocumentListOptions) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? 12;
  const sort = opts.sort ?? "newest";
  const publishedOnly = opts.publishedOnly ?? true;

  const where: Prisma.DocumentWhereInput = {};
  if (publishedOnly) where.isPublished = true;
  if (opts.categorySlug) {
    where.category = { slug: opts.categorySlug };
  }
  if (opts.grade && opts.grade !== "all") {
    const g = parseInt(opts.grade, 10);
    if (!Number.isNaN(g)) where.grade = g;
  }
  if (opts.subject && opts.subject !== "all") {
    where.subject = opts.subject;
  }
  if (opts.q?.trim()) {
    const terms = opts.q.trim().split(/\s+/).filter(Boolean);
    where.AND = terms.map((term) => ({
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { subject: { contains: term, mode: "insensitive" } },
        { tags: { has: term } },
      ],
    }));
  }

  let orderBy: Prisma.DocumentOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "views") orderBy = { viewCount: "desc" };
  if (sort === "downloads") orderBy = { downloadCount: "desc" };

  const [total, items] = await prisma.$transaction([
    prisma.document.count({ where }),
    prisma.document.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: DOCUMENT_CARD_INCLUDE,
    }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getDocumentBySlug(slug: string, publishedOnly = true) {
  return prisma.document.findFirst({
    where: {
      slug,
      ...(publishedOnly ? { isPublished: true } : {}),
    },
    include: {
      category: true,
      uploadedBy: { select: { id: true, name: true, email: true } },
    },
  });
}
