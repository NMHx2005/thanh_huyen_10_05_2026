"use client";

import Image from "next/image";
import Link from "next/link";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Category, Document } from "@prisma/client";
import { DocumentCardDownload } from "@/components/document/DocumentCardDownload";
import { sanitizeThumbnailUrl } from "@/lib/sanitizeThumbnailUrl";

export type DocumentCardModel = Pick<
  Document,
  | "id"
  | "slug"
  | "title"
  | "subject"
  | "grade"
  | "pageCount"
  | "downloadCount"
  | "viewCount"
  | "thumbnailUrl"
> & {
  category: Pick<Category, "name" | "slug" | "color" | "icon"> | null;
};

type Props = {
  doc: DocumentCardModel;
  className?: string;
  /** Thu nhỏ ảnh/chữ — dùng trong carousel trang chủ */
  compact?: boolean;
};

export function DocumentCard({ doc, className, compact = false }: Props) {
  const thumbSrc = sanitizeThumbnailUrl(doc.thumbnailUrl);
  const meta =
    [doc.subject, doc.grade ? `Lớp ${doc.grade}` : null].filter(Boolean).join(" · ");

  return (
    <Card
      className={className}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(249, 115, 22, 0.18)",
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* Thumbnail */}
      <CardActionArea component={Link} href={`/tai-lieu/${doc.slug}`} sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "3/4",
            minHeight: compact ? 120 : 160,
            maxHeight: compact ? { xs: 200, sm: 220 } : undefined,
            bgcolor: "grey.100",
          }}
        >
          {thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={doc.title}
              fill
              style={{ objectFit: "cover" }}
              sizes={
                compact
                  ? "(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 20vw"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              }
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.50",
              }}
            >
              <DescriptionIcon
                sx={{ fontSize: compact ? 44 : 56, color: "primary.light", opacity: 0.7 }}
              />
            </Box>
          )}
          {doc.category && (
            <Chip
              size="small"
              label={[doc.category.icon, doc.category.name].filter(Boolean).join(" ")}
              sx={{
                position: "absolute",
                left: 8,
                top: 8,
                fontWeight: 600,
                backdropFilter: "blur(4px)",
                ...(doc.category.color
                  ? {
                      bgcolor: `${doc.category.color}CC`,
                      color: "#fff",
                      border: "none",
                    }
                  : { bgcolor: "rgba(255,255,255,0.9)" }),
              }}
            />
          )}
        </Box>
      </CardActionArea>

      {/* Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: compact ? 1.25 : 1.5, pb: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ mb: 0.5, fontSize: compact ? "0.7rem" : undefined }}
        >
          {meta || "Tài liệu"}
        </Typography>
        <Typography
          component={Link}
          href={`/tai-lieu/${doc.slug}`}
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            textDecoration: "none",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
            fontSize: compact ? "0.8125rem" : undefined,
            "&:hover": { color: "primary.main" },
          }}
        >
          {doc.title}
        </Typography>

        {/* Stats row */}
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          sx={{
            mt: compact ? 0.75 : 1,
            color: "text.secondary",
            alignItems: "center",
            "& .MuiTypography-caption": compact ? { fontSize: "0.68rem" } : undefined,
          }}
        >
          {doc.pageCount != null && (
            <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
              <DescriptionIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption">{doc.pageCount}</Typography>
            </Stack>
          )}
          <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
            <VisibilityIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">{doc.viewCount.toLocaleString("vi-VN")}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
            <DownloadIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">{doc.downloadCount.toLocaleString("vi-VN")}</Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ p: compact ? 1.25 : 1.5, pt: compact ? 1 : 1.5, mt: "auto" }}>
        <Button
          component={Link}
          href={`/tai-lieu/${doc.slug}`}
          variant="contained"
          size="small"
          sx={{ flex: 1, borderRadius: "6px", py: compact ? 0.35 : undefined, fontSize: compact ? "0.75rem" : undefined }}
        >
          Xem
        </Button>
        <DocumentCardDownload documentId={doc.id} slug={doc.slug} />
      </Stack>
    </Card>
  );
}
