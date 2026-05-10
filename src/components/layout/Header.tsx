"use client";

import Link from "next/link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { UserMenu } from "@/components/layout/UserMenu";
import { SearchBar } from "@/components/search/SearchBar";

export function Header() {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, py: { xs: 0.5, md: 0 } }}>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 3 },
            height: "100%",
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "12px",
                bgcolor: "primary.main",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", lineHeight: 1.15 }}>
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: 800, color: "primary.main", letterSpacing: "-0.02em" }}
              >
                Học Liệu
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Tài liệu học tập
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1, minWidth: 0, maxWidth: 520, mx: "auto" }}>
            <SearchBar variant="hero" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, ml: { xs: "auto", md: 0 } }}>
            <Button
              component={Link}
              href="/tai-lieu"
              color="inherit"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                fontWeight: 600,
                px: 2,
                py: 1,
                color: "text.primary",
                "&:hover": { bgcolor: "grey.100", color: "primary.main" },
              }}
            >
              Tài liệu
            </Button>
            <Button
              component={Link}
              href="/tim-kiem"
              color="inherit"
              sx={{
                display: { xs: "none", lg: "inline-flex" },
                fontWeight: 600,
                px: 2,
                py: 1,
                color: "text.primary",
                "&:hover": { bgcolor: "grey.100", color: "primary.main" },
              }}
            >
              Tìm kiếm
            </Button>
            <UserMenu />
          </Box>
        </Container>
      </Toolbar>

      <Box
        sx={{
          display: { xs: "block", md: "none" },
          px: 2,
          pb: 2,
          pt: 0.5,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <SearchBar variant="hero" />
      </Box>
    </AppBar>
  );
}
