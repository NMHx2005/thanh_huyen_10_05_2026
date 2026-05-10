import { prisma } from "@/lib/prisma";

function utcDay(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export async function recordView(): Promise<void> {
  const date = utcDay();
  await prisma.analyticsDaily.upsert({
    where: { date },
    create: { date, views: 1, downloads: 0 },
    update: { views: { increment: 1 } },
  });
}

export async function recordDownload(): Promise<void> {
  const date = utcDay();
  await prisma.analyticsDaily.upsert({
    where: { date },
    create: { date, views: 0, downloads: 1 },
    update: { downloads: { increment: 1 } },
  });
}
