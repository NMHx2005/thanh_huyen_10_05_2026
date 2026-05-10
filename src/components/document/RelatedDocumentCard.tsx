"use client";

import Image from "next/image";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionIcon from "@mui/icons-material/Description";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import type { DocumentCardModel } from "@/components/document/DocumentCard";
import { sanitizeThumbnailUrl } from "@/lib/sanitizeThumbnailUrl";

type Props = {
  doc: DocumentCardModel;
};

/** Gọn, nằm ngang — dùng trong sidebar trang chi tiết, tránh card dọc quá cao. */
export function RelatedDocumentCard({ doc }: Props) {
  const thumbSrc = sanitizeThumbnailUrl(doc.thumbnailUrl);
  const meta =
    [doc.subject, doc.grade ? `Lớp ${doc.grade}` : null].filter(Boolean).join(" · ");

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        overflow: "hidden",
        minWidth: 0,
        maxWidth: "100%",
        "&:hover": { borderColor: "primary.light", boxShadow: 1 },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/tai-lieu/${doc.slug}`}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          flex: 1,
          minWidth: 0,
          justifyContent: "flex-start",
          p: 0,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 88,
            height: 118,
            flexShrink: 0,
            bgcolor: "grey.100",
          }}
        >
          {thumbSrc ? (
            <Image
              src={thumbSrc}
              alt=""
              fill
              style={{ objectFit: "cover" }}
              sizes="88px"
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DescriptionIcon sx={{ fontSize: 32, color: "action.disabled" }} />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            py: 1.5,
            px: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.75,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {doc.title}
          </Typography>
          {meta ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {meta}
            </Typography>
          ) : null}
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              typography: "caption",
              color: "primary.main",
              fontWeight: 600,
              mt: 0.25,
            }}
          >
            Xem tài liệu
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
