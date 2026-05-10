"use client";

import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LinkMui from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const footerLinkSx = {
  color: "rgba(255,255,255,0.82)",
  fontSize: "0.9375rem",
  lineHeight: 1.7,
  fontWeight: 400,
  textDecoration: "none",
  display: "inline-block",
  "&:hover": { color: "primary.light" },
} as const;

const colTitleSx = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.875rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  mb: 2,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ mt: "auto" }}>
      {/* Khối thông tin + cột — nền tối kiểu hoc10 */}
      <Box
        sx={{
          bgcolor: "#2d2d2d",
          color: "rgba(255,255,255,0.88)",
          pt: { xs: 5, md: 6 },
          pb: { xs: 4, md: 5 },
          borderTop: "4px solid",
          borderColor: "primary.main",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 5 }} sx={{ mb: { xs: 4, md: 5 } }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 700, color: "#fff", mb: 2, lineHeight: 1.35 }}
              >
                Nền tảng{" "}
                <Box component="span" sx={{ color: "primary.light" }}>
                  Học Liệu
                </Box>
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <PhoneInTalkOutlinedIcon sx={{ color: "primary.light", fontSize: 28 }} />
                <LinkMui href="tel:1900636464" sx={{ ...footerLinkSx, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                  1900 636 464
                </LinkMui>
              </Stack>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>
                Đường dây hỗ trợ (demo). Thay số điện thoại thực tế khi triển khai.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.85, mb: 2 }}>
                <Box component="span" sx={{ color: "#fff", fontWeight: 600 }}>
                  Thông tin pháp lý (mẫu):
                </Box>{" "}
                Giấy phép / mã số doanh nghiệp do cơ quan có thẩm quyền cấp. Vui lòng cập nhật nội dung chính xác theo doanh
                nghiệp của bạn.
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.85, mb: 2 }}>
                <Box component="span" sx={{ color: "#fff", fontWeight: 600 }}>
                  Trụ sở (mẫu):
                </Box>{" "}
                Việt Nam — thay bằng địa chỉ đầy đủ khi có dữ liệu thật.
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.85 }}>
                <Box component="span" sx={{ color: "#fff", fontWeight: 600 }}>
                  Đại diện pháp luật (mẫu):
                </Box>{" "}
                Cập nhật theo giấy phép đăng ký.
              </Typography>
            </Grid>
          </Grid>

          {/* Logo trắng / nhãn */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 3,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Box
              component={Link}
              href="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MenuBookIcon sx={{ fontSize: 28, color: "#fff" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                Học Liệu
              </Typography>
            </Box>
          </Box>

          {/* Cột menu giữa */}
          <Grid container spacing={{ xs: 4, md: 3 }} sx={{ pt: 5 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography component="h3" sx={colTitleSx}>
                Về Học Liệu
              </Typography>
              <Stack component="ul" spacing={1.25} sx={{ m: 0, p: 0, listStyle: "none" }}>
                <li>
                  <LinkMui component={Link} href="/tai-lieu" sx={footerLinkSx}>
                    Danh mục tài liệu
                  </LinkMui>
                </li>
                <li>
                  <LinkMui component={Link} href="/tim-kiem" sx={footerLinkSx}>
                    Tìm kiếm
                  </LinkMui>
                </li>
                <li>
                  <LinkMui component={Link} href="/dang-nhap" sx={footerLinkSx}>
                    Đăng nhập
                  </LinkMui>
                </li>
                <li>
                  <LinkMui component={Link} href="/dang-ky" sx={footerLinkSx}>
                    Đăng ký thành viên
                  </LinkMui>
                </li>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography component="h3" sx={colTitleSx}>
                Giáo viên
              </Typography>
              <Stack component="ul" spacing={1.25} sx={{ m: 0, p: 0, listStyle: "none", mb: 3 }}>
                <li>
                  <LinkMui component={Link} href="/tai-lieu" sx={footerLinkSx}>
                    Kho tài liệu dạy học
                  </LinkMui>
                </li>
                <li>
                  <LinkMui component={Link} href="/tai-lieu?sort=views" sx={footerLinkSx}>
                    Tài liệu xem nhiều
                  </LinkMui>
                </li>
              </Stack>
              <Typography component="h3" sx={{ ...colTitleSx, mt: { xs: 0, sm: 0 } }}>
                Học sinh
              </Typography>
              <Stack component="ul" spacing={1.25} sx={{ m: 0, p: 0, listStyle: "none" }}>
                <li>
                  <LinkMui component={Link} href="/" sx={footerLinkSx}>
                    Trang chủ
                  </LinkMui>
                </li>
                <li>
                  <LinkMui component={Link} href="/tai-lieu" sx={footerLinkSx}>
                    Tủ sách / Tài liệu
                  </LinkMui>
                </li>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography component="h3" sx={colTitleSx}>
                Hỗ trợ
              </Typography>
              <Stack component="ul" spacing={1.25} sx={{ m: 0, p: 0, listStyle: "none", mb: 3 }}>
                <li>
                  <Typography sx={{ ...footerLinkSx, cursor: "default" }}>Câu hỏi thường gặp (sắp có)</Typography>
                </li>
                <li>
                  <LinkMui href="mailto:hotro@hoclieu.vn" sx={footerLinkSx}>
                    Liên hệ qua email
                  </LinkMui>
                </li>
              </Stack>
              <Typography component="h3" sx={colTitleSx}>
                Liên kết
              </Typography>
              <Stack component="ul" spacing={1.25} sx={{ m: 0, p: 0, listStyle: "none" }}>
                <li>
                  <LinkMui href="https://www.moet.gov.vn/" target="_blank" rel="noopener noreferrer" sx={footerLinkSx}>
                    Bộ GD&amp;ĐT
                  </LinkMui>
                </li>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ ...colTitleSx, letterSpacing: "0.04em" }}>Hotline &amp; dịch vụ</Typography>
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                <LinkMui
                  href="tel:1900636464"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#fff",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { color: "primary.light" },
                  }}
                >
                  <PhoneInTalkOutlinedIcon fontSize="small" />
                  1900 636 464
                </LinkMui>
                <LinkMui
                  href="mailto:hotro@hoclieu.vn"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontSize: "0.9375rem",
                    "&:hover": { color: "primary.light" },
                  }}
                >
                  <EmailOutlinedIcon fontSize="small" />
                  hotro@hoclieu.vn
                </LinkMui>
              </Stack>
              <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.55)", mb: 3 }}>
                8:00 – 21:30 các ngày trong tuần (demo)
              </Typography>

              <Typography sx={{ ...colTitleSx, mb: 1.5 }}>Kết nối</Typography>
              <Stack direction="row" spacing={1}>
                <LinkMui
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                >
                  <FacebookIcon fontSize="small" />
                </LinkMui>
                <LinkMui
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                >
                  <YouTubeIcon fontSize="small" />
                </LinkMui>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Thanh copyright — nền đậm hơn */}
      <Box sx={{ bgcolor: "#1a1a1a", py: 2.5, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.55)", textAlign: { xs: "center", sm: "left" }, lineHeight: 1.7 }}
          >
            © {year} — Bản quyền thuộc nền tảng{" "}
            <Box component="span" sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
              Học Liệu
            </Box>
            . Tham khảo bố cục học tập công khai.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
