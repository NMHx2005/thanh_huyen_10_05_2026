import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const categorySlug = searchParams.get("category");
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const sort = searchParams.get("sort") ?? "newest";
    const q = searchParams.get("q")?.trim();

    const where: Prisma.DocumentWhereInput = {
      isPublished: true,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (grade && grade !== "all") {
      const g = parseInt(grade, 10);
      if (!Number.isNaN(g)) where.grade = g;
    }
    if (subject && subject !== "all") {
      where.subject = subject;
    }
    if (q) {
      const terms = q.split(/\s+/).filter(Boolean);
      where.AND = terms.map((term) => ({
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { subject: { contains: term, mode: "insensitive" } },
          { tags: { has: term } },
        ],
      }));
    }

    let orderBy: Prisma.DocumentOrderByWithRelationInput = {
      createdAt: "desc",
    };
    if (sort === "views") orderBy = { viewCount: "desc" };
    if (sort === "downloads") orderBy = { downloadCount: "desc" };

    const [total, items] = await prisma.$transaction([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true, color: true } },
        },
      }),
    ]);

    return NextResponse.json({
      items,
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể tải danh sách tài liệu." },
      { status: 500 },
    );
  }
}
