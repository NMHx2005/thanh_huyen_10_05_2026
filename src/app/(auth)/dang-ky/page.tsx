"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { BookMarkedIcon } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import LinkMui from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Không thể đăng ký. Kiểm tra dữ liệu.";
        toast.error(msg);
        return;
      }
      toast.success("Đăng ký thành công. Đang đăng nhập…");
      await signIn("credentials", {
        email: email.trim(),
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch {
      toast.error("Lỗi mạng. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 4, sm: 8 },
        background: "linear-gradient(160deg, #FFEDD5 0%, #FFF7ED 35%, #FFFFFF 70%)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          border: 1,
          borderColor: "divider",
          boxSizing: "border-box",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 3,
              width: 1,
            }}
          >
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "12px",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                boxShadow: "0 4px 16px rgba(249, 115, 22, 0.35)",
                textDecoration: "none",
              }}
            >
              <BookMarkedIcon size={26} aria-hidden />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, textAlign: "center" }}>
              Tạo tài khoản
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              Đăng ký để tải xuống tài liệu PDF miễn phí.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 2.5,
              width: 1,
            }}
          >
            <TextField
              id="name"
              label="Họ tên"
              required
              fullWidth
              size="medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              required
              fullWidth
              size="medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Mật khẩu"
              type="password"
              required
              fullWidth
              size="medium"
              slotProps={{ htmlInput: { minLength: 6 } }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Tối thiểu 6 ký tự"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ borderRadius: 2, py: 1.2 }}
            >
              {loading ? "Đang xử lý…" : "Đăng ký"}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 0.5 }}>
              Đã có tài khoản?{" "}
              <LinkMui component={Link} href="/dang-nhap" sx={{ fontWeight: 600 }}>
                Đăng nhập
              </LinkMui>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
