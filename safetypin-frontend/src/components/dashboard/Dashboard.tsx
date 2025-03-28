import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import EditIcon from '@mui/icons-material/Edit';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
// Icons
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useServers } from '../../hooks/useServers';
import { useAuth } from '../auth/AuthContext';
import PageHeader from '../layout/PageHeader';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  // Use the servers hook to fetch servers from API
  const {
    servers: apiServers,
    loading: serversLoading,
    error: serversError,
    fetchServers,
  } = useServers();

  // Fetch servers when component mounts
  useEffect(() => {
    fetchServers();
    console.log('Fetching servers for dashboard from API');
  }, [fetchServers]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, serverId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedServerId(serverId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedServerId(null);
  };

  // Mock data for the dashboard stats (will be replaced with real API data in future)
  const stats = [
    {
      title: 'Total Servers',
      value: '12',
      change: '+3',
      changePercent: '+33%',
      trend: 'up',
      icon: <StorageIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Files Uploaded',
      value: '1,284',
      change: '+128',
      changePercent: '+11%',
      trend: 'up',
      icon: <CloudUploadIcon />,
      color: theme.palette.info.main,
    },
    {
      title: 'Files Downloaded',
      value: '842',
      change: '-21',
      changePercent: '-2.4%',
      trend: 'down',
      icon: <CloudDownloadIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Active Transfers',
      value: '5',
      change: '+2',
      changePercent: '+66%',
      trend: 'up',
      icon: <CloudSyncIcon />,
      color: theme.palette.warning.main,
    },
  ];

  // Use servers data from API or fallback to empty array
  const servers = apiServers || [];

  const recentTransfers = [
    {
      id: 'tr-001',
      filename: 'quarterly-report.pdf',
      server: 'Production Server',
      serverId: 'srv-001',
      direction: 'upload',
      timestamp: '10 minutes ago',
      size: '4.2 MB',
      user: 'john.doe@example.com',
    },
    {
      id: 'tr-002',
      filename: 'client-data.csv',
      server: 'Development Server',
      serverId: 'srv-002',
      direction: 'download',
      timestamp: '25 minutes ago',
      size: '1.8 MB',
      user: 'jane.smith@example.com',
    },
    {
      id: 'tr-003',
      filename: 'system-backup.zip',
      server: 'Backup Server',
      serverId: 'srv-004',
      direction: 'upload',
      timestamp: '1 hour ago',
      size: '256.4 MB',
      user: 'admin@example.com',
    },
    {
      id: 'tr-004',
      filename: 'user-profiles.json',
      server: 'Production Server',
      serverId: 'srv-001',
      direction: 'download',
      timestamp: '3 hours ago',
      size: '782 KB',
      user: 'john.doe@example.com',
    },
  ];

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor your SFTP servers and file transfers"
        action={{
          text: 'New Server',
          icon: <AddIcon />,
          onClick: () => navigate('/servers/new'),
        }}
        showRefresh
        onRefresh={() => console.log('Refreshed dashboard')}
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: `0px 8px 24px ${alpha(stat.color, 0.15)}`,
                  transform: 'translateY(-5px)',
                  borderColor: alpha(stat.color, 0.5),
                },
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: alpha(stat.color, 0.1),
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight="bold" mb={0.5}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {stat.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  icon={
                    stat.trend === 'up' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  }
                  label={stat.changePercent}
                  size="small"
                  sx={{
                    bgcolor: alpha(
                      stat.trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
                      0.1
                    ),
                    color:
                      stat.trend === 'up' ? theme.palette.success.dark : theme.palette.error.dark,
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" ml={1}>
                  vs last month
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Servers Status */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              height: '100%',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                SFTP Servers
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate('/servers/new')}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Add Server
              </Button>
            </Box>
            <Divider />
            <Box sx={{ overflow: 'auto', maxHeight: { xs: 400, md: 500 } }}>
              {serversLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Loading servers...
                  </Typography>
                </Box>
              ) : serversError ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="error">
                    {serversError}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={fetchServers}
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2 }}
                  >
                    Retry
                  </Button>
                </Box>
              ) : servers.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No servers configured yet. Create your first SFTP server.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/servers/new')}
                    sx={{ mt: 2 }}
                  >
                    New Server
                  </Button>
                </Box>
              ) : (
                <List sx={{ py: 0 }}>
                  {servers.map(server => (
                    <React.Fragment key={server.id}>
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                              }}
                            >
                              <StorageIcon />
                            </Avatar>
                          </Grid>
                          <Grid item xs={12} sm container>
                            <Grid item xs={12} sm={5} md={4}>
                              <Typography variant="subtitle1" fontWeight={600} noWrap>
                                {server.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {server.host}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PublicIcon
                                  sx={{
                                    fontSize: 14,
                                    mr: 0.5,
                                    color: 'text.secondary',
                                  }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {server.region || 'No region'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon
                                  sx={{
                                    fontSize: 14,
                                    mr: 0.5,
                                    color: 'text.secondary',
                                  }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {server.expiryTime
                                    ? `Expires: ${new Date(server.expiryTime).toLocaleDateString()}`
                                    : 'No expiry'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={4} md={5}>
                              <Box sx={{ mt: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ flexGrow: 1, mr: 1 }}
                                  >
                                    Storage: {server.storageUsed}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={server.storageUsed}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    mb: 0.5,
                                    backgroundColor: alpha(theme.palette.grey[300], 0.5),
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor:
                                        server.storageUsed > 90
                                          ? theme.palette.error.main
                                          : server.storageUsed > 70
                                          ? theme.palette.warning.main
                                          : theme.palette.success.main,
                                    },
                                  }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Chip
                                    label={server.status}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.7rem',
                                      bgcolor:
                                        server.status === 'Online'
                                          ? alpha(theme.palette.success.main, 0.1)
                                          : alpha(theme.palette.error.main, 0.1),
                                      color:
                                        server.status === 'Online'
                                          ? theme.palette.success.dark
                                          : theme.palette.error.dark,
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    Last active: {server.lastConnection}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <IconButton
                              edge="end"
                              onClick={e => handleMenuClick(e, server.id)}
                              size="small"
                              sx={{
                                color: 'text.secondary',
                                bgcolor: alpha(theme.palette.grey[500], 0.08),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.grey[500], 0.15),
                                },
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                color="primary"
                onClick={() => navigate('/servers')}
                endIcon={<VisibilityIcon />}
                sx={{ textTransform: 'none' }}
              >
                View All Servers
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Transfers */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Transfers
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {recentTransfers.map(transfer => (
                  <ListItem
                    key={transfer.id}
                    alignItems="flex-start"
                    sx={{
                      px: 3,
                      py: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          bgcolor:
                            transfer.direction === 'upload'
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.info.main, 0.1),
                          color:
                            transfer.direction === 'upload'
                              ? theme.palette.primary.main
                              : theme.palette.info.main,
                        }}
                      >
                        {transfer.direction === 'upload' ? (
                          <CloudUploadIcon fontSize="small" />
                        ) : (
                          <CloudDownloadIcon fontSize="small" />
                        )}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                          {transfer.filename}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Chip
                            label={transfer.direction === 'upload' ? 'Uploaded' : 'Downloaded'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor:
                                transfer.direction === 'upload'
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : alpha(theme.palette.info.main, 0.1),
                              color:
                                transfer.direction === 'upload'
                                  ? theme.palette.primary.main
                                  : theme.palette.info.main,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {transfer.size}
                          </Typography>
                        </Stack>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Typography
                            variant="body2"
                            component="span"
                            color="text.secondary"
                            noWrap
                          >
                            {transfer.server}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            color="text.secondary"
                            sx={{ mx: 0.5 }}
                          >
                            •
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            color="text.secondary"
                            noWrap
                          >
                            {transfer.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Divider />
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Button color="primary" endIcon={<VisibilityIcon />} sx={{ textTransform: 'none' }}>
                View All Transfers
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/servers/new')}
                  sx={{
                    p: 2,
                    flexDirection: 'column',
                    borderRadius: 3,
                    textTransform: 'none',
                    height: '100%',
                    borderWidth: '2px',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <Box sx={{ fontSize: '1.75rem', color: 'primary.main', mb: 1 }}>
                    <StorageIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="body1" fontWeight={500}>
                    New Server
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SecurityIcon />}
                  onClick={() => navigate('/security')}
                  sx={{
                    p: 2,
                    flexDirection: 'column',
                    borderRadius: 3,
                    textTransform: 'none',
                    height: '100%',
                    borderWidth: '2px',
                    borderColor: alpha(theme.palette.info.main, 0.3),
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: theme.palette.info.main,
                      bgcolor: alpha(theme.palette.info.main, 0.03),
                    },
                  }}
                >
                  <Box sx={{ fontSize: '1.75rem', color: 'info.main', mb: 1 }}>
                    <SecurityIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="body1" fontWeight={500}>
                    Security
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FolderOpenIcon />}
                  sx={{
                    p: 2,
                    flexDirection: 'column',
                    borderRadius: 3,
                    textTransform: 'none',
                    height: '100%',
                    borderWidth: '2px',
                    borderColor: alpha(theme.palette.warning.main, 0.3),
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: theme.palette.warning.main,
                      bgcolor: alpha(theme.palette.warning.main, 0.03),
                    },
                  }}
                >
                  <Box sx={{ fontSize: '1.75rem', color: 'warning.main', mb: 1 }}>
                    <FolderOpenIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="body1" fontWeight={500}>
                    File Browser
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<BarChartIcon />}
                  sx={{
                    p: 2,
                    flexDirection: 'column',
                    borderRadius: 3,
                    textTransform: 'none',
                    height: '100%',
                    borderWidth: '2px',
                    borderColor: alpha(theme.palette.success.main, 0.3),
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: theme.palette.success.main,
                      bgcolor: alpha(theme.palette.success.main, 0.03),
                    },
                  }}
                >
                  <Box sx={{ fontSize: '1.75rem', color: 'success.main', mb: 1 }}>
                    <BarChartIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="body1" fontWeight={500}>
                    Analytics
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Server Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/web-client/${selectedServerId}`);
          }}
          sx={{ borderRadius: 1, mx: 0.5 }}
        >
          <ListItemIcon>
            <LaunchIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Launch Web Client</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/servers/${selectedServerId}`);
          }}
          sx={{ borderRadius: 1, mx: 0.5 }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/servers/${selectedServerId}`);
          }}
          sx={{ borderRadius: 1, mx: 0.5 }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Server</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main', borderRadius: 1, mx: 0.5 }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Server</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
