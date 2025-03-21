import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const LogoSvg: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      viewBox="0 0 400 600"
      {...props}
    >
      <path
        d="M240 80L240 250 L330 250 C360 320 330 400 240 450 L200 550 L160 450 C70 400 40 320 70 250 L160 250 L160 80 Z"
        fill="currentColor"
      />
      <circle cx="200" cy="320" r="45" stroke="white" strokeWidth="12" fill="currentColor" />
      <rect x="150" y="420" width="100" height="12" rx="6" fill="white" />
    </SvgIcon>
  );
};

export default LogoSvg;