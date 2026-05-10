/**
 * Map giá trị `subject` cũ (THPT / viết tắt) → danh mục hiện tại trong `src/types/index.ts`.
 * Chạy một lần sau khi đổi SUBJECT_OPTIONS: `npm run db:normalize-subjects`
 */
import { PrismaClient } from "@prisma/client";
import { SUBJECT_OPTIONS } from "../src/types";

const prisma = new PrismaClient();

const canonical = new Set<string>(SUBJECT_OPTIONS as readonly string[]);

/** Giá trị legacy → giá trị chuẩn (trùng khóa identity được giữ để rõ ràng). */
const LEGACY_TO_CANONICAL: Record<string, string> = {
  // Viết tắt form cũ
  Toán: "Toán học",
  Văn: "Tiếng Việt",
  Anh: "Tiếng Anh",
  Lý: "Khoa học",
  Hóa: "Khoa học",
  Sinh: "Khoa học",
  Sử: "Tự nhiên và Xã hội",
  Địa: "Tự nhiên và Xã hội",
  GDCD: "Đạo đức",
  "Tin học": "Khác",
  Khác: "Khác",
  // Tên đầy đủ / chương trình cũ
  "Ngữ văn": "Tiếng Việt",
  "Vật lý": "Khoa học",
  "Hóa học": "Khoa học",
  "Sinh học": "Khoa học",
  "Lịch sử": "Tự nhiên và Xã hội",
  "Địa lý": "Tự nhiên và Xã hội",
  "Tự nhiên & Xã hội": "Tự nhiên và Xã hội",
};

async function main() {
  const rows = await prisma.document.findMany({
    distinct: ["subject"],
    select: { subject: true },
    where: { subject: { not: null } },
  });

  let total = 0;
  const changes: string[] = [];

  for (const row of rows) {
    const s = row.subject!;
    if (canonical.has(s)) continue;

    const next = LEGACY_TO_CANONICAL[s] ?? "Khác";
    const result = await prisma.document.updateMany({
      where: { subject: s },
      data: { subject: next },
    });

    if (result.count > 0) {
      total += result.count;
      changes.push(`  "${s}" → "${next}" (${result.count} bản ghi)`);
      if (!LEGACY_TO_CANONICAL[s]) {
        console.warn(`  (không có map cụ thể, gán "Khác")`);
      }
    }
  }

  if (changes.length === 0) {
    console.log("✅ Không cần cập nhật — mọi subject đã thuộc SUBJECT_OPTIONS.");
  } else {
    console.log(`✅ Đã chuẩn hóa ${total} tài liệu:\n${changes.join("\n")}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
