import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PageHeader from "../layout/PageHeader";

// Icons
import StorageIcon from "@mui/icons-material/Storage";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const ServerList: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock data for server list
  const servers = [
    {
      id: "srv-001",
      name: "Production Server",
      host: "prod.example.com",
      status: "Online",
      type: "SFTP",
      storageUsed: 85,
      lastConnection: "10 minutes ago",
    },
    {
      id: "srv-002",
      name: "Development Server",
      host: "dev.example.com",
      status: "Online",
      type: "SFTP",
      storageUsed: 42,
      lastConnection: "3 hours ago",
    },
    {
      id: "srv-003",
      name: "Testing Server",
      host: "test.example.com",
      status: "Offline",
      type: "SFTP",
      storageUsed: 0,
      lastConnection: "2 days ago",
    },
    {
      id: "srv-004",
      name: "Backup Server",
      host: "backup.example.com",
      status: "Online",
      type: "SFTP",
      storageUsed: 67,
      lastConnection: "5 hours ago",
    },
    {
      id: "srv-005",
      name: "Archive Server",
      host: "archive.example.com",
      status: "Maintenance",
      type: "SFTP",
      storageUsed: 92,
      lastConnection: "1 week ago",
    },
    {
      id: "srv-006",
      name: "Client Data Server",
      host: "clients.example.com",
      status: "Online",
      type: "SFTP",
      storageUsed: 23,
      lastConnection: "Just now",
    },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, serverId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedServer(serverId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedServer(null);
  };

  const handleServerDetails = (serverId: string) => {
    navigate(`/servers/${serverId}`);
  };

  const handleWebClient = (serverId: string) => {
    navigate(`/web-client/${serverId}`);
    handleMenuClose();
  };

  const handleEdit = (serverId: string) => {
    navigate(`/servers/${serverId}`);
    handleMenuClose();
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Servers"
        breadcrumbs={[{ text: "Home", href: "/" }, { text: "Servers" }]}
        action={{
          text: "New Server",
          icon: <AddIcon />,
          onClick: () => navigate("/servers/new"),
        }}
      />

      <Grid container spacing={3}>
        {servers.map((server) => (
          <Grid item xs={12} sm={6} md={4} key={server.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, server.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                    }}
                  >
                    <StorageIcon sx={{ color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h2" noWrap>
                      {server.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {server.host}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={server.status}
                    size="small"
                    color={
                      server.status === "Online"
                        ? "success"
                        : server.status === "Offline"
                        ? "error"
                        : "warning"
                    }
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={server.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Typography variant="body2" sx={{ mt: 2, mb: 0.5 }}>
                  Storage Usage
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={server.storageUsed}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "grey.100",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {server.storageUsed}%
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2 }}
                >
                  Last connection: {server.lastConnection}
                </Typography>
              </CardContent>

              <Divider />

              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleServerDetails(server.id)}
                >
                  Server Details
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleWebClient(server.id)}
                >
                  Launch Web Client
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Server Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1,
            borderRadius: 2,
            minWidth: 180,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleWebClient(selectedServer || "")}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          Launch Web Client
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedServer || "")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Server
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteOpen} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Server
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Server</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this server? This action cannot be
            undone and all associated data will be permanently lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteClose} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServerList;