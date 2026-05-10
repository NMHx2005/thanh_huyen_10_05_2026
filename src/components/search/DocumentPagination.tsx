"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

type Props = {
  page: number;
  totalPages: number;
  /** Path including leading slash, e.g. /tai-lieu or /tim-kiem or /danh-muc/foo */
  pathname: string;
  /** Query keys to preserve (page is applied separately) */
  query: Record<string, string | undefined>;
};

function buildHref(pathname: string, query: Record<string, string | undefined>, nextPage: number) {
  const p = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v) p.set(k, v);
  });
  if (nextPage > 1) p.set("page", String(nextPage));
  else p.delete("page");
  const qs = p.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function DocumentPagination({ page, totalPages, pathname, query }: Props) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        color="primary"
        page={page}
        count={totalPages}
        showFirstButton
        showLastButton
        onChange={(_, value) => {
          router.push(buildHref(pathname, query, value));
        }}
      />
    </Box>
  );
}
