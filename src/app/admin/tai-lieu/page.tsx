import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Prisma } from "@prisma/client";
import { DocumentTable } from "@/components/admin/DocumentTable";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDocumentsPage(props: Props) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const categoryParam = typeof sp.category === "string" ? sp.category.trim() : "";
  const statusRaw = typeof sp.status === "string" ? sp.status.toLowerCase() : "all";
  const status =
    statusRaw === "published" || statusRaw === "draft" ? statusRaw : "all";

  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);
  const pageSizeRaw = parseInt(typeof sp.pageSize === "string" ? sp.pageSize : "10", 10);
  const pageSize = Math.min(50, Math.max(5, Number.isNaN(pageSizeRaw) ? 10 : pageSizeRaw));

  const where: Prisma.DocumentWhereInput = {};

  if (q.length > 0) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (categoryParam.length > 0) {
    where.categoryId = categoryParam;
  }

  if (status === "published") {
    where.isPublished = true;
  } else if (status === "draft") {
    where.isPublished = false;
  }

  const [documents, total, categories] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { name: true } } },
    }),
    prisma.document.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Quản lý tài liệu
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Sửa, ẩn/hiện hoặc xóa tài liệu.
        </Typography>
      </Box>
      <DocumentTable
        documents={documents.map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          grade: d.grade,
          viewCount: d.viewCount,
          downloadCount: d.downloadCount,
          isPublished: d.isPublished,
          category: d.category,
        }))}
        categories={categories}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={q}
        categoryId={categoryParam}
        statusFilter={status}
      />
    </Box>
  );
}
