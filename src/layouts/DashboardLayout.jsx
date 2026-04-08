import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Avatar,
  TextField,
} from "@mui/material";

import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { sidebarLinks } from "../config/sidebarConfig";
import Snackbar from "@mui/material/Snackbar";
const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const [open, setOpen] = useState(false);

useEffect(() => {
  if (notifications.length > 0) {
    setOpen(true);
  }
}, [notifications]);
  const navigate = useNavigate();
  const location = useLocation();

  const links = sidebarLinks[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getIcon = (label) => {
    switch (label) {
      case "Dashboard":
        return <DashboardIcon />;
      case "Medicines":
        return <LocalPharmacyIcon />;
      case "Orders":
        return <AssignmentIcon />;
      case "Inventory":
        return <InventoryIcon />;
      default:
        return <DashboardIcon />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={600}>
            Shifa Platform
          </Typography>
        </Toolbar>

        <List>
          {links.map((item, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon>{getIcon(item.label)}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}

          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {/* Topbar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            mb: 3,
            borderRadius: 2,
            p: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              placeholder="Search..."
              sx={{ width: 300 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              
              {/* 🔔 Notification Bell */}
              <IconButton>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* 👤 Avatar */}
              <Avatar
                sx={{ bgcolor: "primary.main", cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              >
                {user?.role?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>
        </AppBar>

        {children}
        <Snackbar
            open={open}
            autoHideDuration={3000}
            message={notifications[0]?.message}
            onClose={() => setOpen(false)}
        />
      </Box>
    </Box>
  );
}