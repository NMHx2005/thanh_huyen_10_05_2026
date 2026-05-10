"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const PAGE_W = 420;
const PAGE_H = 594;
const WINDOW = 2;

type FlipPageProps = {
  pageNumber: number;
  pageWidth: number;
  active: boolean;
};

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(function FlipPage(
  { pageNumber, pageWidth, active },
  ref,
) {
  return (
    <div ref={ref} style={{ display: "flex", height: "100%", width: "100%", overflow: "hidden", background: "#f4f4f5" }}>
      {active ? (
        <Page
          pageNumber={pageNumber}
          width={pageWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 480,
                width: "100%",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <CircularProgress size={22} />
              <Typography variant="body2">Trang {pageNumber}</Typography>
            </Box>
          }
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            minHeight: 480,
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            bgcolor: "#fafafa",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">Trang {pageNumber}</Typography>
          <Typography variant="caption">Lật tới đây để tải nội dung</Typography>
        </Box>
      )}
    </div>
  );
});

type Props = {
  fileUrl: string;
};

export function FlipbookViewer({ fileUrl }: Props) {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const basePageW = isNarrow ? 220 : isMedium ? 320 : PAGE_W;

  const bookRef = useRef<{ pageFlip?: () => { flipNext: () => void; flipPrev: () => void; turnToPage: (n: number) => void; getCurrentPageIndex: () => number } } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [jump, setJump] = useState("1");
  const [fs, setFs] = useState(false);
  const pageWidth = Math.round(basePageW * scale);

  const onFlip = useCallback((e: { data: number }) => {
    setCurrent(e.data);
  }, []);

  const pages = useMemo(() => {
    if (!numPages) return [];
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  const isActive = useCallback(
    (n: number) => {
      const idx = n - 1;
      return Math.abs(idx - current) <= WINDOW;
    },
    [current],
  );

  useEffect(() => {
    function onFsChange() {
      setFs(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function flipNext() {
    const api = bookRef.current && (bookRef.current as { pageFlip?: () => { flipNext: () => void } }).pageFlip?.();
    api?.flipNext();
  }

  function flipPrev() {
    const api = bookRef.current && (bookRef.current as { pageFlip?: () => { flipPrev: () => void } }).pageFlip?.();
    api?.flipPrev();
  }

  function goToPage() {
    const n = parseInt(jump, 10);
    if (Number.isNaN(n) || n < 1 || n > numPages) return;
    const api = bookRef.current && (bookRef.current as { pageFlip?: () => { turnToPage: (x: number) => void } }).pageFlip?.();
    api?.turnToPage(n - 1);
  }

  async function toggleFs() {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  return (
    <Paper
      ref={wrapRef}
      elevation={1}
      sx={{
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Document
        file={fileUrl}
        loading={
          <Box
            sx={{
              display: "flex",
              height: 520,
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              color: "text.secondary",
            }}
          >
            <CircularProgress />
            <Typography>Đang tải PDF…</Typography>
          </Box>
        }
        onLoadSuccess={(d) => setNumPages(d.numPages)}
        error={
          <Typography color="error" sx={{ p: 4, textAlign: "center" }}>
            Không mở được PDF.
          </Typography>
        }
      >
        {numPages > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              overflowX: "auto",
              maxWidth: "100%",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <HTMLFlipBook
              width={pageWidth}
              height={Math.round(PAGE_H * scale * (basePageW / PAGE_W))}
              size="stretch"
              minWidth={isNarrow ? 200 : 280}
              maxWidth={isNarrow ? 520 : 900}
              minHeight={isNarrow ? 320 : 400}
              maxHeight={isNarrow ? 900 : 1200}
              maxShadowOpacity={0.35}
              showCover={false}
              mobileScrollSupport
              className=""
              style={{}}
              ref={bookRef}
              onFlip={onFlip}
              drawShadow
              flippingTime={520}
              usePortrait
              startPage={0}
              startZIndex={0}
              autoSize
              clickEventForward
              useMouseEvents
              swipeDistance={24}
              showPageCorners
              disableFlipByClick={false}
            >
              {pages.map((n) => (
                <FlipPage
                  key={n}
                  pageNumber={n}
                  pageWidth={pageWidth}
                  active={isActive(n)}
                />
              ))}
            </HTMLFlipBook>
          </Box>
        )}
      </Document>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          borderTop: 1,
          borderColor: "divider",
          pt: 2,
          mt: 2,
          flexWrap: "wrap",
          alignItems: { sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <IconButton type="button" onClick={flipPrev} aria-label="Trang trước" size="small" color="inherit" sx={{ border: 1, borderColor: "divider" }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton type="button" onClick={flipNext} aria-label="Trang sau" size="small" color="inherit" sx={{ border: 1, borderColor: "divider" }}>
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Trang {current + 1} / {numPages || "—"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Button type="button" variant="outlined" size="small" onClick={() => setScale((s) => Math.max(0.75, s - 0.1))}>
            −
          </Button>
          <Button type="button" variant="outlined" size="small" onClick={() => setScale((s) => Math.min(1.35, s + 0.1))}>
            +
          </Button>
          <Button type="button" variant="outlined" size="small" onClick={toggleFs} startIcon={fs ? <FullscreenExitIcon /> : <FullscreenIcon />}>
            Toàn màn hình
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TextField
            size="small"
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            aria-label="Số trang"
            sx={{ width: 88 }}
          />
          <Button type="button" variant="contained" color="secondary" size="small" onClick={goToPage}>
            Đi tới
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
