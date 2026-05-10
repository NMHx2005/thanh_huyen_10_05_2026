# Học Liệu — Website chia sẻ tài liệu PDF (tiểu học)

Ứng dụng web để xem, tìm kiếm và quản lý tài liệu học tập dạng PDF: xem dạng lật trang, lọc theo danh mục / lớp / môn, tải file khi đã đăng nhập, và khu vực quản trị đầy đủ.

---

## Công nghệ sử dụng

| Lớp | Công nghệ |
|-----|-----------|
| Framework | **Next.js 14** (App Router), **React 18**, **TypeScript** |
| UI | **Material UI (MUI) v9**, Emotion (`@mui/material-nextjs`), **Tailwind CSS** (global utilities), font Be Vietnam Pro / Lexend |
| Dữ liệu | **PostgreSQL**, **Prisma ORM** (`db push`, không kèm migration SQL trong repo) |
| Xác thực | **NextAuth.js v4** (Credentials + bcrypt), JWT session |
| File | **UploadThing** (PDF + ảnh bìa), **pdf-lib** (đếm trang), **react-pdf** + **pdfjs-dist**, **react-pageflip** |
| Form / validation | **react-hook-form**, **Zod**, `@hookform/resolvers` |
| Khác | **Sonner** (toast), **Recharts** (biểu đồ admin), **Swiper**, **Lucide** (một số icon), **Slugify** |

---

## Chức năng website

### Người xem (không cần đăng nhập)

- **Trang chủ**: danh mục, tài liệu mới, tài liệu xem nhiều, ô tìm kiếm nhanh.
- **Danh sách tài liệu** (`/tai-lieu`): lọc theo danh mục, lớp, trạng thái xuất bản, phân trang.
- **Danh mục** (`/danh-muc/[slug]`): tài liệu thuộc từng danh mục.
- **Tìm kiếm** (`/tim-kiem`): tìm theo từ khóa (server-side).
- **Chi tiết tài liệu** (`/tai-lieu/[slug]`): mô tả, metadata, xem PDF (flipbook / trình xem), ghi nhận lượt xem.

### Người dùng đã đăng nhập

- **Đăng ký / đăng nhập** (`/dang-ky`, `/dang-nhap`).
- **Tải PDF**: chỉ khi có session hợp lệ; đếm lượt tải.

### Quản trị viên (`role: ADMIN`)

- **Dashboard** (`/admin`): thống kê tổng quan, biểu đồ lượt xem/tải theo ngày, tài liệu gần đây.
- **Tài liệu** (`/admin/tai-lieu`): danh sách, lọc, ẩn/hiện xuất bản, sửa, xóa, thêm mới (upload PDF + ảnh bìa).
- **Danh mục** (`/admin/danh-muc`): thêm / sửa tên / xóa (không xóa được nếu còn tài liệu gắn danh mục).

Middleware bảo vệ toàn bộ `/admin/*`; API `/api/admin/*` kiểm tra session admin trên server.

---

## Chạy project trên máy

### Yêu cầu

