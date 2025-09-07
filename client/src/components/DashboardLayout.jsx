import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LeftNav from "./LeftNav";
import rev from "../assets/Reviu_Logo.png";

const drawerWidth = 280;

export default function DashboardLayout({ user }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const upMd = useMediaQuery("(min-width:900px)");
  const location = useLocation();

  // Keep public-only routes outside this layout.
  const publicOnly = ["/", "/login", "/register", "/tc"];
  const isPublicCampaignRoute = location.pathname.startsWith("/campaign/");
  const hideLayout =
    publicOnly.includes(location.pathname) || isPublicCampaignRoute;
  if (hideLayout) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <CssBaseline />
        <Outlet />
      </Box>
    );
  }

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <a href="/">
          {/* <Typography variant="h6" fontWeight={800}>
            ScanQRGo
          </Typography> */}
          <img src={rev} alt="Reviu Logo" className="h-8 w-auto" />
        </a>
      </Box>
      <Divider />
      <LeftNav user={user} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.8)",
          color: "text.primary",
          ml: { md: `${drawerWidth}px` }, // push AppBar right when drawer is permanent
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar>
          {!upMd && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
            Dashboard
          </Typography>
          <Box sx={{ flex: 1 }} />
        </Toolbar>
      </AppBar>

      {/* Left Drawer */}
      <Box component="nav" aria-label="left navigation">
        {/* Mobile (temporary) */}
        <Drawer
          anchor="left"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop (permanent) */}
        <Drawer
          anchor="left"
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 },
          pb: 3,
          pl: { md: `${drawerWidth}px` }, // reserve space for left drawer
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
