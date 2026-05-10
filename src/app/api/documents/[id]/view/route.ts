import { NextResponse } from "next/server";
import { recordView } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: Ctx) {
  try {
    const { id } = await context.params;
    const doc = await prisma.document.findFirst({
      where: {
        isPublished: true,
        OR: [{ id }, { slug: id }],
      },
      select: { id: true },
    });
    if (!doc) {
      return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    }
    await prisma.document.update({
      where: { id: doc.id },
      data: { viewCount: { increment: 1 } },
    });
    await recordView();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
