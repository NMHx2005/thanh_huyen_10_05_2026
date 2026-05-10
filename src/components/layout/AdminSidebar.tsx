"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/Book";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
const DRAWER_W = 260;

const links = [
  { href: "/admin", label: "Tổng quan", icon: DashboardIcon },
  { href: "/admin/tai-lieu", label: "Tài liệu", icon: BookIcon },
  { href: "/admin/tai-lieu/them-moi", label: "Thêm mới", icon: AddIcon },
  { href: "/admin/danh-muc", label: "Danh mục", icon: FolderIcon },
] as const;

/** Tránh coi /admin/tai-lieu là active khi đang ở /admin/tai-lieu/them-moi — ưu tiên khớp href dài hơn */
function getActiveHref(pathname: string): string | null {
  const sorted = [...links].sort((a, b) => b.href.length - a.href.length);
  for (const { href } of sorted) {
    if (pathname === href || pathname.startsWith(`${href}/`)) return href;
  }
  return null;
}

function DrawerContents({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <Box sx={{ py: 2 }}>
      <Box
        component={Link}
        href="/"
        onClick={onNavigate}
        sx={{
          display: "block",
          px: 2,
          mb: 2,
          typography: "body2",
          fontWeight: 700,
          color: "primary.main",
          textDecoration: "none",
        }}
      >
        ← Về trang chủ
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List dense disablePadding>
        {links.map(({ href, label, icon: Icon }) => {
          const active = activeHref === href;
          return (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={active}
              onClick={onNavigate}
              sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: { sx: { typography: "body2", fontWeight: active ? 600 : 400 } },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export function AdminSidebar() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen((o) => !o);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{
          display: { xs: "block", md: "none" },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} aria-label="Mở menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Quản trị
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: { width: DRAWER_W, boxSizing: "border-box" },
        }}
      >
        <DrawerContents onNavigate={closeMobile} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_W,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_W,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          },
        }}
      >
        <DrawerContents />
      </Drawer>
    </>
  );
}
