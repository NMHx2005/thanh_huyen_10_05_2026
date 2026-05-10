import dynamic from "next/dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinkMui from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RelatedDocumentCard } from "@/components/document/RelatedDocumentCard";
import { DownloadButton } from "@/components/document/DownloadButton";
import { ShareButton } from "@/components/document/ShareButton";
import { getDocumentBySlug } from "@/lib/queries/documents";
import { prisma } from "@/lib/prisma";
import { sanitizeThumbnailUrl } from "@/lib/sanitizeThumbnailUrl";

const FlipbookViewer = dynamic(
  () =>
    import("@/components/document/FlipbookViewer").then((m) => ({
      default: m.FlipbookViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          height: 480,
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          color: "text.secondary",
          borderRadius: 2,
        }}
      >
        <CircularProgress size={28} />
        <Typography>Đang tải sách…</Typography>
      </Paper>
    ),
  },
);

const PDFViewer = dynamic(
  () =>
    import("@/components/document/PDFViewer").then((m) => ({
      default: m.PDFViewer,
    })),
  { ssr: false },
);

/** Chỉ chạy phía client — tránh lỗi hook/SSR khi bundle tách chunk (Invalid hook call). */
const ViewTracker = dynamic(
  () =>
    import("@/components/document/ViewTracker").then((m) => ({
      default: m.ViewTracker,
    })),
  { ssr: false },
);

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = await getDocumentBySlug(slug);
  if (!doc) return { title: "Không tìm thấy" };
  const ogThumb = sanitizeThumbnailUrl(doc.thumbnailUrl);
  return {
    title: doc.title,
    description: doc.description ?? `Tài liệu ${doc.subject ?? ""} — Học Liệu`,
    openGraph: ogThumb ? { images: [{ url: ogThumb }] } : undefined,
  };
}

export default async function DocumentDetailPage(props: Props) {
  const { slug } = await props.params;
  const doc = await getDocumentBySlug(slug);
  if (!doc) notFound();

  const related = doc.categoryId
    ? await prisma.document.findMany({
      where: {
        isPublished: true,
        categoryId: doc.categoryId,
        NOT: { id: doc.id },
      },
      orderBy: { viewCount: "desc" },
      take: 4,
      include: {
        category: { select: { name: true, slug: true, color: true, icon: true } },
      },
    })
    : [];

  const metaChips = [
    doc.pageCount != null ? `${doc.pageCount} trang` : null,
    `${doc.viewCount.toLocaleString("vi-VN")} lượt xem`,
    `${doc.downloadCount.toLocaleString("vi-VN")} lượt tải`,
  ].filter(Boolean) as string[];

  return (
    <Box sx={{ py: { xs: 3, md: 4 }, maxWidth: "100%", overflowX: "hidden" }}>
      <ViewTracker documentId={doc.id} />
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 3, flexWrap: "wrap", "& .MuiBreadcrumbs-separator": { mx: 0.75 } }}
      >
        <LinkMui
          component={Link}
          href="/"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          Trang chủ
        </LinkMui>
        {doc.category && (
          <LinkMui component={Link} href={`/danh-muc/${doc.category.slug}`} color="inherit">
            {doc.category.name}
          </LinkMui>
        )}
        <Typography
          color="text.primary"
          sx={{
            maxWidth: { xs: "100%", sm: 360, md: 480 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 600,
          }}
          title={doc.title}
        >
          {doc.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, md: 4, lg: 5 }} sx={{ maxWidth: "100%" }}>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ minWidth: 0 }}>
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <FlipbookViewer fileUrl={doc.fileUrl} />
            <Accordion variant="outlined" disableGutters sx={{ borderRadius: 2, "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ChevronDownIcon size={22} aria-hidden />}>
                <Typography sx={{ fontWeight: 600 }}>Xem dạng cuộn (dự phòng)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PDFViewer fileUrl={doc.fileUrl} />
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }} sx={{ minWidth: 0 }}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 2,
              position: { lg: "sticky" },
              top: { lg: 88 },
              alignSelf: "flex-start",
              maxWidth: "100%",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <Stack spacing={2.75} sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 800,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {doc.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {[doc.subject, doc.grade ? `Lớp ${doc.grade}` : null].filter(Boolean).join(" · ")}
              </Typography>
              {doc.description && (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {doc.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, rowGap: 1.25 }}>
                {metaChips.map((t) => (
                  <Chip key={t} label={t} size="small" variant="outlined" sx={{ maxWidth: "100%" }} />
                ))}
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  width: 1,
                  /* flex gap tránh margin bị reset (Tailwind/base) làm Stack spacing “mất tác dụng” */
                  gap: 4,
                  pb: 2.5,
                }}
              >
                <DownloadButton documentId={doc.id} />
                <ShareButton title={doc.title} path={`/tai-lieu/${doc.slug}`} />
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, pt: 1.5 }}>
                Tài liệu liên quan
              </Typography>
              {related.length > 0 ? (
                <Stack spacing={2.25} sx={{ minWidth: 0, pt: 0.25 }}>
                  {related.map((r: (typeof related)[number]) => (
                    <RelatedDocumentCard key={r.id} doc={r} />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có gợi ý khác.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
