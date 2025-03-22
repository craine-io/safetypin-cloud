import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Breadcrumbs, 
  Link, 
  useTheme, 
  alpha,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { text: string; href?: string }[];
  action?: {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  };
  showHelp?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle,
  breadcrumbs = [], 
  action,
  showHelp = false,
  showRefresh = false,
  onRefresh,
  children
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          sx={{ 
            mb: 1,
            "& .MuiBreadcrumbs-ol": {
              alignItems: "center",
            },
            "& .MuiBreadcrumbs-li": {
              display: "flex",
              alignItems: "center",
            }
          }}
          separator="/"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast || !crumb.href ? (
              <Typography
                key={crumb.text}
                color={isLast ? "text.primary" : "text.secondary"}
                variant="body2"
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  fontWeight: isLast ? 500 : 400 
                }}
              >
                {crumb.text}
              </Typography>
            ) : (
              <Link
                key={crumb.text}
                component={RouterLink}
                underline="hover"
                color="text.secondary"
                to={crumb.href}
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  fontSize: theme.typography.body2.fontSize,
                }}
              >
                {crumb.text}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Paper
        elevation={0}
        sx={{ 
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom={Boolean(subtitle)}
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center",
            ml: { xs: 0, md: 2 },
            flexShrink: 0,
          }}
        >
          {showRefresh && (
            <Tooltip title="Refresh">
              <IconButton 
                onClick={onRefresh}
                sx={{ 
                  mr: 1.5,
                  backgroundColor: "white",
                  boxShadow: `0px 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                  "&:hover": {
                    backgroundColor: "white",
                    boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {showHelp && (
            <Tooltip title="Help">
              <IconButton 
                sx={{ 
                  mr: action ? 1.5 : 0,
                  backgroundColor: "white",
                  boxShadow: `0px 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                  "&:hover": {
                    backgroundColor: "white",
                    boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  }
                }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {action && (
            <Button
              variant="contained"
              color="primary"
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{ 
                px: 2.5,
                py: 1,
                borderRadius: 2,
                boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                "&:hover": {
                  boxShadow: `0px 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                }
              }}
            >
              {action.text}
            </Button>
          )}
        </Box>
      </Paper>
      
      {children}
    </Box>
  );
};

export default PageHeader;