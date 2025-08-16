import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Stack, Typography, Tooltip, Button,
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
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (!token) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">Welcome to ScanQRGo</Typography>
          <Button fullWidth variant="contained" component={RouterLink} to="/login">Login</Button>
          <Button fullWidth variant="outlined" component={RouterLink} to="/register">Start Free</Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main" }}>{(user?.name?.[0] || "U").toUpperCase()}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap title={user?.name || ""}>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap title={user?.email || ""}>
              {user?.email || ""}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1 }}>
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={active}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 1.5, textAlign: "center" }}>
        <Tooltip title="Logout">
          <IconButton color="error" onClick={handleLogout}>
            <LogoutRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
