"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

export function UserMenu() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  if (status === "loading") {
    return (
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "action.hover",
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.5 },
          },
        }}
      />
    );
  }

  if (!session?.user) {
    return (
      <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }} sx={{ alignItems: "center", flexShrink: 0 }}>
        <Button
          component={Link}
          href="/dang-nhap"
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderWidth: 2,
            px: { xs: 1.25, sm: 2 },
            display: { xs: "none", sm: "inline-flex" },
            "&:hover": { borderWidth: 2 },
          }}
        >
          Đăng nhập
        </Button>
        <Button
          component={Link}
          href="/dang-nhap"
          variant="outlined"
          color="primary"
          size="small"
          sx={{ display: { xs: "inline-flex", sm: "none" }, minWidth: 0, px: 1.25, borderWidth: 2 }}
          aria-label="Đăng nhập"
        >
          <LoginIcon fontSize="small" />
        </Button>
        <Button
          component={Link}
          href="/dang-ky"
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PersonAddIcon sx={{ fontSize: 18 }} />}
          sx={{ px: { xs: 1.25, sm: 2 }, boxShadow: "0 2px 12px rgba(249, 115, 22, 0.35)" }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Đăng ký
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Đ.ký
          </Box>
        </Button>
      </Stack>
    );
  }

  const initial = (session.user.name?.[0] ?? session.user.email?.[0] ?? "U").toUpperCase();

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ p: 0 }}
      >
        <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontSize: "0.95rem", color: "#fff" }}>
          {initial}
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { minWidth: 220, mt: 1.5, borderRadius: 2 } },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {session.user.name ?? "Thành viên"}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
            {session.user.email}
          </Typography>
        </Box>
        <Divider />
        {session.user.role === "ADMIN" && (
          <MenuItem
            onClick={() => {
              handleClose();
              router.push("/admin");
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Quản trị
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose();
            router.push("/tai-lieu");
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Tài liệu
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            signOut({ callbackUrl: "/" });
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
}
