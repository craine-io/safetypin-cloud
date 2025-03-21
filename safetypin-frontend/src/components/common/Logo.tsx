import React, { useState, useEffect } from 'react';
import { Box, BoxProps } from '@mui/material';
import LogoSvg from './LogoSvg';
import EmbeddedLogo from './EmbeddedLogo';

interface LogoProps extends BoxProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 32, sx, ...props }) => {
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tryEmbedded, setTryEmbedded] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(`${process.env.PUBLIC_URL}/logo.svg?v=${new Date().getTime()}`);

  useEffect(() => {
    // Check if the image loads properly
    const img = new Image();
    img.onload = () => setLoadStatus('success');
    img.onerror = () => {
      setLoadStatus('error');
      // Try a different approach using embedded SVG
      setTryEmbedded(true);
    };
    img.src = imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc]);

  // First fallback: Try the embedded SVG in the HTML
  if (loadStatus === 'error' && tryEmbedded) {
    return (
      <EmbeddedLogo
        size={size}
        sx={sx}
        {...props}
      />
    );
  }
  
  // Second fallback: Use the inline SVG component
  if (loadStatus === 'error') {
    return (
      <LogoSvg
        sx={{
          width: size,
          height: size,
          color: "#2D1B69",
          ...sx
        }}
        {...props}
      />
    );
  }

  return (
    <Box
      component="img"
      src={imageSrc}
      alt="SafetyPin OSS Logo"
      sx={{
        width: size,
        height: size,
        ...sx
      }}
      {...props}
    />
  );
};

export default Logo;