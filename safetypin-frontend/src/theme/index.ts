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
      main: "#E6E0FF", // Light lavender from the second image background
      light: "#F0EBFF",
      dark: "#C9BCFF",
      contrastText: "#2D1B69",
    },
    background: {
      default: "#F5F3FF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D1B69",
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
      fontWeight: 600,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
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
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(45, 27, 105, 0.2)",
          },
        },
        containedPrimary: {
          backgroundColor: "#2D1B69",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#4A3491",
          },
        },
        outlinedPrimary: {
          borderColor: "#2D1B69",
          color: "#2D1B69",
          "&:hover": {
            backgroundColor: "rgba(45, 27, 105, 0.08)",
          },
        },
        textPrimary: {
          color: "#2D1B69",
          "&:hover": {
            backgroundColor: "rgba(45, 27, 105, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(45, 27, 105, 0.15)",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
        elevation1: {
          boxShadow: "0px 4px 20px rgba(45, 27, 105, 0.15)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 10px rgba(45, 27, 105, 0.15)",
          backgroundColor: "#2D1B69",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E6E0FF",
          boxShadow: "4px 0px 20px rgba(45, 27, 105, 0.15)",
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
          "& label.Mui-focused": {
            color: "#2D1B69",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(45, 27, 105, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(45, 27, 105, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2D1B69",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(45, 27, 105, 0.12)",
        },
        head: {
          fontWeight: 600,
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
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(45, 27, 105, 0.08)",
        },
        deleteIcon: {
          color: "rgba(45, 27, 105, 0.7)",
          "&:hover": {
            color: "#2D1B69",
          },
        },
      },
    },
  },
});

export default theme;