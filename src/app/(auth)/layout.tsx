import type { ReactNode } from "react";
import Box from "@mui/material/Box";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  );
}
