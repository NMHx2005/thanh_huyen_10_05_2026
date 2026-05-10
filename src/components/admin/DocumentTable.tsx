"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";
import { adminErrorMessage, adminJsonFetch } from "@/lib/admin-json-fetch";

export type AdminDocRow = {
  id: string;
  title: string;
  slug: string;
  grade: number | null;
  viewCount: number;
  downloadCount: number;
  isPublished: boolean;
  category: { name: string } | null;
};

type StatusFilter = "all" | "published" | "draft";

type FilterState = {
  q: string;
  page: number;
  pageSize: number;
  categoryId: string;
  status: StatusFilter;
};

function buildDocQuery(updates: Partial<FilterState>, current: FilterState): string {
  const q = updates.q !== undefined ? updates.q : current.q;
  const page = updates.page !== undefined ? updates.page : current.page;
  const pageSize = updates.pageSize !== undefined ? updates.pageSize : current.pageSize;
  const categoryId = updates.categoryId !== undefined ? updates.categoryId : current.categoryId;
  const status = updates.status !== undefined ? updates.status : current.status;

  const usp = new URLSearchParams();
  if (q.trim()) usp.set("q", q.trim());
  if (categoryId.trim()) usp.set("category", categoryId.trim());
  if (status !== "all") usp.set("status", status);
  if (page > 1) usp.set("page", String(page));
  if (pageSize !== 10) usp.set("pageSize", String(pageSize));
  const s = usp.toString();
  return s ? `?${s}` : "";
}

type Props = {
  documents: AdminDocRow[];
  categories: { id: string; name: string }[];
  total: number;
  page: number;
  pageSize: number;
  searchQuery: string;
  categoryId: string;
  statusFilter: StatusFilter;
};

export function DocumentTable({
  documents,
  categories,
  total,
  page,
  pageSize,
  searchQuery,
  categoryId,
  statusFilter,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [filterQ, setFilterQ] = useState(searchQuery);

  const current: FilterState = {
    q: searchQuery,
    page,
    pageSize,
    categoryId,
    status: statusFilter,
  };

  useEffect(() => {
    setFilterQ(searchQuery);
  }, [searchQuery]);

  function pushQuery(updates: Partial<FilterState>) {
    const next = buildDocQuery(updates, current);
    router.push(`/admin/tai-lieu${next}`);
  }

  async function togglePublish(id: string, next: boolean) {
    setBusy(id);
    try {
      const { res, data } = await adminJsonFetch(`/api/admin/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Thao tác thất bại."));
        return;
      }
      toast.success(next ? "Đã xuất bản." : "Đã gỡ xuất bản.");
      router.refresh();
    } catch {
      toast.error("Thao tác thất bại.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Xóa tài liệu này?")) return;
    setBusy(id);
    try {
      const { res, data } = await adminJsonFetch(`/api/admin/documents/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Không xóa được."));
        return;
      }
      toast.success("Đã xóa.");
      router.refresh();
    } catch {
      toast.error("Không xóa được.");
    } finally {
      setBusy(null);
    }
  }

  const hasFilters = Boolean(searchQuery.trim() || categoryId.trim() || statusFilter !== "all" || page > 1);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          pushQuery({ q: filterQ, page: 1 });
        }}
        sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "flex-start" } }}>
            <TextField
              size="medium"
              fullWidth
              hiddenLabel
              placeholder="Tìm theo tiêu đề hoặc slug…"
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <SearchIcon sx={{ fontSize: 26, color: "primary.main" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="contained" sx={{ flexShrink: 0, borderRadius: 999, px: 3, minHeight: 48 }}>
              Lọc
            </Button>
            {hasFilters && (
              <Button
                type="button"
                variant="text"
                onClick={() => {
                  setFilterQ("");
                  router.push("/admin/tai-lieu");
                }}
              >
                Xoá lọc
              </Button>
            )}
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ maxWidth: { sm: 720 } }}>
            <FormControl size="medium" fullWidth sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <InputLabel id="admin-doc-category-label">Danh mục</InputLabel>
              <Select
                labelId="admin-doc-category-label"
                label="Danh mục"
                value={categoryId || ""}
                onChange={(e) => {
                  const val = String(e.target.value);
                  pushQuery({ categoryId: val, page: 1 });
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="medium" fullWidth sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <InputLabel id="admin-doc-status-label">Trạng thái</InputLabel>
              <Select
                labelId="admin-doc-status-label"
                label="Trạng thái"
                value={statusFilter}
                onChange={(e) => {
                  pushQuery({ status: e.target.value as StatusFilter, page: 1 });
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Lớp</TableCell>
              <TableCell align="right">Xem</TableCell>
              <TableCell align="right">Tải</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right" sx={{ width: 200 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Không có tài liệu phù hợp.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      {d.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{d.category?.name ?? "—"}</TableCell>
                  <TableCell>{d.grade ?? "—"}</TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {d.viewCount.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {d.downloadCount.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={d.isPublished ? "Hiện" : "Ẩn"}
                      color={d.isPublished ? "primary" : "default"}
                      variant={d.isPublished ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <Tooltip title="Xem">
                        <IconButton
                          component={Link}
                          href={`/tai-lieu/${d.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sửa">
                        <IconButton component={Link} href={`/admin/tai-lieu/${d.id}/chinh-sua`} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={d.isPublished ? "Ẩn" : "Xuất bản"}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={busy === d.id}
                            onClick={() => togglePublish(d.id, !d.isPublished)}
                            color="inherit"
                          >
                            <Typography variant="caption" sx={{ px: 0.5, fontWeight: 700 }}>
                              {d.isPublished ? "Ẩn" : "Hiện"}
                            </Typography>
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <span>
                          <IconButton size="small" color="error" disabled={busy === d.id} onClick={() => remove(d.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => {
          pushQuery({ page: newPage + 1 });
        }}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          const nextSize = parseInt(e.target.value, 10);
          pushQuery({ page: 1, pageSize: nextSize });
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Dòng / trang"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`}
      />
    </Paper>
  );
}
