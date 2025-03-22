import React from 'react';
import { Box } from '@mui/material';

interface LogoSvgProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const LogoSvg: React.FC<LogoSvgProps> = ({ width = 24, height = 24, color = 'currentColor', ...props }) => {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 600"
      sx={{
        width,
        height,
        display: 'inline-block',
        flexShrink: 0,
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      }}
      {...props}
    >
      <path
        d="M240 80L240 250 L330 250 C360 320 330 400 240 450 L200 550 L160 450 C70 400 40 320 70 250 L160 250 L160 80 Z"
        fill={color}
      />
      <circle cx="200" cy="320" r="45" stroke="white" strokeWidth="12" fill={color} />
      <rect x="150" y="420" width="100" height="12" rx="6" fill="white" />
    </Box>
  );
};

export default LogoSvg;