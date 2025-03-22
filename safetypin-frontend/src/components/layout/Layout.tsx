import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
  alpha,
  Chip,
  ButtonBase,
  InputBase,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import PaymentIcon from "@mui/icons-material/Payment";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NightlightIcon from "@mui/icons-material/Nightlight";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleSettingsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Servers", icon: <StorageIcon />, path: "/servers" },
    { text: "New Server", icon: <AddCircleOutlineIcon />, path: "/servers/new" },
  ];

  const settingsItems = [
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "Security", icon: <ShieldIcon />, path: "/security" },
    { text: "Billing", icon: <PaymentIcon />, path: "/billing" },
  ];

  // Mock notification data
  const notifications = [
    { id: 1, title: "File transfer completed", time: "10 minutes ago", read: false },
    { id: 2, title: "Server maintenance scheduled", time: "3 hours ago", read: false },
    { id: 3, title: "Storage quota reaching limit", time: "1 day ago", read: true },
  ];

  const drawer = (
    <Box 
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ 
        py: 3, 
        px: 2,
        display: "flex", 
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            py: 1.5,
            px: 2,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 400 600" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '12px' }}
          >
            <path
              d="M240 80L240 250 L330 250 C360 320 330 400 240 450 L200 550 L160 450 C70 400 40 320 70 250 L160 250 L160 80 Z"
              fill="#2D1B69"
            />
            <circle cx="200" cy="320" r="45" stroke="white" strokeWidth="12" fill="#2D1B69" />
            <rect x="150" y="420" width="100" height="12" rx="6" fill="white" />
          </svg>
          <Typography variant="h6" fontWeight="bold" color="primary">
            SafetyPin OSS
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <Box 
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            p: 1,
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          }}
        >
          <SearchIcon color="action" sx={{ ml: 1, mr: 1 }} />
          <InputBase 
            placeholder="Search..."
            sx={{ ml: 1, flex: 1, fontSize: "0.875rem" }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            mb: 2,
          }}
        >
          <Avatar 
            sx={{ 
              width: 42, 
              height: 42, 
              mr: 2,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography variant="subtitle1" fontWeight="medium" noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            sx={{ 
              ml: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
            onClick={handleProfileMenuOpen}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Typography 
        variant="subtitle2" 
        color="text.secondary" 
        sx={{ px: 3, mb: 1, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}
      >
        Main Menu
      </Typography>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                backgroundColor: 
                  location.pathname === item.path ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                color: 
                  location.pathname === item.path ? "primary.main" : "inherit",
                '&:hover': {
                  backgroundColor: location.pathname === item.path 
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.05),
                },
              }}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? "primary.main" : "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
              {item.path === "/servers" && (
                <Chip 
                  label="12" 
                  size="small" 
                  color={location.pathname === item.path ? "primary" : "default"}
                  sx={{ 
                    height: 20, 
                    fontSize: "0.75rem",
                    backgroundColor: location.pathname === item.path 
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.action.selected, 0.1),
                    color: location.pathname === item.path ? "primary.main" : "text.secondary",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Typography 
        variant="subtitle2" 
        color="text.secondary" 
        sx={{ px: 3, mb: 1, mt: 3, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}
      >
        Recent Activity
      </Typography>

      <List sx={{ px: 2 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CloudUploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Uploaded files"
              secondary="10 minutes ago"
              primaryTypographyProps={{ fontSize: "0.875rem" }}
              secondaryTypographyProps={{ fontSize: "0.75rem" }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FolderOpenIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="New server created"
              secondary="3 hours ago"
              primaryTypographyProps={{ fontSize: "0.875rem" }}
              secondaryTypographyProps={{ fontSize: "0.75rem" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CloudDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Downloaded reports"
              secondary="1 day ago"
              primaryTypographyProps={{ fontSize: "0.875rem" }}
              secondaryTypographyProps={{ fontSize: "0.75rem" }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 2 }}>
        {settingsItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                backgroundColor: 
                  location.pathname === item.path ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                color: 
                  location.pathname === item.path ? "primary.main" : "inherit",
                '&:hover': {
                  backgroundColor: location.pathname === item.path 
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.05),
                },
              }}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? "primary.main" : "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              color: "error.main",
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              },
            }}
            onClick={handleLogout}
          >
            <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, mt: 1 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            display: "flex",
            alignItems: "center",
          }}
        >
          <HelpOutlineIcon color="info" sx={{ mr: 1.5 }} />
          <Box>
            <Typography variant="subtitle2" color="info.main" gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check our documentation or contact support
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Help & Support">
              <IconButton
                size="medium"
                color="inherit"
                sx={{ 
                  mr: 1.5,
                  color: "text.secondary",
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.15),
                  }
                }}
              >
                <SupportAgentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton
                size="medium"
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{ 
                  mr: 1.5,
                  color: "text.secondary",
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.15),
                  }
                }}
              >
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                  <NotificationsNoneIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton
                size="medium"
                color="inherit"
                onClick={handleSettingsOpen}
                sx={{ 
                  mr: 2,
                  color: "text.secondary",
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.15),
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account settings">
              <IconButton 
                onClick={handleProfileMenuOpen}
                size="small"
                aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                sx={{
                  p: 0,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                mt: 1.5,
                borderRadius: 2,
                minWidth: 220,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => navigate("/profile")} sx={{ borderRadius: 1, mx: 1, px: 1.5 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate("/security")} sx={{ borderRadius: 1, mx: 1, px: 1.5 }}>
              <ListItemIcon>
                <ShieldIcon fontSize="small" />
              </ListItemIcon>
              Security
            </MenuItem>
            <MenuItem onClick={() => navigate("/billing")} sx={{ borderRadius: 1, mx: 1, px: 1.5 }}>
              <ListItemIcon>
                <PaymentIcon fontSize="small" />
              </ListItemIcon>
              Billing
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              onClick={handleLogout} 
              sx={{ 
                color: "error.main", 
                borderRadius: 1, 
                mx: 1, 
                px: 1.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                }
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          
          <Menu
            anchorEl={notificationsAnchor}
            id="notifications-menu"
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            onClick={handleNotificationsClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                borderRadius: 2,
                width: 320,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Notifications
              </Typography>
              <Chip 
                label={`${notifications.filter(n => !n.read).length} new`} 
                size="small" 
                color="primary" 
                sx={{ height: 20, fontSize: "0.75rem" }} 
              />
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {notifications.map((notification) => (
                  <ListItem 
                    key={notification.id} 
                    sx={{ 
                      px: 2, 
                      py: 1.5,
                      backgroundColor: notification.read ? "transparent" : alpha(theme.palette.primary.light, 0.05),
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      }
                    />
                    {!notification.read && (
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: "50%", 
                          backgroundColor: "primary.main",
                          ml: 1,
                        }} 
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            )}
            <Divider />
            <Box sx={{ p: 1.5, textAlign: "center" }}>
              <Button
                size="small"
                color="primary"
                sx={{ 
                  fontSize: "0.75rem",
                  borderRadius: 1,
                  textTransform: "none",
                }}
              >
                View all notifications
              </Button>
            </Box>
          </Menu>
          
          <Menu
            anchorEl={settingsAnchor}
            id="settings-menu"
            open={Boolean(settingsAnchor)}
            onClose={handleSettingsClose}
            onClick={handleSettingsClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                borderRadius: 2,
                width: 200,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <NightlightIcon fontSize="small" />
              </ListItemIcon>
              Dark Mode
            </MenuItem>
            <MenuItem sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <SupportAgentIcon fontSize="small" />
              </ListItemIcon>
              Support
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          p: 3,
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;