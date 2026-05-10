import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { recordDownload } from "@/lib/analytics";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

function contentDispositionFilename(slug: string): string {
  const safe = `${slug.replace(/[^\w.-]+/g, "_")}.pdf`;
  const utf8 = encodeURIComponent(`${slug}.pdf`);
  return `attachment; filename="${safe}"; filename*=UTF-8''${utf8}`;
}

export async function GET(_req: Request, context: Ctx) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để tải tài liệu." },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const doc = await prisma.document.findFirst({
      where: {
        isPublished: true,
        OR: [{ id }, { slug: id }],
      },
      select: { id: true, fileUrl: true, title: true, slug: true },
    });
    if (!doc) {
      return NextResponse.json({ error: "Không tìm thấy tài liệu." }, { status: 404 });
    }

    await prisma.document.update({
      where: { id: doc.id },
      data: { downloadCount: { increment: 1 } },
    });
    await recordDownload();

    const upstream = await fetch(doc.fileUrl, {
      redirect: "follow",
      headers: { Accept: "application/pdf,*/*" },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Không lấy được file từ máy chủ lưu trữ." }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "application/pdf";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDispositionFilename(doc.slug),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
