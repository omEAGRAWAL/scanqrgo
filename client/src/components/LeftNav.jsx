import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Typography,
  Tooltip,
  Button,
  Paper,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function LeftNav({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const menu = [
    { label: "Home", to: "/home", icon: <HomeRoundedIcon /> },
    { label: "Products", to: "/products", icon: <Inventory2RoundedIcon /> },
    { label: "Promotions", to: "/promotions", icon: <LocalOfferRoundedIcon /> },
    { label: "Campaigns", to: "/campaigns", icon: <CampaignRoundedIcon /> },
    {
      label: "Profile",
      to: "/profile",
      icon: <Avatar sx={{ width: 24, height: 24, fontSize: 14 }} />,
    },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (!token) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Welcome to ScanQRGo
          </Typography>
          <Button
            fullWidth
            variant="contained"
            component={RouterLink}
            to="/login"
            sx={{ borderRadius: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            component={RouterLink}
            to="/register"
            sx={{ borderRadius: 2 }}
          >
            Start Free
          </Button>
        </Stack>
      </Box>
      
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Profile Section */}
      <Box sx={{ p: 3, bgcolor: "grey.50" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 48,
              height: 48,
              fontWeight: 600,
            }}
          >
            {user?.logoUrl ? (
              <img
                src={user.logoUrl}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            )}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ fontSize: 13 }}
            >
              {user?.email || ""}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                mt: 0.5,
                px: 1,
                py: 0.2,
                borderRadius: 1,
                bgcolor:
                  user?.subscription?.status === "active"
                    ? "success.light"
                    : user?.subscription?.status === "freeTrial"
                    ? "warning.light"
                    : "white",
                color: "#fff",
                fontWeight: 500,
              }}
            >
              {user?.subscription?.status === "freeTrial"
                ? "Free Trial"
                : user?.subscription?.status === "active"
                ? "Active"
                : ""}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Menu Section */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                ...(active && {
                  bgcolor: "primary.main",
                  color: "#333",
                  "& .MuiListItemIcon-root": { color: "#000" },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutRoundedIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Paper>
  );
}
