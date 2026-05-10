"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

type Props = {
  className?: string;
  defaultValue?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  /** Ô tìm lớn, bo tròn, nút tìm nổi — dùng ở hero trang chủ */
  variant?: "default" | "hero";
};

export function SearchBar({
  className,
  defaultValue = "",
  size = "small",
  fullWidth = true,
  variant = "default",
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  const submit = () => {
    const trimmed = q.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.push(qs ? `/tai-lieu?${qs}` : "/tai-lieu");
  };

  const isHero = variant === "hero";

  return (
    <Box
      component="form"
      className={className}
      sx={{ width: fullWidth ? "100%" : undefined }}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <TextField
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm tài liệu, môn học, chủ đề…"
        aria-label="Tìm kiếm"
        size={isHero ? "medium" : size}
        fullWidth={fullWidth}
        variant="outlined"
        hiddenLabel
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  ml: isHero ? 1.25 : 0,
                  mr: isHero ? 0 : undefined,
                }}
              >
                {isHero ? (
                  <SearchIcon sx={{ fontSize: 26, color: "primary.main" }} />
                ) : (
                  <SearchIcon color="action" fontSize="small" />
                )}
              </InputAdornment>
            ),
            ...(isHero
              ? {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ ml: 0, mr: 0 }}>
                      <IconButton
                        type="submit"
                        aria-label="Tìm kiếm"
                        sx={{
                          width: 46,
                          height: 46,
                          bgcolor: "primary.main",
                          color: "#fff",
                          boxShadow: "0 4px 14px rgba(249, 115, 22, 0.45)",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        }}
                      >
                        <SearchIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : {}),
          },
        }}
      />
    </Box>
  );
}
