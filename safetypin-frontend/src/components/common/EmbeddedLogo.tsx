import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface LogoProps extends BoxProps {
  size?: number;
}

const EmbeddedLogo: React.FC<LogoProps> = ({ size = 32, sx, ...props }) => {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 600"
      sx={{
        width: size,
        height: size,
        ...sx
      }}
      {...props}
    >
      <use xlinkHref="#safetypin-logo" />
    </Box>
  );
};

export default EmbeddedLogo;