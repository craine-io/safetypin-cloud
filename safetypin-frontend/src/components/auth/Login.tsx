import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  useTheme,
  alpha,
  Grid,
  Card,
} from "@mui/material";
import { useAuth } from "./AuthContext";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would authenticate with AWS Cognito
      // For our mock implementation, use any email with password "password"
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Left side - Brand info */}
          <Grid item xs={12} md={6} lg={7} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ p: 4 }}>
              <Box sx={{ mb: 6, display: "flex", alignItems: "center" }}>
                <svg 
                  width="52" 
                  height="52" 
                  viewBox="0 0 400 600" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: '16px' }}
                >
                  <path
                    d="M240 80L240 250 L330 250 C360 320 330 400 240 450 L200 550 L160 450 C70 400 40 320 70 250 L160 250 L160 80 Z"
                    fill="#2D1B69"
                  />
                  <circle cx="200" cy="320" r="45" stroke="white" strokeWidth="12" fill="#2D1B69" />
                  <rect x="150" y="420" width="100" height="12" rx="6" fill="white" />
                </svg>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  SafetyPin OSS
                </Typography>
              </Box>

              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Secure file transfers made simple
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                Connect your S3 buckets with ephemeral SFTP servers. No infrastructure maintenance, just secure file transfers.
              </Typography>

              <Box 
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 6
                }}
              >
                <Chip 
                  label="Secure connections" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.dark,
                    fontWeight: 500,
                    px: 1
                  }} 
                />
                <Chip 
                  label="Time-limited access" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    px: 1
                  }} 
                />
                <Chip 
                  label="IP whitelist" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                    fontWeight: 500,
                    px: 1
                  }} 
                />
                <Chip 
                  label="S3 integration" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.dark,
                    fontWeight: 500,
                    px: 1
                  }} 
                />
              </Box>

              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: `0px 10px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <InfoOutlinedIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Demo Account Information
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  You can use any email address with the password <code>password</code> to log in to the demo.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore the full potential of SafetyPin OSS without any setup.
                </Typography>
              </Card>
            </Box>
          </Grid>

          {/* Right side - Login form */}
          <Grid item xs={12} sm={10} md={6} lg={5}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: `0px 15px 35px ${alpha(theme.palette.primary.main, 0.15)}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "background.paper",
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <LockOutlinedIcon sx={{ color: "primary.main", fontSize: 28 }} />
                </Box>
                <Typography component="h1" variant="h4" fontWeight="bold" mb={1}>
                  Log In
                </Typography>
                <Typography color="text.secondary" variant="body1" align="center" mb={3}>
                  Enter your credentials to access your account
                </Typography>
                
                {/* Demo mode indicator - mobile only */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', mb: 3 }}>
                  <Card
                    sx={{
                      p: 2,
                      width: '100%',
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: `1px solid ${alpha(theme.palette.divider, 0.8)}`
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Demo Account
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Use any email with password <code>password</code>
                    </Typography>
                  </Card>
                </Box>

                <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: "100%" }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2.5 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 3,
                    }}
                  >
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      variant="body2"
                      underline="hover"
                      sx={{ fontWeight: 500 }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      mb: 3, 
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: `0px 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0px 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      }
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        size="large"
                        startIcon={<GoogleIcon />}
                        sx={{ 
                          py: 1.25,
                          borderColor: alpha(theme.palette.grey[400], 0.5),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.grey[100], 0.5),
                            borderColor: theme.palette.grey[400],
                          }
                        }}
                      >
                        Google
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        size="large"
                        startIcon={<GitHubIcon />}
                        sx={{ 
                          py: 1.25,
                          borderColor: alpha(theme.palette.grey[400], 0.5),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.grey[100], 0.5),
                            borderColor: theme.palette.grey[400],
                          }
                        }}
                      >
                        GitHub
                      </Button>
                    </Grid>
                  </Grid>
                  
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Don't have an account?{" "}
                      <Link
                        component={RouterLink}
                        to="/register"
                        variant="body1"
                        fontWeight="bold"
                        underline="hover"
                        color="primary"
                      >
                        Sign Up
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
          sx={{ 
            boxShadow: 4,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;