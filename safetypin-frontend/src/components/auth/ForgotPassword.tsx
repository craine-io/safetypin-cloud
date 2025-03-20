import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const steps = ['Request Code', 'Reset Password'];

const ForgotPassword: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword, forgotPasswordSubmit } = useAuth();
  const navigate = useNavigate();

  const handleNext = async () => {
    if (activeStep === 0) {
      setError('');
      setLoading(true);

      try {
        await forgotPassword(email);
        setActiveStep(1);
      } catch (err: any) {
        setError(err.message || 'Failed to request password reset');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setError('');
      setLoading(true);

      try {
        await forgotPasswordSubmit(email, code, newPassword);
        navigate('/login');
      } catch (err: any) {
        setError(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <LockResetIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 3, width: '100%' }}>
            {activeStep === 0 ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Enter your email address and we'll send you a code to reset your password.
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Enter the verification code sent to your email and your new password.
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    id="code"
                    label="Verification Code"
                    name="code"
                    margin="normal"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    id="newPassword"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && !email) || (activeStep === 1 && (!code || !newPassword || !confirmPassword))}
              >
                {loading
                  ? 'Processing...'
                  : activeStep === 0
                  ? 'Send Code'
                  : 'Reset Password'}
              </Button>
            </Box>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Remember your password? Sign in
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
