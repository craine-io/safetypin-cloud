import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
  IconButton,
  Button,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../layout/PageHeader";

// Icons
import StorageIcon from "@mui/icons-material/Storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Servers",
      value: "12",
      icon: <StorageIcon fontSize="large" sx={{ color: "primary.main" }} />,
    },
    {
      title: "Files Uploaded",
      value: "1,284",
      icon: <CloudUploadIcon fontSize="large" sx={{ color: "info.main" }} />,
    },
    {
      title: "Files Downloaded",
      value: "842",
      icon: <CloudDownloadIcon fontSize="large" sx={{ color: "success.main" }} />,
    },
    {
      title: "Active Transfers",
      value: "5",
      icon: <CloudSyncIcon fontSize="large" sx={{ color: "warning.main" }} />,
    },
  ];

  const servers = [
    {
      id: "srv-001",
      name: "Production Server",
      status: "Online",
      storageUsed: 85,
    },
    {
      id: "srv-002",
      name: "Development Server",
      status: "Online",
      storageUsed: 42,
    },
    {
      id: "srv-003",
      name: "Testing Server",
      status: "Offline",
      storageUsed: 0,
    },
    {
      id: "srv-004",
      name: "Backup Server",
      status: "Online",
      storageUsed: 67,
    },
  ];

  const recentTransfers = [
    {
      id: "tr-001",
      filename: "quarterly-report.pdf",
      server: "Production Server",
      direction: "upload",
      timestamp: "10 minutes ago",
      size: "4.2 MB",
    },
    {
      id: "tr-002",
      filename: "client-data.csv",
      server: "Development Server",
      direction: "download",
      timestamp: "25 minutes ago",
      size: "1.8 MB",
    },
    {
      id: "tr-003",
      filename: "system-backup.zip",
      server: "Backup Server",
      direction: "upload",
      timestamp: "1 hour ago",
      size: "256.4 MB",
    },
    {
      id: "tr-004",
      filename: "user-profiles.json",
      server: "Production Server",
      direction: "download",
      timestamp: "3 hours ago",
      size: "782 KB",
    },
  ];

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Dashboard" 
        action={{
          text: "New Server",
          icon: <AddIcon />,
          onClick: () => console.log("New server clicked")
        }}
      />
      
      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" mt={1}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Servers Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Server Status"
              action={
                <Button 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => console.log("Add server")}
                >
                  Add Server
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                {servers.map((server) => (
                  <React.Fragment key={server.id}>
                    <ListItem>
                      <ListItemText
                        primary={server.name}
                        secondary={
                          <>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                              <Box sx={{ flexGrow: 1, mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={server.storageUsed}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: "grey.100",
                                    "& .MuiLinearProgress-bar": {
                                      borderRadius: 4,
                                    },
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {server.storageUsed}% used
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={server.status}
                          size="small"
                          color={server.status === "Online" ? "success" : "error"}
                          sx={{ mr: 1 }}
                        />
                        <IconButton edge="end" size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transfers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recent Transfers"
              action={
                <Button 
                  size="small" 
                  onClick={() => console.log("View all")}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                {recentTransfers.map((transfer) => (
                  <React.Fragment key={transfer.id}>
                    <ListItem>
                      <ListItemText
                        primary={transfer.filename}
                        secondary={
                          <>
                            <Typography variant="caption" component="span">
                              {transfer.server} • {transfer.timestamp} • {transfer.size}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={
                            transfer.direction === "upload" ? "Upload" : "Download"
                          }
                          size="small"
                          color={
                            transfer.direction === "upload" ? "primary" : "info"
                          }
                          icon={
                            transfer.direction === "upload" ? (
                              <CloudUploadIcon fontSize="small" />
                            ) : (
                              <CloudDownloadIcon fontSize="small" />
                            )
                          }
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;