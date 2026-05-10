"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
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
import type { Category } from "@prisma/client";
import { toast } from "sonner";
import { adminErrorMessage, adminJsonFetch } from "@/lib/admin-json-fetch";

type Props = {
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
  searchQuery: string;
};

function buildListQuery(updates: { q?: string; page?: number; pageSize?: number }, current: { q: string; page: number; pageSize: number }) {
  const q = updates.q !== undefined ? updates.q : current.q;
  const page = updates.page !== undefined ? updates.page : current.page;
  const pageSize = updates.pageSize !== undefined ? updates.pageSize : current.pageSize;
  const usp = new URLSearchParams();
  if (q.trim()) usp.set("q", q.trim());
  if (page > 1) usp.set("page", String(page));
  if (pageSize !== 10) usp.set("pageSize", String(pageSize));
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export function CategoryAdmin({ categories: initial, total, page, pageSize, searchQuery }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [filterQ, setFilterQ] = useState(searchQuery);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    setFilterQ(searchQuery);
  }, [searchQuery]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy("new");
    try {
      const { res, data } = await adminJsonFetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon.trim() || null,
          color: color.trim() || null,
        }),
      });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Không tạo được."));
        return;
      }
      toast.success("Đã tạo danh mục.");
      setName("");
      setIcon("");
      setColor("");
      setCreateOpen(false);
      router.refresh();
    } catch {
      toast.error("Không tạo được.");
    } finally {
      setBusy(null);
    }
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setEditName(cat.name);
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editing || !editName.trim()) return;
    setBusy(editing.id);
    try {
      const { res, data } = await adminJsonFetch(`/api/admin/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Không cập nhật được."));
        return;
      }
      toast.success("Đã cập nhật.");
      setEditOpen(false);
      setEditing(null);
      router.refresh();
    } catch {
      toast.error("Lỗi.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Xóa danh mục? Tài liệu liên kết có thể lỗi.")) return;
    setBusy(id);
    try {
      const { res, data } = await adminJsonFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Không xóa được (còn tài liệu?)."));
        return;
      }
      toast.success("Đã xóa.");
      router.refresh();
    } catch {
      toast.error("Không xóa được (còn tài liệu?).");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Stack spacing={4}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)} sx={{ borderRadius: 999 }}>
          Thêm danh mục
        </Button>
      </Box>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={create}>
          <DialogTitle sx={{ fontWeight: 700 }}>Thêm danh mục</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 0.5 }}>
              <TextField
                id="cname"
                label="Tên"
                required
                fullWidth
                size="medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id="cicon"
                label="Icon (emoji)"
                fullWidth
                size="medium"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
              <TextField
                id="ccolor"
                label="Màu (hex)"
                fullWidth
                size="medium"
                placeholder="#F97316"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button type="button" onClick={() => setCreateOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="contained" disabled={busy === "new"} sx={{ borderRadius: 999 }}>
              Tạo danh mục
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            const next = buildListQuery(
              { q: filterQ, page: 1, pageSize },
              { q: searchQuery, page, pageSize },
            );
            router.push(`/admin/danh-muc${next}`);
          }}
          sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
            <TextField
              size="medium"
              fullWidth
              hiddenLabel
              placeholder="Tìm theo tên hoặc slug…"
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
            {(searchQuery || page > 1) && (
              <Button
                type="button"
                variant="text"
                onClick={() => {
                  setFilterQ("");
                  router.push("/admin/danh-muc");
                }}
              >
                Xoá lọc
              </Button>
            )}
          </Stack>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Màu</TableCell>
                <TableCell align="right" sx={{ width: 120 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initial.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Không có danh mục phù hợp.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                initial.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{c.slug}</TableCell>
                    <TableCell>{c.icon}</TableCell>
                    <TableCell>{c.color}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sửa tên">
                        <IconButton size="small" disabled={busy === c.id} onClick={() => openEdit(c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton size="small" color="error" disabled={busy === c.id} onClick={() => remove(c.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
            const next = buildListQuery(
              { q: searchQuery, page: newPage + 1, pageSize },
              { q: searchQuery, page, pageSize },
            );
            router.push(`/admin/danh-muc${next}`);
          }}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            const nextSize = parseInt(e.target.value, 10);
            const next = buildListQuery(
              { q: searchQuery, page: 1, pageSize: nextSize },
              { q: searchQuery, page, pageSize },
            );
            router.push(`/admin/danh-muc${next}`);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Dòng / trang"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`}
        />
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Sửa tên danh mục</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên mới"
            fullWidth
            size="medium"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Huỷ</Button>
          <Button variant="contained" onClick={saveEdit} disabled={!editing || busy === editing.id} sx={{ borderRadius: 999 }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
