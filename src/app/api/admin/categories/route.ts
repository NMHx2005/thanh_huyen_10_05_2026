import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uniqueDocumentSlug } from "@/lib/slug";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  icon: z.string().max(16).optional().nullable(),
  color: z.string().max(32).optional().nullable(),
});

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }
  try {
    const items = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { documents: true } } },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
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
    const { name, icon, color } = parsed.data;
    const slug = await uniqueDocumentSlug(name, async (s) => {
      const x = await prisma.category.findUnique({ where: { slug: s } });
      return !!x;
    });
    const category = await prisma.category.create({
      data: { name, slug, icon: icon ?? undefined, color: color ?? undefined },
    });
    return NextResponse.json({ success: true, category });
  } catch {
    return NextResponse.json({ error: "Không thể tạo danh mục." }, { status: 500 });
  }
}
