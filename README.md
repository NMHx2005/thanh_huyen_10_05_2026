# Học Liệu — Website tài liệu PDF

Ứng dụng Next.js 14 (App Router) lưu trữ và chia sẻ tài liệu học tập: danh sách, tìm kiếm, xem flipbook (`react-pdf` + `react-pageflip`), tải PDF khi đã đăng nhập, khu vực quản trị (Uploadthing, Prisma, PostgreSQL). Giao diện người dùng dùng **Material UI (MUI) v9** với **Emotion** (`@mui/material-nextjs` cho App Router), typography **Be Vietnam Pro** / **Lexend**; **Tailwind** còn trong `globals.css` nhưng các trang chính đã chuyển sang component MUI.

## Yêu cầu

- Node 18+
- PostgreSQL
- Tài khoản [Uploadthing](https://uploadthing.com) (biến `UPLOADTHING_TOKEN`)

## Cài đặt

```bash
cp .env.example .env
# Điền DATABASE_URL, NEXTAUTH_SECRET, UPLOADTHING_TOKEN

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Tài khoản seed quản trị:

- Email: `admin@hoclieu.vn`
- Mật khẩu: `Admin@123456`

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy dev server |
| `npm run build` / `npm start` | Production |
| `npm run db:push` | Đồng bộ schema Prisma → DB |
| `npm run db:seed` | Dữ liệu mẫu + admin |
| `npm run db:normalize-subjects` | Chuẩn hóa trường `subject` cũ → đúng `SUBJECT_OPTIONS` (chạy khi đổi danh sách môn) |

## Cấu trúc chính

- `src/app/(site)/` — Trang công khai (trang chủ, `/tai-lieu`, `/danh-muc`, `/tim-kiem`)
- `src/app/(auth)/` — Đăng nhập / đăng ký
- `src/app/admin/` — Dashboard, quản lý tài liệu & danh mục
- `src/app/api/` — REST + NextAuth + Uploadthing
- `prisma/schema.prisma` — User, Category, Document, AnalyticsDaily

## Lưu ý

- Giới hạn upload PDF trên Uploadthing hiện cấu hình **32MB** (giới hạn kiểu của SDK).
- Trang chủ và API dùng Prisma: cần `DATABASE_URL` hợp lệ khi chạy.
- Worker PDF dùng CDN `unpkg` cùng phiên bản `pdfjs-dist` với `react-pdf`.

## Triển khai

- Frontend: Vercel (đặt biến môi trường giống `.env.example`).
- Database: Railway / Supabase Postgres.
- Đảm bảo `NEXTAUTH_URL` trùng domain production.
