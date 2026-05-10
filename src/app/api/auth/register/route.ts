import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên").max(120),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(72),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { name, email, password } = parsed.data;
    const normalized = email.trim().toLowerCase();
    const exists = await prisma.user.findUnique({
      where: { email: normalized },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Email đã được sử dụng." },
        { status: 409 },
      );
    }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name,
        email: normalized,
        password: hashed,
        role: "USER",
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra. Thử lại sau." },
      { status: 500 },
    );
  }
}
