import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Prisma } from "@prisma/client";
import { CategoryAdmin } from "@/components/admin/CategoryAdmin";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage(props: Props) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);
  const pageSizeRaw = parseInt(typeof sp.pageSize === "string" ? sp.pageSize : "10", 10);
  const pageSize = Math.min(50, Math.max(5, Number.isNaN(pageSizeRaw) ? 10 : pageSizeRaw));

  const where: Prisma.CategoryWhereInput | undefined =
    q.length > 0
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.count({ where }),
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Danh mục
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          CRUD danh mục hiển thị trên trang chủ.
        </Typography>
      </Box>
      <CategoryAdmin
        categories={categories}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={q}
      />
    </Box>
  );
}
