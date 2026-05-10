"use client";

import Box from "@mui/material/Box";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.100" }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 10, md: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
