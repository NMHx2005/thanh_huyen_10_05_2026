import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Ctx) {
  try {
    const { id } = await context.params;
    const doc = await prisma.document.findFirst({
      where: {
        isPublished: true,
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!doc) {
      return NextResponse.json({ error: "Không tìm thấy tài liệu." }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
