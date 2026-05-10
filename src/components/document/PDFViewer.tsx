"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

type Props = {
  fileUrl: string;
};

export function PDFViewer({ fileUrl }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(800);

  return (
    <Box sx={{ width: "100%" }}>
      <Document
        file={fileUrl}
        loading={<Skeleton variant="rounded" sx={{ height: "70vh", width: "100%" }} />}
        onLoadSuccess={(d) => {
          setNumPages(d.numPages);
        }}
        error={<Typography color="error">Không mở được PDF.</Typography>}
      >
        <Box
          sx={{
            display: "flex",
            maxHeight: "75vh",
            width: "100%",
            justifyContent: "center",
            overflowY: "auto",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "action.hover",
            p: 2,
          }}
        >
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            {numPages > 0 &&
              Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  width={Math.min(width, typeof window !== "undefined" ? window.innerWidth - 48 : width)}
                  renderTextLayer={false}
                  className="shadow-md"
                />
              ))}
          </Stack>
        </Box>
      </Document>
      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "center", flexWrap: "wrap" }}>
        <Button type="button" variant="outlined" size="small" onClick={() => setWidth((w) => Math.max(320, w - 80))}>
          Thu nhỏ
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={() => setWidth((w) => Math.min(1200, w + 80))}>
          Phóng to
        </Button>
      </Stack>
    </Box>
  );
}
