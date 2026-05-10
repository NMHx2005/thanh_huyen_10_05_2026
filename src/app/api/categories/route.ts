import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { documents: { where: { isPublished: true } } } },
      },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Không thể tải danh mục." },
      { status: 500 },
    );
  }
}
