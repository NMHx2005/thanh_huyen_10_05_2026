import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";

/** HTTPS → cookie `__Secure-…`; HTTP localhost → tên cookie khác. Không dựa chỉ vào NEXTAUTH_URL khi đọc JWT từ request. */
function secureCookieForRequest(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() === "https";
  }
  return req.nextUrl.protocol === "https:";
}

/** Trong Route Handler nên truyền `req` để đọc JWT từ cookie của đúng request (fetch từ client). */
export async function requireAdminSession(req?: NextRequest): Promise<Session | null> {
  if (req) {
    const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
    const token = await getToken({
      req,
      secret,
      secureCookie: secureCookieForRequest(req),
    });
    if (!token) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || session.user.role !== Role.ADMIN) return null;
      return session;
    }
    const id = (token.id ?? token.sub) as string | undefined;
    const role = token.role as Role | undefined;
    if (!id || role !== Role.ADMIN) return null;
    return {
      expires: new Date(
        (typeof token.exp === "number" ? token.exp : Math.floor(Date.now() / 1000) + 3600) * 1000,
      ).toISOString(),
      user: {
        id,
        email: (token.email as string) ?? "",
        name: token.name as string | null | undefined,
        role: Role.ADMIN,
      },
    };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== Role.ADMIN) return null;
  return session;
}
