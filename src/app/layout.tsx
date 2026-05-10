import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Be_Vietnam_Pro, Lexend } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { uploadRouter } from "@/lib/uploadthing";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Học Liệu — Tài liệu học tập PDF",
    template: "%s | Học Liệu",
  },
  description:
    "Kho tài liệu học tập PDF, xem lật sách trực tuyến, tìm kiếm và tải về.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn(beVietnam.variable, lexend.variable)}>
      <body className="min-h-screen font-sans antialiased">
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        <ThemeRegistry>
          <Providers>{children}</Providers>
          <Toaster position="top-center" richColors />
        </ThemeRegistry>
      </body>
    </html>
  );
}
