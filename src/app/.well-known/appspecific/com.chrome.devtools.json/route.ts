import { NextResponse } from "next/server";

/** Chrome DevTools gọi URL này; 404 + RSC stream đôi khi gây "failed to pipe response" / ERR_INVALID_STATE trong dev. */
export function GET() {
  return NextResponse.json({}, { status: 200 });
}
