import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, GraduationCapIcon, SearchIcon } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DocumentSwiper } from "@/components/document/DocumentSwiper";
import { SearchBar } from "@/components/search/SearchBar";
import { prisma } from "@/lib/prisma";
import { theme } from "@/theme/theme";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=960&q=80";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="h4"
      component="h2"
      sx={{
        fontWeight: 800,
        color: "text.primary",
        letterSpacing: "-0.02em",
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
  );
}

export default async function HomePage() {
  const [categories, latest, popular] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 12,
      include: {
        _count: { select: { documents: { where: { isPublished: true } } } },
      },
    }),
    prisma.document.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        category: { select: { name: true, slug: true, color: true, icon: true } },
      },
    }),
    prisma.document.findMany({
      where: { isPublished: true },
      orderBy: { viewCount: "desc" },
      take: 12,
      include: {
        category: { select: { name: true, slug: true, color: true, icon: true } },
      },
    }),
  ]);

  const features = [
    {
      icon: (
        <Box sx={{ color: "primary.main", display: "flex" }}>
          <BookOpenIcon size={32} strokeWidth={1.5} aria-hidden />
        </Box>
      ),
      title: "Xem lật sách trực tuyến",
      desc: "Trải nghiệm đọc PDF giống sách giấy, thuận tiện trên mọi thiết bị.",
    },
    {
      icon: (
        <Box sx={{ color: "primary.main", display: "flex" }}>
          <SearchIcon size={32} strokeWidth={1.5} aria-hidden />
        </Box>
      ),
      title: "Tìm theo môn & lớp",
      desc: "Lọc nhanh theo danh mục, môn học và khối lớp phù hợp chương trình.",
    },
    {
      icon: (
        <Box sx={{ color: "primary.main", display: "flex" }}>
          <GraduationCapIcon size={32} strokeWidth={1.5} aria-hidden />
        </Box>
      ),
      title: "Tải về khi đã đăng nhập",
      desc: "Lưu tài liệu về máy để ôn tập offline, quản lý tài khoản một nơi.",
    },
  ];

  return (
    <>
      {/* Hero — hai cột, nhiều khoảng trống */}
      <Paper
        elevation={0}
        sx={{
          mx: { xs: -2, sm: -3 },
          px: { xs: 2, sm: 4, md: 5 },
          py: { xs: 5, md: 7 },
          mb: 0,
          borderRadius: 0,
          background: `linear-gradient(165deg, ${theme.palette.primary.light} 0%, #FFF7ED 28%, #FFFFFF 55%)`,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="overline"
              sx={{ fontWeight: 700, color: "primary.main", letterSpacing: "0.12em", mb: 1.5, display: "block" }}
            >
              HỌC TẬP MỌI LÚC
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
                color: "text.primary",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "2.85rem" },
                letterSpacing: "-0.03em",
                mb: 2.5,
              }}
            >
              Kho tài liệu{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                học tập
              </Box>
              <br />
              gọn gàng, dễ đọc
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: "1.05rem", md: "1.125rem" }, maxWidth: 520, mb: 3.5, lineHeight: 1.85 }}
            >
              Tài liệu PDF có tổ chức — tìm kiếm nhanh, xem lật sách mượt, tải về khi cần. Giao diện sáng, chữ đen trên
              nền trắng, điểm nhấn cam như các trang học lớn.
            </Typography>
            <Box sx={{ maxWidth: 560, mb: 3 }}>
              <SearchBar variant="hero" />
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
              <Button
                component={Link}
                href="/tai-lieu"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowRightIcon size={20} aria-hidden />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  boxShadow: "0 4px 20px rgba(249, 115, 22, 0.35)",
                }}
              >
                Khám phá tài liệu
              </Button>
              <Button
                component={Link}
                href="/dang-ky"
                variant="outlined"
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: "1rem", borderWidth: 2, "&:hover": { borderWidth: 2 } }}
              >
                Tạo tài khoản miễn phí
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 24px 48px rgba(15, 23, 42, 0.12)",
                aspectRatio: { xs: "16/11", md: "4/3" },
                maxHeight: { md: 420 },
                border: "4px solid #fff",
              }}
            >
              <Image src={HERO_IMAGE} alt="" fill priority sizes="(max-width: 900px) 100vw, 480px" style={{ objectFit: "cover" }} />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(15,23,42,0.75))",
                  p: 3,
                }}
              >
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                  Học tập hiện đại
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
                  Tài liệu phục vụ học sinh, giáo viên và phụ huynh.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Ba điểm mạnh */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((f) => (
            <Grid key={f.title} size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={2.5} sx={{ alignItems: "flex-start" }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {f.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Danh mục */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          bgcolor: "grey.50",
          mx: { xs: -2, sm: -3 },
          px: { xs: 2, sm: 4 },
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <SectionTitle>Danh mục nổi bật</SectionTitle>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 560, lineHeight: 1.75 }}>
              Chọn môn hoặc chủ đề để xem tài liệu tương ứng.
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={3}>
          {categories.map((c) => (
            <Grid key={c.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
                  "&:hover": {
                    boxShadow: "0 12px 32px rgba(249, 115, 22, 0.15)",
                    transform: "translateY(-4px)",
                    borderColor: "primary.light",
                  },
                }}
              >
                <CardActionArea component={Link} href={`/danh-muc/${c.slug}`} sx={{ py: 3, px: 2 }}>
                  <CardContent sx={{ textAlign: "center", "&:last-child": { pb: 3 } }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: "primary.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        fontSize: "1.75rem",
                      }}
                    >
                      {c.icon ?? "📚"}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.35, color: "text.primary" }}>
                      {c.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                      {c._count.documents} tài liệu
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        {categories.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Chưa có danh mục. Đăng nhập quản trị để thêm danh mục và tài liệu.
          </Typography>
        )}
      </Box>

      {/* Tài liệu mới */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", mb: 4, gap: 2, flexWrap: "wrap" }}>
          <Box>
            <SectionTitle>Tài liệu mới nhất</SectionTitle>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>
              Cập nhật thường xuyên — kéo ngang để xem thêm.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/tai-lieu"
            variant="outlined"
            color="primary"
            endIcon={<ArrowRightIcon size={20} aria-hidden />}
            sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 }, flexShrink: 0 }}
          >
            Xem tất cả
          </Button>
        </Stack>
        {latest.length > 0 ? (
          <DocumentSwiper documents={latest} slidesPerView={5} />
        ) : (
          <Typography variant="body1" color="text.secondary">
            Chưa có tài liệu.
          </Typography>
        )}
      </Box>

      {/* Nhiều lượt xem */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          bgcolor: "grey.50",
          mx: { xs: -2, sm: -3 },
          px: { xs: 2, sm: 4 },
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", mb: 4, gap: 2, flexWrap: "wrap" }}>
          <Box>
            <SectionTitle>Nhiều lượt xem</SectionTitle>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>
              Tài liệu được học sinh và giáo viên quan tâm nhất.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/tai-lieu?sort=views"
            variant="outlined"
            color="primary"
            endIcon={<ArrowRightIcon size={20} aria-hidden />}
            sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
          >
            Xem thêm
          </Button>
        </Stack>
        {popular.length > 0 ? (
          <DocumentSwiper documents={popular} slidesPerView={4} />
        ) : (
          <Typography variant="body1" color="text.secondary">
            Chưa có dữ liệu xem nhiều.
          </Typography>
        )}
      </Box>
    </>
  );
}
