"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import LinkMui from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";
import { adminErrorMessage, adminJsonFetch } from "@/lib/admin-json-fetch";
import type { Document } from "@prisma/client";
import { UploadButton } from "@/lib/utils-uploadthing";
import { SUBJECT_OPTIONS } from "@/types";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().min(1),
  grade: z.number().min(1).max(12),
  categoryId: z.string().min(1),
  tags: z.string().optional(),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type CategoryOpt = { id: string; name: string };

type Props = {
  document: Document;
  categories: CategoryOpt[];
};

export function EditDocumentForm({ document: doc, categories }: Props) {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: doc.title,
      description: doc.description ?? "",
      subject: doc.subject ?? SUBJECT_OPTIONS[0],
      grade: doc.grade ?? 5,
      categoryId: doc.categoryId ?? categories[0]?.id ?? "",
      tags: doc.tags.join(", "),
      isPublished: doc.isPublished,
    },
  });

  async function onSubmit(values: FormValues) {
    const tags =
      values.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];
    try {
      const { res, data } = await adminJsonFetch(`/api/admin/documents/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description || undefined,
          subject: values.subject,
          grade: values.grade,
          categoryId: values.categoryId,
          tags,
          fileUrl: pdfUrl ?? undefined,
          thumbnailUrl: thumbUrl ?? undefined,
          isPublished: values.isPublished,
        }),
      });
      if (!res.ok) {
        toast.error(adminErrorMessage(data, "Không lưu được."));
        return;
      }
      toast.success("Đã cập nhật.");
      const updated = data.document as { slug?: string } | undefined;
      if (updated?.slug) router.push(`/tai-lieu/${updated.slug}`);
      router.refresh();
    } catch {
      toast.error("Lỗi mạng.");
    }
  }

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ maxWidth: 640 }}>
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          File hiện tại:{" "}
          <LinkMui href={doc.fileUrl} target="_blank" rel="noreferrer">
            Mở PDF
          </LinkMui>
        </Typography>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Thay file PDF (tuỳ chọn)
          </Typography>
          <UploadButton
            endpoint="documentPdf"
            onClientUploadComplete={(res) => {
              const u = res[0]?.ufsUrl ?? res[0]?.url;
              if (u) setPdfUrl(u);
              toast.success("Đã upload PDF mới.");
            }}
            onUploadError={() => {
              toast.error("Upload thất bại.");
            }}
          />
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

        <TextField id="title" label="Tiêu đề" fullWidth {...form.register("title")} />
        <TextField
          id="description"
          label="Mô tả"
          fullWidth
          multiline
          minRows={3}
          {...form.register("description")}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="subject"
            control={form.control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel id="esub">Môn học</InputLabel>
                <Select labelId="esub" label="Môn học" {...field}>
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
              <FormControl fullWidth size="small">
                <InputLabel id="egr">Lớp</InputLabel>
                <Select
                  labelId="egr"
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
            <FormControl fullWidth size="small">
              <InputLabel id="ecat">Danh mục</InputLabel>
              <Select labelId="ecat" label="Danh mục" {...field}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <TextField id="tags" label="Tags" fullWidth {...form.register("tags")} />

        <Controller
          name="isPublished"
          control={form.control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} onChange={(_, c) => field.onChange(c)} />}
              label="Xuất bản"
            />
          )}
        />

        <Button type="submit" variant="contained" size="large" sx={{ alignSelf: "flex-start" }}>
          Cập nhật
        </Button>
      </Stack>
    </Box>
  );
}
