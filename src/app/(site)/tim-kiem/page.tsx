import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DocumentGrid } from "@/components/document/DocumentGrid";
import { DocumentPagination } from "@/components/search/DocumentPagination";
import { SearchBar } from "@/components/search/SearchBar";
import { listDocuments } from "@/lib/queries/documents";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage(props: Props) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;

  const { items, total, totalPages, page: currentPage } = await listDocuments({
    page: Number.isNaN(page) ? 1 : page,
    q: q || undefined,
  });

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
        Tìm kiếm
      </Typography>
      <Box sx={{ mt: 3, maxWidth: 560 }}>
        <SearchBar defaultValue={q} variant="hero" />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        {q
          ? `${total.toLocaleString("vi-VN")} kết quả cho “${q}”`
          : "Nhập từ khóa để tìm tài liệu."}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <DocumentGrid documents={items} />
      </Box>
      <DocumentPagination
        page={currentPage}
        totalPages={totalPages}
        pathname="/tim-kiem"
        query={q ? { q } : {}}
      />
    </Box>
  );
}
