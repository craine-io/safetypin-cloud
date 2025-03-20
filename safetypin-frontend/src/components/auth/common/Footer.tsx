import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="https://safetypin.cloud">
            SafetyPin.cloud
          </Link>{' '}
          {new Date() .getFullYear()}
          {' | Secure SFTP as a Service'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="/terms">
            Terms of Service
          </Link>
          {' | '}
          <Link color="inherit" href="/privacy">
            Privacy Policy
          </Link>
          {' | '}
          <Link color="inherit" href="/contact">
            Contact Us
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
