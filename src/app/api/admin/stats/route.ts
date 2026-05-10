import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  try {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);
    since.setUTCHours(0, 0, 0, 0);

    const [
      totalDocuments,
      totalViewsAgg,
      totalDownloadsAgg,
      newUsers,
      recentDocs,
      chartRows,
    ] = await prisma.$transaction([
      prisma.document.count(),
      prisma.document.aggregate({ _sum: { viewCount: true } }),
      prisma.document.aggregate({ _sum: { downloadCount: true } }),
      prisma.user.count({
        where: { createdAt: { gte: since } },
      }),
      prisma.document.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { category: true },
      }),
      prisma.analyticsDaily.findMany({
        where: { date: { gte: since } },
        orderBy: { date: "asc" },
      }),
    ]);

    return NextResponse.json({
      totalDocuments,
      totalViews: totalViewsAgg._sum.viewCount ?? 0,
      totalDownloads: totalDownloadsAgg._sum.downloadCount ?? 0,
      newUsers,
      recentDocs,
      chart: chartRows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        views: r.views,
        downloads: r.downloads,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
