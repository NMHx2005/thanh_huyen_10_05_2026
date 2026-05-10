import { NextResponse, type NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uniqueDocumentSlug } from "@/lib/slug";

const createSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(5000).optional().nullable(),
  subject: z.string().min(1),
  grade: z.number().int().min(1).max(12),
  categoryId: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  fileSize: z.number().int().optional().nullable(),
  pageCount: z.number().int().optional().nullable(),
  isPublished: z.boolean(),
});

async function countPagesFromUrl(url: string): Promise<number | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
    return pdf.getPageCount();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  try {
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "Danh mục không tồn tại." }, { status: 400 });
    }

    const pageCount =
      data.pageCount ??
      (await countPagesFromUrl(data.fileUrl)) ??
      undefined;

    const slug = await uniqueDocumentSlug(data.title, async (s) => {
      const x = await prisma.document.findUnique({ where: { slug: s } });
      return !!x;
    });

    const document = await prisma.document.create({
      data: {
        title: data.title,
        slug,
        description: data.description ?? undefined,
        subject: data.subject,
        grade: data.grade,
        categoryId: data.categoryId,
        tags: data.tags,
        fileUrl: data.fileUrl,
        thumbnailUrl: data.thumbnailUrl ?? undefined,
        fileSize: data.fileSize ?? undefined,
        pageCount,
        isPublished: data.isPublished,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json({ success: true, document });
  } catch {
    return NextResponse.json({ error: "Không thể tạo tài liệu." }, { status: 500 });
  }
}
