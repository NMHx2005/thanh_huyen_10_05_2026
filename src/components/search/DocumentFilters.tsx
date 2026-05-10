"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SUBJECT_OPTIONS } from "@/types";

const grades = Array.from({ length: 12 }, (_, i) => i + 1);

type CategoryOpt = { id: string; name: string; slug: string };

type Props = {
  categories: CategoryOpt[];
};

export function DocumentFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string | null) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value == null || value === "" || value === "all") p.delete(key);
      else p.set(key, value);
      p.delete("page");
      startTransition(() => {
        router.push(`/tai-lieu?${p.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <Stack spacing={2.5} sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Bộ lọc
      </Typography>
      <FormControl fullWidth size="medium" disabled={pending}>
        <InputLabel id="filter-category">Danh mục</InputLabel>
        <Select
          labelId="filter-category"
          label="Danh mục"
          value={searchParams.get("category") ?? "all"}
          onChange={(e) => update("category", e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.slug}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="medium" disabled={pending}>
        <InputLabel id="filter-subject">Môn học</InputLabel>
        <Select
          labelId="filter-subject"
          label="Môn học"
          value={searchParams.get("subject") ?? "all"}
          onChange={(e) => update("subject", e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {SUBJECT_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="medium" disabled={pending}>
        <InputLabel id="filter-grade">Lớp</InputLabel>
        <Select
          labelId="filter-grade"
          label="Lớp"
          value={searchParams.get("grade") ?? "all"}
          onChange={(e) => update("grade", e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {grades.map((g) => (
            <MenuItem key={g} value={String(g)}>
              Lớp {g}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="medium" disabled={pending}>
        <InputLabel id="filter-sort">Sắp xếp</InputLabel>
        <Select
          labelId="filter-sort"
          label="Sắp xếp"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="views">Nhiều xem nhất</MenuItem>
          <MenuItem value="downloads">Nhiều tải nhất</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
