"use client";

import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { toast } from "sonner";

type Props = {
  title: string;
  path: string;
  sx?: SxProps<Theme>;
};

export function ShareButton({ title, path, sx }: Props) {
  return (
    <Button
      type="button"
      variant="outlined"
      fullWidth
      size="large"
      startIcon={<ShareIcon />}
      sx={sx}
      onClick={async () => {
        const url =
          typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
          } else {
            await navigator.clipboard.writeText(url);
            toast.success("Đã sao chép liên kết.");
          }
        } catch {
          toast.message("Không thể chia sẻ trên trình duyệt này.");
        }
      }}
    >
      Chia sẻ
    </Button>
  );
}
