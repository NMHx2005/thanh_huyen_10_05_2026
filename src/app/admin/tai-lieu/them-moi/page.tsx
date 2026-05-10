import Link from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinkMui from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { UploadForm } from "@/components/admin/UploadForm";
import { prisma } from "@/lib/prisma";

export default async function AdminNewDocumentPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Thêm tài liệu
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Upload PDF và điền thông tin.
        </Typography>
      </Box>
      {categories.length === 0 ? (
        <Alert severity="info">
          Chưa có danh mục.{" "}
          <LinkMui component={Link} href="/admin/danh-muc" sx={{ fontWeight: 600 }}>
            Tạo danh mục trước
          </LinkMui>
          .
        </Alert>
      ) : (
        <UploadForm categories={categories} />
      )}
    </Box>
  );
}
