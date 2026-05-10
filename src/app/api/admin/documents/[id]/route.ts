import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { PDFDocument } from "pdf-lib";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uniqueDocumentSlug } from "@/lib/slug";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().max(5000).optional().nullable(),
  subject: z.string().min(1).optional(),
  grade: z.number().int().min(1).max(12).optional(),
  categoryId: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  fileUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  fileSize: z.number().int().optional().nullable(),
  pageCount: z.number().int().optional().nullable(),
  isPublished: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

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

export async function PUT(req: NextRequest, context: Ctx) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    }

    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    let slug = existing.slug;
    if (data.title !== undefined && data.title !== existing.title) {
      slug = await uniqueDocumentSlug(data.title, async (s) => {
        const x = await prisma.document.findFirst({
          where: { slug: s, NOT: { id } },
        });
        return !!x;
      });
    }

    let pageCount = data.pageCount ?? undefined;
    if (data.fileUrl && data.fileUrl !== existing.fileUrl && pageCount == null) {
      pageCount = (await countPagesFromUrl(data.fileUrl)) ?? undefined;
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(data.title != null && { title: data.title, slug }),
        ...(data.description !== undefined && { description: data.description ?? undefined }),
        ...(data.subject != null && { subject: data.subject }),
        ...(data.grade != null && { grade: data.grade }),
        ...(data.categoryId != null && { categoryId: data.categoryId }),
        ...(data.tags != null && { tags: data.tags }),
        ...(data.fileUrl != null && { fileUrl: data.fileUrl }),
        ...(data.thumbnailUrl !== undefined && {
          thumbnailUrl: data.thumbnailUrl ?? undefined,
        }),
        ...(data.fileSize !== undefined && { fileSize: data.fileSize ?? undefined }),
        ...(pageCount != null && { pageCount }),
        ...(data.isPublished != null && { isPublished: data.isPublished }),
      },
    });

    return NextResponse.json({ success: true, document });
  } catch {
    return NextResponse.json({ error: "Không thể cập nhật." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Ctx) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy tài liệu." }, { status: 404 });
    }
    return NextResponse.json({ error: "Không thể xóa." }, { status: 500 });
  }
}
