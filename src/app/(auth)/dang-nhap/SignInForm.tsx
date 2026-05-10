"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Email hoặc mật khẩu không đúng.");
        return;
      }
      toast.success("Đăng nhập thành công.");
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
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
        {/* Brand — flex + gap (tránh Stack/margin bị Tailwind base nuốt) */}
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
            Đăng nhập
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Dùng tài khoản để tải tài liệu.
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
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
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
            autoComplete="current-password"
            required
            fullWidth
            size="medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 0.5 }}>
            Chưa có tài khoản?{" "}
            <LinkMui component={Link} href="/dang-ky" sx={{ fontWeight: 600 }}>
              Đăng ký ngay
            </LinkMui>
          </Typography>
          <LinkMui
            component={Link}
            href="/"
            sx={{ display: "block", textAlign: "center", pt: 0.5 }}
            variant="body2"
            color="text.secondary"
          >
            Về trang chủ
          </LinkMui>
        </Box>
      </CardContent>
    </Card>
  );
}
