import { createTheme } from "@mui/material/styles";

/** Cam chủ đạo kiểu hoc10 — chữ đen/trắng, nền sáng thoáng */
const orange = {
  main: "#F97316",
  dark: "#EA580C",
  light: "#FFEDD5",
  contrastText: "#FFFFFF",
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: orange,
    secondary: {
      main: "#0F172A",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    grey: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
    },
    divider: "rgba(15, 23, 42, 0.08)",
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  typography: {
    fontFamily: [
      "var(--font-sans)",
      '"Roboto"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
      fontWeight: 700,
    },
    body1: { lineHeight: 1.75 },
    body2: { lineHeight: 1.7 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    /** Tailwind preflight + CSS layers: spacing kiểu margin trên Stack dễ “chết”; gap ổn định hơn */
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          textRendering: "optimizeLegibility",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          paddingLeft: 20,
          paddingRight: 20,
        },
        sizeLarge: { paddingTop: 12, paddingBottom: 12, fontSize: "1rem" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.06)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 14 },
        elevation1: { boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          boxShadow: "0 1px 0 0 rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        sizeSmall: { fontSize: "0.75rem" },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        /*
          Cùng họ với ô tìm hero trang chủ: viền nhạt, hover cam, đổ bóng.
          Một dòng + Select: bo pill; multiline: bo góc lớn (spacing 3).
        */
        root: ({ theme, ownerState }) => {
          const shadow =
            "0 10px 40px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(249, 115, 22, 0.06)";
          const shadowHover =
            "0 12px 44px rgba(15, 23, 42, 0.1), 0 2px 12px rgba(249, 115, 22, 0.1)";
          const shadowFocus =
            "0 12px 48px rgba(249, 115, 22, 0.15)";
          const primary = theme.palette.primary.main;

          const fieldset = {
            "& fieldset": {
              borderColor: "rgba(15, 23, 42, 0.08)",
              borderWidth: 1,
            },
            "&:hover fieldset": {
              borderColor: "rgba(249, 115, 22, 0.45)",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 2,
              borderColor: primary,
            },
          };

          if (ownerState.multiline) {
            return {
              borderRadius: theme.spacing(3),
              backgroundColor: "#FFFFFF",
              boxShadow: shadow,
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
              "&:hover": { boxShadow: shadowHover },
              "&.Mui-focused": { boxShadow: shadowFocus },
              ...fieldset,
            };
          }

          return {
            borderRadius: "9999px",
            backgroundColor: "#FFFFFF",
            minHeight: 56,
            paddingLeft: theme.spacing(0.5),
            paddingRight: "6px",
            fontSize: "1.0625rem",
            alignItems: "center",
            boxShadow: shadow,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": { boxShadow: shadowHover },
            "&.Mui-focused": { boxShadow: shadowFocus },
            ...fieldset,
          };
        },
        input: ({ theme, ownerState }) => {
          const base = {
            boxSizing: "border-box" as const,
            color: theme.palette.text.primary,
            "&&::placeholder": {
              color: theme.palette.text.secondary,
              opacity: ownerState.multiline ? 1 : 0.85,
              fontWeight: ownerState.multiline ? 400 : 500,
            },
            "&&::-webkit-input-placeholder": {
              color: theme.palette.text.secondary,
              opacity: ownerState.multiline ? 1 : 0.85,
            },
            "&&:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
              WebkitTextFillColor: theme.palette.text.primary,
              caretColor: theme.palette.text.primary,
              borderRadius: "inherit",
            },
          };

          if (ownerState.multiline) {
            return {
              ...base,
              padding: `${theme.spacing(1.75)} ${theme.spacing(1.75)}`,
              fontSize: "1rem",
            };
          }

          return {
            ...base,
            paddingTop: "14px",
            paddingBottom: "14px",
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            fontSize: "1.0625rem",
          };
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "1rem" },
        shrink: { fontSize: "0.875rem" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "medium" },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(15, 23, 42, 0.08)" },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "max(16px, env(safe-area-inset-left))",
          paddingRight: "max(16px, env(safe-area-inset-right))",
        },
      },
    },
  },
});
