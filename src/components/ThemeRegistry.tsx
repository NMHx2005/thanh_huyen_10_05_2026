"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/theme";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // enableCssLayer=false: Emotion không bọc @layer mui → thắng Tailwind Preflight (@layer base).
  return (
    <AppRouterCacheProvider options={{ key: "mui", enableCssLayer: false }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
