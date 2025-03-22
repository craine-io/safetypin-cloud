import React from 'react';
import { Box } from '@mui/material';

interface LogoProps {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

const EmbeddedLogo: React.FC<LogoProps> = ({ size = 32, style, className }) => {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 600"
      sx={{
        width: size,
        height: size
      }}
      style={style}
      className={className}
    >
      <use xlinkHref="#safetypin-logo" />
    </Box>
  );
};

export default EmbeddedLogo;