import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LIMIT = 24;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const categoryId = searchParams.get("category");
    const grade = searchParams.get("grade");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const terms = q.split(/\s+/).filter(Boolean);

    const where: Prisma.DocumentWhereInput = {
      isPublished: true,
      AND: terms.map((term) => ({
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { subject: { contains: term, mode: "insensitive" } },
          { tags: { has: term } },
        ],
      })),
    };

    if (categoryId) where.categoryId = categoryId;
    if (grade && grade !== "all") {
      const g = parseInt(grade, 10);
      if (!Number.isNaN(g)) where.grade = g;
    }

    const [total, items] = await prisma.$transaction([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * LIMIT,
        take: LIMIT,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true, color: true } },
        },
      }),
    ]);

    return NextResponse.json({ items, total, page, limit: LIMIT });
  } catch {
    return NextResponse.json({ error: "Tìm kiếm thất bại." }, { status: 500 });
  }
}
