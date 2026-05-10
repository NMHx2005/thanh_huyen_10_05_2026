"use client";

import * as React from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";

type Props = {
  filters: React.ReactNode;
  children: React.ReactNode;
};

export function ListingFiltersLayout({ filters, children }: Props) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const filterPanel = (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      {filters}
    </Paper>
  );

  return (
    <Grid container spacing={3}>
      {isLgUp && (
        <Grid size={{ xs: 12, lg: 3 }}>
          <Box sx={{ position: "sticky", top: 88 }}>{filterPanel}</Box>
        </Grid>
      )}
      <Grid size={{ xs: 12, lg: isLgUp ? 9 : 12 }}>
        {!isLgUp && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Tooltip title="Bộ lọc">
                <IconButton
                  color="primary"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Mở bộ lọc"
                  sx={{ border: 1, borderColor: "divider" }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                Lọc theo danh mục, môn, lớp
              </Typography>
            </Box>
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              slotProps={{
                paper: { sx: { width: "min(100vw - 32px, 320px)", pt: 2 } },
              }}
            >
              <Box sx={{ px: 1 }}>{filterPanel}</Box>
            </Drawer>
          </>
        )}
        {children}
      </Grid>
    </Grid>
  );
}
