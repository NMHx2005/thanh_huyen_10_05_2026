import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Public sample PDF (1-page, ~13 KB) — used for all demo docs
const SAMPLE_PDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Placeholder thumbnails — book proportion 3:4, distinct colour per category
function thumb(bg: string, text: string) {
  const encoded = encodeURIComponent(text);
  return `https://placehold.co/300x400/${bg.replace("#", "")}/ffffff?text=${encoded}&font=open-sans`;
}

async function main() {
  // ── Admin account ──────────────────────────────────────────────────────────
  const adminEmail = "admin@hoclieu.vn";
  const adminPass = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: "Quản trị viên", password: adminPass, role: "ADMIN" },
    update: {},
  });

  // Demo regular user
  const userPass = await bcrypt.hash("User@123456", 12);
  await prisma.user.upsert({
    where: { email: "hocsinh@hoclieu.vn" },
    create: { email: "hocsinh@hoclieu.vn", name: "Học Sinh Demo", password: userPass, role: "USER" },
    update: {},
  });

  // ── Categories (Tiểu học — lớp 1–5) ────────────────────────────────────────
  const categoryData = [
    { name: "Toán học", slug: "toan-hoc", icon: "🔢", color: "#1E6FD9" },
    { name: "Tiếng Việt", slug: "tieng-viet", icon: "📖", color: "#7C3AED" },
    { name: "Tiếng Anh", slug: "tieng-anh", icon: "🌏", color: "#0891B2" },
    { name: "Tự nhiên & Xã hội", slug: "tu-nhien-xa-hoi", icon: "🌱", color: "#16A34A" },
    { name: "Khoa học", slug: "khoa-hoc", icon: "🔬", color: "#059669" },
    { name: "Đạo đức", slug: "dao-duc", icon: "🤝", color: "#D97706" },
    { name: "Hoạt động trải nghiệm", slug: "hoat-dong-tra-nghiem", icon: "🎨", color: "#DC2626" },
    { name: "Sách giáo khoa", slug: "sgk", icon: "📗", color: "#4F46E5" },
  ];

  for (const c of categoryData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, icon: c.icon, color: c.color },
    });
  }

  const cats = await prisma.category.findMany();
  type CatRow = (typeof cats)[number];
  const catMap = Object.fromEntries(cats.map((c: CatRow) => [c.slug, c]));

  // ── Documents (chỉ lớp 1–5) ────────────────────────────────────────────────
  const documents = [
    // Toán học
    {
      title: "Toán lớp 1 — Số và phép cộng, trừ trong phạm vi 10",
      slug: "toan-lop-1-so-phep-tinh-10",
      description:
        "Ôn luyện nhận biết số, so sánh, phép cộng và trừ không nhớ trong phạm vi 10. Có tranh minh hoạ và bài tập vận dụng gần gũi.",
      subject: "Toán học",
      grade: 1,
      pageCount: 28,
      fileSize: 980_000,
      viewCount: 4120,
      downloadCount: 1180,
      tags: ["toán", "lớp 1", "phép cộng", "phép trừ"],
      categorySlug: "toan-hoc",
      thumbnailUrl: thumb("1E6FD9", "Toán\nlớp 1"),
    },
    {
      title: "Toán lớp 2 — Bảng nhân 2, 3, 4, 5 và bài toán có lời văn",
      slug: "toan-lop-2-bang-nhan",
      description:
        "Hệ thống bài tập củng cố bảng nhân, giải bài toán có lời văn đơn và đơn vị đo độ dài cơ bản (cm, m).",
      subject: "Toán học",
      grade: 2,
      pageCount: 36,
      fileSize: 1_210_000,
      viewCount: 3890,
      downloadCount: 1050,
      tags: ["toán", "lớp 2", "nhân chia", "bài toán có lời văn"],
      categorySlug: "toan-hoc",
      thumbnailUrl: thumb("1E6FD9", "Toán\nlớp 2"),
    },
    {
      title: "Toán lớp 3 — Phép chia hết, chu vi và diện tích hình chữ nhật",
      slug: "toan-lop-3-chia-chu-vi-dien-tich",
      description:
        "Lý thuyết ngắn gọn và bài tập về phép chia có thương một chữ số, tính chu vi — diện tích hình chữ nhật, vuông.",
      subject: "Toán học",
      grade: 3,
      pageCount: 42,
      fileSize: 1_450_000,
      viewCount: 3560,
      downloadCount: 920,
      tags: ["toán", "lớp 3", "chu vi", "diện tích"],
      categorySlug: "toan-hoc",
      thumbnailUrl: thumb("1E6FD9", "Toán\nlớp 3"),
    },
    {
      title: "Toán lớp 4 — Phân số: Khái niệm, so sánh và phép cộng",
      slug: "toan-lop-4-phan-so",
      description:
        "Giới thiệu phân số qua hình ảnh trực quan; so sánh phân số cùng mẫu; cộng phân số cùng mẫu số.",
      subject: "Toán học",
      grade: 4,
      pageCount: 48,
      fileSize: 1_680_000,
      viewCount: 2980,
      downloadCount: 810,
      tags: ["toán", "lớp 4", "phân số"],
      categorySlug: "toan-hoc",
      thumbnailUrl: thumb("1E6FD9", "Toán\nlớp 4"),
    },
    {
      title: "Toán lớp 5 — Phép nhân, chia phân số và giải toán liên quan",
      slug: "toan-lop-5-nhan-chia-phan-so",
      description:
        "Ôn tập nhân chia hai phân số, hỗn số; bài toán thực tế về diện tích, thể tích đơn giản và tỉ số phần trăm đầu vào.",
      subject: "Toán học",
      grade: 5,
      pageCount: 56,
      fileSize: 1_920_000,
      viewCount: 3340,
      downloadCount: 940,
      tags: ["toán", "lớp 5", "phân số", "ôn tập"],
      categorySlug: "toan-hoc",
      thumbnailUrl: thumb("1E6FD9", "Toán\nlớp 5"),
    },

    // Tiếng Việt
    {
      title: "Tiếng Việt lớp 1 — Tập đọc và luyện viết vần",
      slug: "tieng-viet-lop-1-tap-doc",
      description:
        "Bộ bài tập đọc ngắn, luyện viết chữ cái và vần theo chủ điểm gần gũi với học sinh lớp 1.",
      subject: "Tiếng Việt",
      grade: 1,
      pageCount: 32,
      fileSize: 1_050_000,
      viewCount: 5240,
      downloadCount: 1420,
      tags: ["tiếng Việt", "lớp 1", "tập đọc", "vần"],
      categorySlug: "tieng-viet",
      thumbnailUrl: thumb("7C3AED", "TV\nlớp 1"),
    },
    {
      title: "Tiếng Việt lớp 2 — Chính tả và mở rộng vốn từ theo chủ điểm",
      slug: "tieng-viet-lop-2-chinh-ta",
      description:
        "Bài tập chính tả nghe — viết, phân biệt âm dễ lẫn, làm quen với câu hỏi Ai — Làm gì — Ở đâu.",
      subject: "Tiếng Việt",
      grade: 2,
      pageCount: 38,
      fileSize: 1_180_000,
      viewCount: 4680,
      downloadCount: 1210,
      tags: ["tiếng Việt", "lớp 2", "chính tả"],
      categorySlug: "tieng-viet",
      thumbnailUrl: thumb("7C3AED", "TV\nlớp 2"),
    },
    {
      title: "Tiếng Việt lớp 3 — Tập làm văn: Kể chuyện và viết đoạn văn ngắn",
      slug: "tieng-viet-lop-3-tap-lam-van",
      description:
        "Gợi ý dàn ý, mẫu câu và bài văn mẫu cho các dạng kể chuyện, tả người — vật đơn giản.",
      subject: "Tiếng Việt",
      grade: 3,
      pageCount: 44,
      fileSize: 1_320_000,
      viewCount: 4120,
      downloadCount: 1080,
      tags: ["tiếng Việt", "lớp 3", "tập làm văn"],
      categorySlug: "tieng-viet",
      thumbnailUrl: thumb("7C3AED", "TV\nlớp 3"),
    },
    {
      title: "Tiếng Việt lớp 4 — Luyện từ và câu; làm quen với đoạn văn miêu tả",
      slug: "tieng-viet-lop-4-ltvc",
      description:
        "Ôn các biện pháp tu từ cơ bản, mở rộng vốn từ theo chủ đề; hướng dẫn viết đoạn miêu tả sự vật.",
      subject: "Tiếng Việt",
      grade: 4,
      pageCount: 50,
      fileSize: 1_510_000,
      viewCount: 3750,
      downloadCount: 990,
      tags: ["tiếng Việt", "lớp 4", "LTVC"],
      categorySlug: "tieng-viet",
      thumbnailUrl: thumb("7C3AED", "TV\nlớp 4"),
    },
    {
      title: "Tiếng Việt lớp 5 — Ôn văn học dân gian và kể chuyện sáng tạo",
      slug: "tieng-viet-lop-5-van-hoc-dan-gian",
      description:
        "Tóm tắt truyện cổ tích, ca dao — tục ngữ tiêu biểu; gợi ý kể lại và viết lại theo trí tưởng tượng của học sinh.",
      subject: "Tiếng Việt",
      grade: 5,
      pageCount: 52,
      fileSize: 1_640_000,
      viewCount: 3580,
      downloadCount: 950,
      tags: ["tiếng Việt", "lớp 5", "văn học dân gian"],
      categorySlug: "tieng-viet",
      thumbnailUrl: thumb("7C3AED", "TV\nlớp 5"),
    },

    // Tiếng Anh
    {
      title: "Tiếng Anh lớp 3 — Chào hỏi, màu sắc và đồ vật trong lớp",
      slug: "tieng-anh-lop-3-colors-classroom",
      description:
        "Từ vựng và mẫu câu Hello/Goodbye, hỏi tên, màu sắc và đồ dùng học tập; bài nghe — đọc đơn giản.",
      subject: "Tiếng Anh",
      grade: 3,
      pageCount: 40,
      fileSize: 1_280_000,
      viewCount: 4890,
      downloadCount: 1560,
      tags: ["tiếng Anh", "lớp 3", "từ vựng"],
      categorySlug: "tieng-anh",
      thumbnailUrl: thumb("0891B2", "English\nlớp 3"),
    },
    {
      title: "Tiếng Anh lớp 4 — Gia đình, thời gian và hoạt động hàng ngày",
      slug: "tieng-anh-lop-4-daily-routines",
      description:
        "Chủ đề family, daily routines, days of the week; bài tập điền từ và ghép câu đơn.",
      subject: "Tiếng Anh",
      grade: 4,
      pageCount: 46,
      fileSize: 1_410_000,
      viewCount: 4320,
      downloadCount: 1380,
      tags: ["tiếng Anh", "lớp 4", "gia đình"],
      categorySlug: "tieng-anh",
      thumbnailUrl: thumb("0891B2", "English\nlớp 4"),
    },
    {
      title: "Tiếng Anh lớp 5 — Thì quá khứ đơn và chủ đề du lịch",
      slug: "tieng-anh-lop-5-past-simple",
      description:
        "Làm quen với Past simple (động từ có quy tắc), câu hỏi Wh-; từ vựng chủ đề travel và phong cảnh.",
      subject: "Tiếng Anh",
      grade: 5,
      pageCount: 52,
      fileSize: 1_550_000,
      viewCount: 3980,
      downloadCount: 1240,
      tags: ["tiếng Anh", "lớp 5", "grammar"],
      categorySlug: "tieng-anh",
      thumbnailUrl: thumb("0891B2", "English\nlớp 5"),
    },

    // Tự nhiên & Xã hội
    {
      title: "TN&XH lớp 1 — Bản thân, gia đình và an toàn khi đi học",
      slug: "tnxh-lop-1-gia-dinh-an-toan",
      description:
        "Hoạt động quan sát cơ thể, các thành viên trong nhà; quy tắc an toàn khi qua đường và trong trường học.",
      subject: "Tự nhiên và Xã hội",
      grade: 1,
      pageCount: 24,
      fileSize: 880_000,
      viewCount: 2860,
      downloadCount: 720,
      tags: ["TN&XH", "lớp 1", "an toàn"],
      categorySlug: "tu-nhien-xa-hoi",
      thumbnailUrl: thumb("16A34A", "TN&XH\nlớp 1"),
    },
    {
      title: "TN&XH lớp 2 — Trường học và môi trường xung quanh",
      slug: "tnxh-lop-2-truong-hoc",
      description:
        "Tìm hiểu lớp học, thầy cô, bạn bè; giữ gìn vệ sinh trường lớp và tiết kiệm nước — điện.",
      subject: "Tự nhiên và Xã hội",
      grade: 2,
      pageCount: 28,
      fileSize: 950_000,
      viewCount: 2650,
      downloadCount: 680,
      tags: ["TN&XH", "lớp 2", "môi trường"],
      categorySlug: "tu-nhien-xa-hoi",
      thumbnailUrl: thumb("16A34A", "TN&XH\nlớp 2"),
    },
    {
      title: "TN&XH lớp 3 — Thực vật, động vật và vòng đời",
      slug: "tnxh-lop-3-dong-thuc-vat",
      description:
        "Phân loại thực vật — động vật quen thuộc; quan sát vòng đời cây và một số loài vật.",
      subject: "Tự nhiên và Xã hội",
      grade: 3,
      pageCount: 34,
      fileSize: 1_120_000,
      viewCount: 3120,
      downloadCount: 840,
      tags: ["TN&XH", "lớp 3", "thực vật"],
      categorySlug: "tu-nhien-xa-hoi",
      thumbnailUrl: thumb("16A34A", "TN&XH\nlớp 3"),
    },

    // Khoa học (thường dạy từ lớp 4–5)
    {
      title: "Khoa học lớp 4 — Vật chất và các trạng thái của vật chất",
      slug: "khoa-hoc-lop-4-vat-chat",
      description:
        "Thí nghiệm quan sát rắn — lỏng — khí; nguồn nước và sử dụng nước an toàn.",
      subject: "Khoa học",
      grade: 4,
      pageCount: 38,
      fileSize: 1_240_000,
      viewCount: 2450,
      downloadCount: 640,
      tags: ["khoa học", "lớp 4", "vật chất"],
      categorySlug: "khoa-hoc",
      thumbnailUrl: thumb("059669", "KH\nlớp 4"),
    },
    {
      title: "Khoa học lớp 5 — Cơ thể con người: Tiêu hoá và dinh dưỡng",
      slug: "khoa-hoc-lop-5-co-the",
      description:
        "Giới thiệu các cơ quan tiêu hoá, vai trò của chất dinh dưỡng; thói quen ăn uống lành mạnh.",
      subject: "Khoa học",
      grade: 5,
      pageCount: 42,
      fileSize: 1_380_000,
      viewCount: 2680,
      downloadCount: 710,
      tags: ["khoa học", "lớp 5", "sức khỏe"],
      categorySlug: "khoa-hoc",
      thumbnailUrl: thumb("059669", "KH\nlớp 5"),
    },

    // Đạo đức
    {
      title: "Đạo đức lớp 2 — Yêu thương, chia sẻ và giúp đỡ bạn",
      slug: "dao-duc-lop-2-yeu-thuong",
      description:
        "Tình huống thảo luận nhóm về chia sẻ đồ dùng, giúp bạn yếu và lời nói lịch sự.",
      subject: "Đạo đức",
      grade: 2,
      pageCount: 18,
      fileSize: 620_000,
      viewCount: 1980,
      downloadCount: 510,
      tags: ["đạo đức", "lớp 2", "kỹ năng sống"],
      categorySlug: "dao-duc",
      thumbnailUrl: thumb("D97706", "Đạo đức\n2"),
    },
    {
      title: "Đạo đức lớp 4 — Trách nhiệm với bản thân và cộng đồng",
      slug: "dao-duc-lop-4-trach-nhiem",
      description:
        "Hoạt động phân vai về giữ gìn trật tự nơi công cộng, tiết kiệm và bảo vệ môi trường.",
      subject: "Đạo đức",
      grade: 4,
      pageCount: 22,
      fileSize: 740_000,
      viewCount: 2120,
      downloadCount: 560,
      tags: ["đạo đức", "lớp 4", "cộng đồng"],
      categorySlug: "dao-duc",
      thumbnailUrl: thumb("D97706", "Đạo đức\n4"),
    },

    // Hoạt động trải nghiệm
    {
      title: "HĐTN lớp 3 — Quan sát cây cối trong sân trường",
      slug: "hdtn-lop-3-quan-sat-cay",
      description:
        "Phiếu học tập ghi nhật ký quan sát lá, thân, rễ; vẽ tranh và trình bày nhóm nhỏ.",
      subject: "Hoạt động trải nghiệm",
      grade: 3,
      pageCount: 16,
      fileSize: 540_000,
      viewCount: 1740,
      downloadCount: 480,
      tags: ["HĐTN", "lớp 3", "trải nghiệm"],
      categorySlug: "hoat-dong-tra-nghiem",
      thumbnailUrl: thumb("DC2626", "HĐTN\nlớp 3"),
    },
    {
      title: "HĐTN lớp 5 — Tham quan Bảo tàng (phiếu học tập trước — trong — sau)",
      slug: "hdtn-lop-5-bao-tang",
      description:
        "Chuẩn bị câu hỏi trước chuyến đi, ghi chép hiện vật yêu thích và chia sẻ cảm nhận sau hoạt động.",
      subject: "Hoạt động trải nghiệm",
      grade: 5,
      pageCount: 20,
      fileSize: 680_000,
      viewCount: 1890,
      downloadCount: 520,
      tags: ["HĐTN", "lớp 5", "bảo tàng"],
      categorySlug: "hoat-dong-tra-nghiem",
      thumbnailUrl: thumb("DC2626", "HĐTN\nlớp 5"),
    },

    // Sách giáo khoa
    {
      title: "SGK Toán lớp 1 — Bộ Cánh Diều (tập 1 + tập 2)",
      slug: "sgk-toan-1-canh-dieu",
      description:
        "Tài liệu tham khảo nội dung SGK Toán lớp 1 bộ Cánh Diều: các chủ đề số và hình học cơ bản.",
      subject: "Toán học",
      grade: 1,
      pageCount: 142,
      fileSize: 5_200_000,
      viewCount: 7620,
      downloadCount: 2100,
      tags: ["SGK", "toán", "lớp 1", "Cánh Diều"],
      categorySlug: "sgk",
      thumbnailUrl: thumb("4F46E5", "SGK Toán\n1"),
    },
    {
      title: "SGK Tiếng Việt lớp 3 — Bộ Kết nối tri thức",
      slug: "sgk-tieng-viet-3-ket-noi",
      description:
        "Tham khảo văn bản tập đọc, chính tả và phần luyện từ theo chương trình lớp 3.",
      subject: "Tiếng Việt",
      grade: 3,
      pageCount: 168,
      fileSize: 5_900_000,
      viewCount: 6840,
      downloadCount: 1880,
      tags: ["SGK", "tiếng Việt", "lớp 3"],
      categorySlug: "sgk",
      thumbnailUrl: thumb("4F46E5", "SGK TV\n3"),
    },
    {
      title: "SGK Tiếng Anh lớp 5 — Global Success (Student Book)",
      slug: "sgk-tieng-anh-5-global-success",
      description:
        "Nội dung học liệu Tiếng Anh lớp 5 theo chủ đề tích hợp kỹ năng nghe — nói — đọc — viết.",
      subject: "Tiếng Anh",
      grade: 5,
      pageCount: 128,
      fileSize: 4_600_000,
      viewCount: 5910,
      downloadCount: 1720,
      tags: ["SGK", "tiếng Anh", "lớp 5"],
      categorySlug: "sgk",
      thumbnailUrl: thumb("4F46E5", "SGK TA\n5"),
    },
  ];

  for (const d of documents) {
    const { categorySlug, ...data } = d;
    const cat = catMap[categorySlug];
    await prisma.document.upsert({
      where: { slug: data.slug },
      create: {
        ...data,
        fileUrl: SAMPLE_PDF,
        isPublished: true,
        categoryId: cat?.id,
        uploadedById: admin.id,
      },
      update: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        grade: data.grade,
        pageCount: data.pageCount,
        fileSize: data.fileSize,
        viewCount: data.viewCount,
        downloadCount: data.downloadCount,
        tags: data.tags,
        thumbnailUrl: data.thumbnailUrl,
        categoryId: cat?.id,
        isPublished: true,
      },
    });
  }

  // Analytics — 30 ngày gần nhất (dữ liệu mẫu)
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const views = Math.floor(Math.random() * 600) + 100;
    const downloads = Math.floor(views * (0.2 + Math.random() * 0.2));
    await prisma.analyticsDaily.upsert({
      where: { date },
      create: { date, views, downloads },
      update: { views, downloads },
    });
  }

  console.log("✅ Seed hoàn tất!");
  console.log(`   Admin:    ${adminEmail}  /  Admin@123456`);
  console.log(`   User:     hocsinh@hoclieu.vn  /  User@123456`);
  console.log(`   Danh mục: ${categoryData.length} mục`);
  console.log(`   Tài liệu: ${documents.length} tài liệu`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
