import { Suspense } from "react";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import LinkMui from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { DocumentGrid } from "@/components/document/DocumentGrid";
import { DocumentFilters } from "@/components/search/DocumentFilters";
import { DocumentPagination } from "@/components/search/DocumentPagination";
import { ListingFiltersLayout } from "@/components/search/ListingFiltersLayout";
import { SearchBar } from "@/components/search/SearchBar";
import { listDocuments } from "@/lib/queries/documents";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DocumentsPage(props: Props) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const grade = typeof sp.grade === "string" ? sp.grade : undefined;
  const subject = typeof sp.subject === "string" ? sp.subject : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const { items, total, totalPages, page: currentPage } = await listDocuments({
    page: Number.isNaN(page) ? 1 : page,
    q,
    categorySlug: category,
    grade,
    subject,
    sort,
  });

  const paginationQuery: Record<string, string | undefined> = {
    ...(q ? { q } : {}),
    ...(category ? { category } : {}),
    ...(grade ? { grade } : {}),
    ...(subject ? { subject } : {}),
    ...(sort && sort !== "newest" ? { sort } : {}),
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 2 }} aria-label="breadcrumb">
        <LinkMui
          component={Link}
          href="/"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <HomeIcon size={16} aria-hidden />
          Trang chủ
        </LinkMui>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          Tài liệu
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 800, borderLeft: 3, borderColor: "primary.main", pl: 1.5 }}
        >
          Tài liệu
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Tìm kiếm và lọc theo danh mục, môn, lớp.
        </Typography>
        <Box sx={{ mt: 2, maxWidth: 560, display: { xs: "block", md: "none" } }}>
          <SearchBar defaultValue={q} variant="hero" />
        </Box>
      </Box>

      <ListingFiltersLayout
        filters={
          <Suspense fallback={<Skeleton variant="rounded" height={400} sx={{ m: 2 }} />}>
            <DocumentFilters categories={categories} />
          </Suspense>
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Chip
            label={`${total.toLocaleString("vi-VN")} kết quả${q ? ` cho "${q}"` : ""}`}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>
        <DocumentGrid documents={items} />
        <DocumentPagination
          page={currentPage}
          totalPages={totalPages}
          pathname="/tai-lieu"
          query={paginationQuery}
        />
      </ListingFiltersLayout>
    </Box>
  );
}
