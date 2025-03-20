import React from "react";
import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: { text: string; href?: string }[];
  action?: {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  breadcrumbs = [], 
  action 
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast || !crumb.href ? (
              <Typography
                key={crumb.text}
                color={isLast ? "text.primary" : "text.secondary"}
              >
                {crumb.text}
              </Typography>
            ) : (
              <Link
                key={crumb.text}
                component={RouterLink}
                underline="hover"
                color="inherit"
                to={crumb.href}
              >
                {crumb.text}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
        
        {action && (
          <Button
            variant="contained"
            color="primary"
            startIcon={action.icon}
            onClick={action.onClick}
          >
            {action.text}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;