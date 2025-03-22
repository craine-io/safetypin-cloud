import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2D1B69", // Deep purple from the logo
      light: "#4A3491",
      dark: "#1A0F3D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E6E0FF", // Light lavender
      light: "#F0EBFF",
      dark: "#C9BCFF",
      contrastText: "#2D1B69",
    },
    background: {
      default: "#F8F7FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A2E",
      secondary: "#534096",
    },
    divider: "rgba(45, 27, 105, 0.12)",
    error: {
      main: "#FF5252",
    },
    warning: {
      main: "#FFC107",
    },
    info: {
      main: "#64B5F6",
    },
    success: {
      main: "#4CAF50",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system", 
      "BlinkMacSystemFont", 
      "Segoe UI", 
      "Roboto", 
      "Helvetica Neue", 
      "Arial", 
      "sans-serif"
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#4A3491 #E6E0FF",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#E6E0FF",
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#4A3491",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#2D1B69",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#2D1B69",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#2D1B69",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          boxShadow: "none",
          fontSize: "0.9375rem",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0px 5px 10px rgba(45, 27, 105, 0.25)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2D1B69 0%, #4A3491 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #3D2B79 0%, #5A44A1 100%)",
          },
        },
        outlinedPrimary: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
            backgroundColor: "rgba(45, 27, 105, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 10px 30px rgba(45, 27, 105, 0.08)",
          border: "1px solid rgba(230, 224, 255, 0.8)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 15px 35px rgba(45, 27, 105, 0.12)",
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "24px 24px 8px 24px",
        },
        title: {
          fontSize: "1.25rem",
          fontWeight: 600,
        },
        subheader: {
          fontSize: "0.875rem",
          color: "#534096",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px 24px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0px 10px 30px rgba(45, 27, 105, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #2D1B69 0%, #4A3491 100%)",
          boxShadow: "0px 2px 10px rgba(45, 27, 105, 0.15)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E6E0FF",
          boxShadow: "4px 0px 20px rgba(45, 27, 105, 0.1)",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#2D1B69",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#4A3491",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "0.9375rem",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2D1B69",
              borderWidth: "2px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(45, 27, 105, 0.5)",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.9375rem",
            "&.Mui-focused": {
              color: "#2D1B69",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          height: "28px",
          fontSize: "0.8125rem",
        },
        filled: {
          "&.MuiChip-colorPrimary": {
            backgroundColor: "rgba(45, 27, 105, 0.1)",
            color: "#2D1B69",
          },
          "&.MuiChip-colorSuccess": {
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "#388E3C",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            color: "#D32F2F",
          },
          "&.MuiChip-colorWarning": {
            backgroundColor: "rgba(255, 193, 7, 0.1)",
            color: "#F57C00",
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: "rgba(100, 181, 246, 0.1)",
            color: "#1976D2",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "4px 0",
          "&.Mui-selected": {
            backgroundColor: "rgba(45, 27, 105, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(45, 27, 105, 0.12)",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(45, 27, 105, 0.04)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: "8px",
          borderRadius: "4px",
          backgroundColor: "rgba(230, 224, 255, 0.7)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#2D1B69",
          backgroundColor: "rgba(230, 224, 255, 0.3)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #2D1B69 0%, #4A3491 100%)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;