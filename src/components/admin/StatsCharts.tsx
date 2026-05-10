"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

type Row = { date: string; views: number; downloads: number };

type Props = {
  chart: Row[];
};

export function StatsCharts({ chart }: Props) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  if (chart.length === 0) {
    return (
      <Paper variant="outlined" sx={{ borderStyle: "dashed", py: 6, px: 2, textAlign: "center", bgcolor: "action.hover" }}>
        <Typography variant="body2" color="text.secondary">
          Chưa có dữ liệu thống kê theo ngày. Lượt xem/tải sẽ được ghi khi người dùng truy cập.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ height: 320, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="views" name="Lượt xem (ngày)" stroke={primary} dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="downloads" name="Lượt tải (ngày)" stroke={secondary} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
