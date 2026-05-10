"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  documentId: string;
  label?: string;
};

/** Lấy tên file từ Content-Disposition nếu có */
function parseFilenameFromCd(cd: string | null): string | null {
  if (!cd) return null;
  const star = cd.match(/filename\*=UTF-8''([^;\s]+)/i);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].replace(/^"+|"+$/g, ""));
    } catch {
      return null;
    }
  }
  const quoted = cd.match(/filename="([^"]+)"/i);
  if (quoted?.[1]) return quoted[1];
  const plain = cd.match(/filename=([^;\s]+)/i);
  if (plain?.[1]) return plain[1].replace(/^"+|"+$/g, "");
  return null;
}

export function DownloadButton({ documentId, label = "Tải về PDF" }: Props) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!session) {
      toast.message("Đăng nhập để tải tài liệu", {
        description: "Bạn cần tài khoản thành viên để tải file.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/download`, {
        credentials: "same-origin",
      });
      if (res.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Đăng nhập lại.");
        return;
      }
      if (!res.ok) {
        toast.error("Không tải được file.");
        return;
      }
      const blob = await res.blob();
      const name =
        parseFilenameFromCd(res.headers.get("Content-Disposition")) ?? "tai-lieu.pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Lỗi mạng.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "unauthenticated") {
    return (
      <Button
        component={Link}
        href={`/dang-nhap?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
        variant="contained"
        fullWidth
        size="large"
        startIcon={<DownloadIcon />}
      >
        Đăng nhập để tải
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="contained"
      fullWidth
      size="large"
      disabled={loading || status === "loading"}
      onClick={handleClick}
      startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <DownloadIcon />}
    >
      {label}
    </Button>
  );
}
