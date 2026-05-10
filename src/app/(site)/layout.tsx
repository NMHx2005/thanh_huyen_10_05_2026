import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column", bgcolor: "background.default" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, sm: 4, md: 5 },
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: "100%" }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
