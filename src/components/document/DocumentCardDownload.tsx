"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type Props = {
  documentId: string;
  slug: string;
};

export function DocumentCardDownload({ documentId, slug }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <IconButton size="small" disabled sx={{ border: 1, borderColor: "divider" }}>
        <DownloadIcon fontSize="small" />
      </IconButton>
    );
  }

  if (!session) {
    return (
      <Tooltip title="Đăng nhập để tải về">
        <IconButton
          component={Link}
          href={`/dang-nhap?callbackUrl=${encodeURIComponent(`/tai-lieu/${slug}`)}`}
          size="small"
          sx={{ border: 1, borderColor: "divider", color: "text.secondary" }}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Tải về">
      <IconButton
        component="a"
        href={`/api/documents/${documentId}/download`}
        rel="nofollow"
        size="small"
        color="primary"
        sx={{ border: 1, borderColor: "primary.light" }}
      >
        <DownloadIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