- **Node.js 18+**
- **PostgreSQL** (local hoặc cloud)
- Tài khoản **[UploadThing](https://uploadthing.com)** (token upload file)

### Biến môi trường

Sao chép `.env.example` → `.env` và điền:

| Biến | Ý nghĩa |
|------|---------|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL |
| `NEXTAUTH_URL` | URL gốc app (local: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Chuỗi bí mật ký session (vd: `openssl rand -base64 32`) |
| `UPLOADTHING_TOKEN` | Token từ dashboard UploadThing |

**Local vs production:** Trên máy, `NEXTAUTH_URL` **phải** là đúng URL bạn mở trình duyệt (thường `http://localhost:3000`). Nếu để nguyên URL Vercel trong `.env` khi chạy local, đăng nhập có thể lệch cookie và các API admin báo *Không có quyền*. Nên dùng `.env.local` chỉ cho máy (gitignored) hoặc sửa tạm `NEXTAUTH_URL` khi dev.

### Lệnh

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

**Tài khoản seed (sau `db:seed`):**

- Admin: `admin@hoclieu.vn` / `Admin@123456`
- User demo: `hocsinh@hoclieu.vn` / `User@123456`

### Scripts hữu ích

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Dev server |
| `npm run dev:clean` | Xóa `.next` rồi chạy dev (khi cache lỗi) |
| `npm run build` / `npm start` | Build production và chạy local |
| `npm run lint` | ESLint |
| `npm run db:push` | Đồng bộ schema Prisma → DB |
| `npm run db:seed` | Seed dữ liệu mẫu + user |
| `npm run db:normalize-subjects` | Chuẩn hóa cột `subject` cũ → đúng danh mục môn trong code |

---

## Deploy lên Vercel

**Có thể deploy được.** Next.js 14 là stack phù hợp Vercel; cần lưu ý database và biến môi trường.

### Checklist

1. **PostgreSQL ngoài Vercel** — Vercel không cung cấp Postgres mặc định. Dùng **Supabase**, **Neon**, **Railway**, **PlanetScale** (Postgres-compatible), v.v.
2. **`DATABASE_URL` trên serverless** — Dùng URL **transaction pooler**, không dùng **session pool** của Supabase (giới hạn ~15 client, lỗi `EMAXCONNSESSION`). Chuỗi Supabase: cổng **6543**, thêm `?pgbouncer=true`. Neon/Railway: dùng connection string “pooled” nếu có.
3. **Biến trên Vercel** — Thêm giống `.env.example`: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `UPLOADTHING_TOKEN`.
4. **`NEXTAUTH_URL`** — Đặt đúng URL production (vd: `https://ten-du-an.vercel.app` hoặc domain tùy chỉnh). Sai URL thường gây lỗi đăng nhập / callback.
5. **Database schema** — Sau khi gán `DATABASE_URL`, chạy một lần trên máy (hoặc CI):  
   `npx prisma db push`  
   hoặc dùng máy có quyền kết nối DB production. Seed tuỳ chọn: `npm run db:seed`.
6. **Build** — `npm run build` chạy `postinstall` → `prisma generate`. Không cần cấu hình đặc biệt thêm nếu repo build được local.

### UploadThing

Giữ `UPLOADTHING_TOKEN` trên Vercel; kiểm tra domain app được phép trong dashboard UploadThing nếu có giới hạn origin.

### Giới hạn đã biết

- Upload PDF cấu hình **tối đa ~32MB** (theo router UploadThing trong code).
- Worker PDF (`pdfjs`) dùng CDN cấu hình trong `next.config` — khi deploy cần domain ảnh/PDF remote nằm trong `images.remotePatterns` nếu thêm nguồn mới.

### Lỗi `EMAXCONNSESSION` / `max clients reached in session mode` (Supabase)

Supabase đang dùng **Session pool** (giới hạn rất thấp). Trong dashboard **Database → Connection string**, chọn **Transaction pool** (thường port **6543**), dán vào `DATABASE_URL` và thêm query `pgbouncer=true`, ví dụ:

`postgresql://...@....pooler.supabase.com:6543/postgres?pgbouncer=true`

Sau đó restart dev server. Code đã dùng singleton `PrismaClient` để không mở thêm client thừa trong một process.

### Đã đăng nhập admin nhưng API quản trị báo *Không có quyền*

1. Kiểm tra `NEXTAUTH_URL` trên local (mục trên).  
2. Đăng xuất rồi đăng nhập lại sau khi sửa `.env`.  
3. Code đã đọc JWT theo **HTTP/HTTPS của request** (không chỉ theo biến môi trường) để tránh lệch tên cookie giữa localhost và production.

---

## Cấu trúc thư mục (rút gọn)

| Đường dẫn | Nội dung |
|-----------|----------|
| `src/app/(site)/` | Trang công khai (trang chủ, tài liệu, danh mục, tìm kiếm) |
| `src/app/(auth)/` | Đăng nhập / đăng ký |
| `src/app/admin/` | Quản trị |
| `src/app/api/` | Route handlers (REST, NextAuth, UploadThing, admin) |
| `prisma/schema.prisma` | User, Category, Document, AnalyticsDaily |
| `prisma/seed.ts` | Dữ liệu mẫu |

---

## License

Private / theo thỏa thuận dự án.
