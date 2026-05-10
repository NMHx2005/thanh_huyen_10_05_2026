import { Suspense } from "react";
import { SignInForm } from "./SignInForm";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 4, sm: 8 },
        background: "linear-gradient(160deg, #FFEDD5 0%, #FFF7ED 35%, #FFFFFF 70%)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Suspense
        fallback={
          <Skeleton variant="rounded" width="100%" sx={{ maxWidth: 440, height: 420 }} />
        }
      >
        <SignInForm />
      </Suspense>
    </Box>
  );
}
