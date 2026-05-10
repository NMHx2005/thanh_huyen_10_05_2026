import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import LinkMui from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { DocumentGrid } from "@/components/document/DocumentGrid";
import { DocumentPagination } from "@/components/search/DocumentPagination";
import { listDocuments } from "@/lib/queries/documents";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage(props: Props) {
  const { category: slug } = await props.params;
  const sp = await props.searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;

  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) notFound();

  const { items, total, totalPages, page: currentPage } = await listDocuments({
    page: Number.isNaN(page) ? 1 : page,
    categorySlug: slug,
  });

  return (
    <Box sx={{ py: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <LinkMui component={Link} href="/" color="inherit">
          Trang chủ
        </LinkMui>
        <LinkMui component={Link} href="/tai-lieu" color="inherit">
          Tài liệu
        </LinkMui>
        <Typography color="text.primary">{cat.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
        {cat.icon ? `${cat.icon} ` : ""}
        {cat.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {total.toLocaleString("vi-VN")} tài liệu trong danh mục này.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <DocumentGrid documents={items} />
      </Box>
      <DocumentPagination
        page={currentPage}
        totalPages={totalPages}
        pathname={`/danh-muc/${slug}`}
        query={{}}
      />
    </Box>
  );
}
