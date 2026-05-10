"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";
import { adminErrorMessage, adminJsonFetch } from "@/lib/admin-json-fetch";
import { UploadButton } from "@/lib/utils-uploadthing";
import { SUBJECT_OPTIONS } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  description: z.string().optional(),
  subject: z.string().min(1, "Chọn môn"),
  grade: z.number().min(1).max(12),
  categoryId: z.string().min(1, "Chọn danh mục"),
  tags: z.string().optional(),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type CategoryOpt = { id: string; name: string };

type Props = {
  categories: CategoryOpt[];
};

export function UploadForm({ categories }: Props) {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      subject: SUBJECT_OPTIONS[0],
      grade: 5,
      categoryId: categories[0]?.id ?? "",
      tags: "",
      isPublished: true,
    },
  });

  async function onSubmit(values: FormValues) {
    if (!pdfUrl) {
      toast.error("Vui lòng tải file PDF lên.");
      return;
    }
    const tags =
      values.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];
    try {
      const { res, data } = await adminJsonFetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description || undefined,
          subject: values.subject,
          grade: values.grade,
          categoryId: values.categoryId,
          tags,
          fileUrl: pdfUrl,
          thumbnailUrl: thumbUrl || undefined,
          isPublished: values.isPublished,
        }),
      });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Không lưu được."));
        return;
      }
      toast.success("Đã tạo tài liệu.");
      const created = data.document as { slug?: string } | undefined;
      if (created?.slug) router.push(`/tai-lieu/${created.slug}`);
      router.refresh();
    } catch {
      toast.error("Lỗi mạng.");
    }
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      {!formOpen ? (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)} sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
          Thêm tài liệu
        </Button>
      ) : (
        <Button type="button" variant="outlined" onClick={() => setFormOpen(false)} sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
          Thu gọn
        </Button>
      )}

      <Collapse in={formOpen} timeout="auto" unmountOnExit>
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                File PDF (tối đa 32MB)
              </Typography>
              <UploadButton
                endpoint="documentPdf"
                onClientUploadComplete={(res) => {
                  const u = res[0]?.ufsUrl ?? res[0]?.url;
                  if (u) setPdfUrl(u);
                  toast.success("Đã upload PDF.");
                }}
                onUploadError={() => {
                  toast.error("Upload thất bại.");
                }}
              />
              {pdfUrl && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, wordBreak: "break-all" }}>
                  {pdfUrl}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ảnh bìa (tuỳ chọn)
              </Typography>
              <UploadButton
                endpoint="documentThumbnail"
                onClientUploadComplete={(res) => {
                  const u = res[0]?.ufsUrl ?? res[0]?.url;
                  if (u) setThumbUrl(u);
                  toast.success("Đã upload ảnh.");
                }}
                onUploadError={() => {
                  toast.error("Upload ảnh thất bại.");
                }}
              />
            </Box>

            <TextField
              id="title"
              label="Tiêu đề"
              fullWidth
              size="medium"
              {...form.register("title")}
              error={!!form.formState.errors.title}
              helperText={form.formState.errors.title?.message}
            />

            <TextField
              id="description"
              label="Mô tả"
              fullWidth
              multiline
              minRows={3}
              size="medium"
              {...form.register("description")}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <FormControl fullWidth size="medium">
                    <InputLabel id="subj">Môn học</InputLabel>
                    <Select labelId="subj" label="Môn học" {...field}>
                      {SUBJECT_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="grade"
                control={form.control}
                render={({ field }) => (
                  <FormControl fullWidth size="medium">
                    <InputLabel id="gr">Lớp</InputLabel>
                    <Select
                      labelId="gr"
                      label="Lớp"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                        <MenuItem key={g} value={g}>
                          Lớp {g}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormControl fullWidth size="medium">
                  <InputLabel id="cat">Danh mục</InputLabel>
                  <Select labelId="cat" label="Danh mục" {...field}>
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              id="tags"
              label="Tags (cách nhau bởi dấu phẩy)"
              fullWidth
              size="medium"
              placeholder="toán, lớp 5, ôn tập"
              {...form.register("tags")}
            />

            <Controller
              name="isPublished"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(_, c) => field.onChange(c)} />}
                  label="Xuất bản ngay"
                />
              )}
            />

            <Button type="submit" variant="contained" size="large" sx={{ alignSelf: "flex-start", borderRadius: 999, px: 4 }}>
              Lưu tài liệu
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Stack>
  );
}
