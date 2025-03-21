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
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../layout/PageHeader";

// Icons
import StorageIcon from "@mui/icons-material/Storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyIcon from "@mui/icons-material/Key";
import InfoIcon from "@mui/icons-material/Info";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`server-tabpanel-${index}`}
      aria-labelledby={`server-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ServerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);

  // Mock server data
  const server = {
    id: id,
    name: "Production Server",
    host: "sftp-prod.safetypin-oss.example.com",
    port: 22,
    username: "sftp-user",
    status: "Online",
    type: "SFTP",
    region: "us-east-1",
    storageUsed: 85,
    storageTotal: "10 GB",
    lastConnection: "10 minutes ago",
    created: "March 15, 2025",
    expires: "March 22, 2025",
    ipWhitelist: ["192.168.1.1", "10.0.0.0/24"],
    autoTerminate: true,
    strictHostKeyChecking: true,
  };

  // Mock transfer data
  const transfers = [
    {
      id: "tr-001",
      filename: "quarterly-report.pdf",
      direction: "upload",
      timestamp: "10 minutes ago",
      size: "4.2 MB",
      status: "Completed",
    },
    {
      id: "tr-002",
      filename: "client-data.csv",
      direction: "download",
      timestamp: "25 minutes ago",
      size: "1.8 MB",
      status: "Completed",
    },
    {
      id: "tr-003",
      filename: "system-backup.zip",
      direction: "upload",
      timestamp: "1 hour ago",
      size: "256.4 MB",
      status: "Completed",
    },
    {
      id: "tr-004",
      filename: "user-profiles.json",
      direction: "download",
      timestamp: "3 hours ago",
      size: "782 KB",
      status: "Failed",
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast or other notification
    console.log(`Copied to clipboard: ${text}`);
  };

  const handleDeleteServer = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    // In a real app, you would delete the server
    navigate("/servers");
  };

  const handleRenewServer = () => {
    setRenewDialogOpen(true);
  };

  const handleRenewConfirm = () => {
    setRenewDialogOpen(false);
    // In a real app, you would renew the server
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={server.name}
        breadcrumbs={[
          { text: "Home", href: "/" },
          { text: "Servers", href: "/servers" },
          { text: server.name },
        ]}
        action={{
          text: "Launch Web Client",
          icon: <OpenInNewIcon />,
          onClick: () => navigate(`/web-client/${id}`),
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="server tabs"
                sx={{ px: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="Connection Details" />
                <Tab label="Activity Log" />
                <Tab label="Settings" />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          bgcolor: "primary.light",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <StorageIcon sx={{ color: "white", fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5">{server.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {server.host}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Status
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={server.status}
                          color={server.status === "Online" ? "success" : "error"}
                        />
                        <Chip label={`Region: ${server.region}`} variant="outlined" />
                        <Chip label={server.type} color="primary" variant="outlined" />
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                      Storage Usage
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={server.storageUsed}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          {server.storageUsed}% of {server.storageTotal}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recent Activity
                      </Typography>
                      <Paper variant="outlined">
                        <List>
                          {transfers.slice(0, 5).map((transfer) => (
                            <ListItem key={transfer.id} divider>
                              <ListItemText
                                primary={transfer.filename}
                                secondary={`${transfer.timestamp} • ${transfer.size}`}
                              />
                              <ListItemSecondaryAction>
                                <Chip
                                  icon={
                                    transfer.direction === "upload" ? (
                                      <CloudUploadIcon fontSize="small" />
                                    ) : (
                                      <CloudDownloadIcon fontSize="small" />
                                    )
                                  }
                                  label={
                                    transfer.direction === "upload"
                                      ? "Upload"
                                      : "Download"
                                  }
                                  size="small"
                                  color={
                                    transfer.status === "Completed"
                                      ? "primary"
                                      : "error"
                                  }
                                  variant="outlined"
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardHeader title="Server Information" />
                      <Divider />
                      <CardContent>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Created"
                              secondary={server.created}
                            />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText
                              primary="Expires"
                              secondary={server.expires}
                            />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText
                              primary="Last Connection"
                              secondary={server.lastConnection}
                            />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText
                              primary="Auto-terminate"
                              secondary={
                                server.autoTerminate ? "Enabled" : "Disabled"
                              }
                            />
                          </ListItem>
                        </List>
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleRenewServer}
                            fullWidth
                          >
                            Renew Server
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteServer}
                            fullWidth
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </TabPanel>

            {/* Connection Details Tab */}
            <TabPanel value={tabValue} index={1}>
              <CardContent>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Share these connection details with your client to allow them
                    to connect to this SFTP server. The server will remain active
                    until {server.expires}.
                  </Typography>
                </Alert>

                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="Connection Information" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Host"
                          value={server.host}
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <IconButton
                                onClick={() => handleCopyText(server.host)}
                                edge="end"
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Port"
                          value={server.port}
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <IconButton
                                onClick={() => handleCopyText(server.port.toString())}
                                edge="end"
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Username"
                          value={server.username}
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <IconButton
                                onClick={() => handleCopyText(server.username)}
                                edge="end"
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<KeyIcon />}
                            onClick={() => {
                              // In a real app, this would download the private key
                              console.log("Download private key");
                            }}
                          >
                            Download SSH Private Key
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardHeader title="Connection Command" />
                  <Divider />
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      SFTP Command (for terminal/command line)
                    </Typography>
                    <TextField
                      value={`sftp -P ${server.port} ${server.username}@${server.host}`}
                      fullWidth
                      multiline
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              handleCopyText(
                                `sftp -P ${server.port} ${server.username}@${server.host}`
                              )
                            }
                            edge="end"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        ),
                      }}
                    />

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                      Connection Instructions
                    </Typography>
                    <Typography variant="body2">
                      1. Download the SSH private key above.
                    </Typography>
                    <Typography variant="body2">
                      2. Open your terminal or command line.
                    </Typography>
                    <Typography variant="body2">
                      3. Run the SFTP command above, or connect using your
                      preferred SFTP client.
                    </Typography>
                    <Typography variant="body2">
                      4. When prompted, provide the path to the SSH private key.
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{ mt: 3 }}
                      startIcon={<OpenInNewIcon />}
                      onClick={() => navigate(`/web-client/${id}`)}
                    >
                      Or Use Web Client
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </TabPanel>

            {/* Activity Log Tab */}
            <TabPanel value={tabValue} index={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  File Transfer Activity
                </Typography>
                <Paper variant="outlined">
                  <List>
                    {transfers.map((transfer) => (
                      <ListItem key={transfer.id} divider>
                        <ListItemText
                          primary={transfer.filename}
                          secondary={`${transfer.timestamp} • ${transfer.size}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            icon={
                              transfer.direction === "upload" ? (
                                <CloudUploadIcon fontSize="small" />
                              ) : (
                                <CloudDownloadIcon fontSize="small" />
                              )
                            }
                            label={
                              transfer.direction === "upload"
                                ? "Upload"
                                : "Download"
                            }
                            color={
                              transfer.status === "Completed"
                                ? "primary"
                                : "error"
                            }
                            variant="outlined"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </CardContent>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Server Settings
                </Typography>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader
                    title="Security Settings"
                    subheader="Configure security options for this server"
                  />
                  <Divider />
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        IP Whitelist
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Only the following IP addresses can connect to this server:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {server.ipWhitelist.map((ip) => (
                          <Chip key={ip} label={ip} />
                        ))}
                      </Box>
                      <Button size="small" startIcon={<EditIcon />} sx={{ mt: 2 }}>
                        Edit IP Whitelist
                      </Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Host Key Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Strict host key checking is{" "}
                        {server.strictHostKeyChecking ? "enabled" : "disabled"}.
                      </Typography>
                      <Button size="small" startIcon={<EditIcon />}>
                        Edit Host Key Settings
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardHeader
                    title="Lifecycle Settings"
                    subheader="Manage server expiration and lifecycle"
                  />
                  <Divider />
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Expiration
                      </Typography>
                      <Typography variant="body2">
                        This server will expire on {server.expires}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        sx={{ mt: 2 }}
                        onClick={handleRenewServer}
                      >
                        Renew Server
                      </Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Auto-terminate
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {server.autoTerminate
                          ? "Server will automatically terminate after file transfer completion."
                          : "Server will remain active until manually terminated or expired."}
                      </Typography>
                      <Button size="small" startIcon={<EditIcon />}>
                        Edit Auto-terminate Settings
                      </Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Delete Server
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Permanently delete this server and all associated data.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteServer}
                      >
                        Delete Server
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </CardContent>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Server</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this server? This action cannot be
            undone and all associated data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={renewDialogOpen} onClose={() => setRenewDialogOpen(false)}>
        <DialogTitle>Renew Server</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Extend the lifespan of this server. This will update the expiration date to 7 days from now.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenewConfirm} color="primary">
            Renew Server
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServerDetails;