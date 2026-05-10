import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uniqueDocumentSlug } from "@/lib/slug";

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  icon: z.string().max(16).optional().nullable(),
  color: z.string().max(32).optional().nullable(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, context: Ctx) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const existing = await prisma.category.findUnique({ where: { id } });
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
    if (data.name !== undefined && data.name !== existing.name) {
      slug = await uniqueDocumentSlug(data.name, async (s) => {
        const x = await prisma.category.findFirst({
          where: { slug: s, NOT: { id } },
        });
        return !!x;
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name, slug }),
        ...(data.icon !== undefined && { icon: data.icon ?? undefined }),
        ...(data.color !== undefined && { color: data.color ?? undefined }),
      },
    });

    return NextResponse.json({ success: true, category });
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
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2003") {
        return NextResponse.json(
          { error: "Không thể xóa: vẫn còn tài liệu thuộc danh mục này." },
          { status: 400 },
        );
      }
      if (e.code === "P2025") {
        return NextResponse.json({ error: "Không tìm thấy danh mục." }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Không thể xóa danh mục." }, { status: 500 });
  }
}
