import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import LinkMui from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  since.setUTCHours(0, 0, 0, 0);

  const [
    totalDocuments,
    totalViewsAgg,
    totalDownloadsAgg,
    newUsers,
    recentDocs,
    chartRows,
  ] = await prisma.$transaction([
    prisma.document.count(),
    prisma.document.aggregate({ _sum: { viewCount: true } }),
    prisma.document.aggregate({ _sum: { downloadCount: true } }),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.analyticsDaily.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    }),
  ]);

  const chart = chartRows.map((r) => ({
    date: r.date.toISOString().slice(0, 10),
    views: r.views,
    downloads: r.downloads,
  }));

  const kpi = [
    { label: "Tài liệu", value: totalDocuments },
    { label: "Tổng lượt xem", value: totalViewsAgg._sum.viewCount ?? 0 },
    { label: "Tổng lượt tải", value: totalDownloadsAgg._sum.downloadCount ?? 0 },
    { label: "User mới (30 ngày)", value: newUsers },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Quản trị
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Tổng quan tài liệu và lưu lượng.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {kpi.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
              <CardHeader title={item.label} titleTypographyProps={{ variant: "body2", color: "text.secondary" }} />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 800 }}>
                  {item.value.toLocaleString("vi-VN")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardHeader
          title="Lượt xem / tải theo ngày"
          subheader="30 ngày gần nhất (từ bảng AnalyticsDaily)"
          subheaderTypographyProps={{ variant: "body2" }}
        />
        <CardContent>
          <StatsCharts chart={chart} />
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardHeader
          title="Tài liệu mới"
          action={
            <LinkMui component={Link} href="/admin/tai-lieu" sx={{ fontWeight: 600 }}>
              Xem tất cả
            </LinkMui>
          }
        />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentDocs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <LinkMui component={Link} href={`/admin/tai-lieu/${d.id}/chinh-sua`}>
                        {d.title}
                      </LinkMui>
                    </TableCell>
                    <TableCell>{d.category?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={d.isPublished ? "Đã xuất bản" : "Nháp"}
                        color={d.isPublished ? "primary" : "default"}
                        variant={d.isPublished ? "filled" : "outlined"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
