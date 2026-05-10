import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EditDocumentForm } from "@/components/admin/EditDocumentForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditDocumentPage(props: Props) {
  const { id } = await props.params;
  const [doc, categories] = await Promise.all([
    prisma.document.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!doc) notFound();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Chỉnh sửa tài liệu
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {doc.title}
        </Typography>
      </Box>
      <EditDocumentForm document={doc} categories={categories} />
    </Box>
  );
}
