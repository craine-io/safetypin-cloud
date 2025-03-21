import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import PageHeader from "../layout/PageHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isAlertNotificationsEnabled, setIsAlertNotificationsEnabled] = useState(true);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the password
    console.log("Password update submitted:", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowSuccess(true);
  };

  // Mock session data
  const sessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      ipAddress: "192.168.1.1",
      location: "New York, USA",
      lastActive: "Just now",
      current: true,
    },
    {
      id: 2,
      device: "Firefox on macOS",
      ipAddress: "192.168.1.2",
      location: "San Francisco, USA",
      lastActive: "2 days ago",
      current: false,
    },
    {
      id: 3,
      device: "Safari on iPhone",
      ipAddress: "192.168.1.3",
      location: "Chicago, USA",
      lastActive: "5 days ago",
      current: false,
    },
  ];

  const handleRevokeSession = (id: number) => {
    console.log("Revoking session:", id);
    // In a real app, this would revoke the session
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Security Settings"
        breadcrumbs={[{ text: "Home", href: "/" }, { text: "Security" }]}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Change Password" 
              subheader="Update your password to keep your account secure"
              avatar={<LockIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      helperText="Password must be at least 8 characters with a mix of letters, numbers, and symbols"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={newPassword !== confirmPassword && confirmPassword !== ""}
                      helperText={
                        newPassword !== confirmPassword && confirmPassword !== ""
                          ? "Passwords do not match"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Two-Factor Authentication" 
              subheader="Add an extra layer of security to your account"
              avatar={<SecurityIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Typography paragraph>
                Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={is2FAEnabled}
                    onChange={(e) => setIs2FAEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label={is2FAEnabled ? "Enabled" : "Disabled"}
              />
              {!is2FAEnabled && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, display: "block" }}
                  onClick={() => setIs2FAEnabled(true)}
                >
                  Enable 2FA
                </Button>
              )}
              {is2FAEnabled && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Two-factor authentication is enabled for your account.
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Security Notifications" 
              subheader="Manage your security alert settings"
              avatar={<VerifiedUserIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAlertNotificationsEnabled}
                    onChange={(e) => setIsAlertNotificationsEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label="Security alert notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Receive notifications about suspicious activities, login attempts, and security alerts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Active Sessions" 
              subheader="Manage all your active sessions and sign out from other devices"
            />
            <Divider />
            <CardContent>
              <List>
                {sessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography fontWeight={session.current ? "bold" : "regular"}>
                            {session.device} {session.current && "(Current)"}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              IP: {session.ipAddress} • Location: {session.location}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span" color="text.secondary">
                              Last active: {session.lastActive}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        {!session.current && (
                          <IconButton 
                            edge="end" 
                            aria-label="revoke" 
                            onClick={() => handleRevokeSession(session.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {session.id !== sessions.length && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => console.log("Sign out from all other devices")}
                >
                  Sign out from all other devices
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          variant="filled"
        >
          Password updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Security;