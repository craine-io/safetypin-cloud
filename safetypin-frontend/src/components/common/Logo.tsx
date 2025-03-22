import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import LogoSvg from './LogoSvg';
import EmbeddedLogo from './EmbeddedLogo';

interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ size = 32, color, className, style }) => {
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
        style={style}
        className={className}
      />
    );
  }
  
  // Second fallback: Use the inline SVG component
  if (loadStatus === 'error') {
    return (
      <LogoSvg
        width={size}
        height={size}
        color={color}
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
        height: size
      }}
      style={style}
      className={className}
    />
  );
};

export default Logo;