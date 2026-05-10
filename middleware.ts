import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN",
    },
    pages: {
      signIn: "/dang-nhap",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
