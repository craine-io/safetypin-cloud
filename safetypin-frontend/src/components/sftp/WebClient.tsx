import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  TextField,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PageHeader from "../layout/PageHeader";

// Icons 
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

interface FileItem {
  name: string;
  type: "file" | "directory";
  size?: string;
  lastModified?: string;
  permissions?: string;
}

const WebClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);

  // Mock server data
  const server = {
    id: id,
    name: "Production Server",
    host: "sftp-prod.example.com",
  };

  // Mock files data
  const files: FileItem[] = [
    {
      name: "documents",
      type: "directory",
      lastModified: "Mar 15, 2025 12:34 PM",
      permissions: "drwxr-xr-x",
    },
    {
      name: "images",
      type: "directory",
      lastModified: "Mar 10, 2025 09:12 AM",
      permissions: "drwxr-xr-x",
    },
    {
      name: "reports",
      type: "directory",
      lastModified: "Mar 18, 2025 03:45 PM",
      permissions: "drwxr-xr-x",
    },
    {
      name: "readme.txt",
      type: "file",
      size: "2.5 KB",
      lastModified: "Mar 05, 2025 11:22 AM",
      permissions: "-rw-r--r--",
    },
    {
      name: "data.csv",
      type: "file",
      size: "1.2 MB",
      lastModified: "Mar 17, 2025 02:30 PM",
      permissions: "-rw-r--r--",
    },
    {
      name: "config.json",
      type: "file",
      size: "4.7 KB",
      lastModified: "Mar 14, 2025 08:15 AM",
      permissions: "-rw-r--r--",
    },
  ];

  const handleFileClick = (file: FileItem) => {
    if (file.type === "directory") {
      // Navigate into the directory
      setCurrentPath((prev) => 
        prev === "/" ? `/${file.name}` : `${prev}/${file.name}`
      );
    } else {
      // Select/deselect the file
      const isSelected = selectedFiles.some((f) => f.name === file.name);
      if (isSelected) {
        setSelectedFiles((prev) => prev.filter((f) => f.name !== file.name));
      } else {
        setSelectedFiles((prev) => [...prev, file]);
      }
    }
  };

  const handleNavigateUp = () => {
    if (currentPath === "/") return;
    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.pop();
    setCurrentPath(pathParts.length === 0 ? "/" : `/${pathParts.join("/")}`);
  };

  const handleCreateFolder = () => {
    setNewFolderDialogOpen(true);
  };

  const handleNewFolderConfirm = () => {
    // In a real app, this would create a new folder
    console.log(`Creating folder: ${newFolderName} in ${currentPath}`);
    setNewFolderDialogOpen(false);
    setNewFolderName("");
  };

  const handleUploadFiles = () => {
    // In a real app, this would open a file picker
    console.log("Uploading files...");
  };

  const handleDownloadSelected = () => {
    // In a real app, this would download selected files
    console.log("Downloading files:", selectedFiles);
  };

  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      // In a real app, this would delete the file
      console.log(`Deleting: ${fileToDelete.name}`);
    }
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const handleRefresh = () => {
    // In a real app, this would refresh the file list
    console.log("Refreshing files...");
  };

  const renderBreadcrumbs = () => {
    const pathParts = currentPath === "/" ? [] : currentPath.split("/").filter(Boolean);
    
    return (
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component="button" 
          variant="body2" 
          onClick={() => setCurrentPath("/")}
          underline="hover"
          color={currentPath === "/" ? "text.primary" : "inherit"}
        >
          root
        </Link>
        
        {pathParts.map((part, index) => {
          const path = `/${pathParts.slice(0, index + 1).join("/")}`;
          const isLast = index === pathParts.length - 1;
          
          return isLast ? (
            <Typography key={path} color="text.primary">
              {part}
            </Typography>
          ) : (
            <Link
              key={path}
              component="button"
              variant="body2"
              onClick={() => setCurrentPath(path)}
              underline="hover"
            >
              {part}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={`Web Client - ${server.name}`}
        breadcrumbs={[
          { text: "Home", href: "/" },
          { text: "Servers", href: "/servers" },
          { text: server.name, href: `/servers/${id}` },
          { text: "Web Client" },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="File Explorer"
              subheader={`Connected to ${server.host}`}
              action={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Navigate Up">
                    <span>
                      <IconButton 
                        onClick={handleNavigateUp} 
                        disabled={currentPath === "/"}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                {renderBreadcrumbs()}
              </Box>
              
              <Box sx={{ display: "flex", mb: 3, gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CreateNewFolderIcon />}
                  onClick={handleCreateFolder}
                >
                  New Folder
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUploadFiles}
                >
                  Upload Files
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  disabled={selectedFiles.length === 0}
                  onClick={handleDownloadSelected}
                >
                  Download Selected
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Last Modified</TableCell>
                      <TableCell>Permissions</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((file) => {
                      const isSelected = selectedFiles.some((f) => f.name === file.name);
                      
                      return (
                        <TableRow
                          key={file.name}
                          sx={{
                            "&:hover": { bgcolor: "action.hover" },
                            bgcolor: isSelected ? "action.selected" : "inherit",
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() => handleFileClick(file)}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                {file.type === "directory" ? (
                                  <FolderIcon color="primary" />
                                ) : (
                                  <InsertDriveFileIcon color="info" />
                                )}
                              </ListItemIcon>
                              <Typography>{file.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={file.type === "directory" ? "Folder" : "File"}
                              size="small"
                              color={file.type === "directory" ? "primary" : "default"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{file.size || "-"}</TableCell>
                          <TableCell>{file.lastModified}</TableCell>
                          <TableCell>
                            <Typography fontFamily="monospace" fontSize="small">
                              {file.permissions}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {file.type === "file" && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(file)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {file.type === "file" && (
                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    // In a real app, this would download the file
                                    console.log(`Downloading: ${file.name}`);
                                  }}
                                >
                                  <CloudDownloadIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onClose={() => setNewFolderDialogOpen(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for the new folder. The folder will be created in the current directory: {currentPath}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleNewFolderConfirm} 
            disabled={!newFolderName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {fileToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WebClient;