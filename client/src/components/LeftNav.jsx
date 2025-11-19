// import React from "react";
// import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Divider,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Stack,
//   Typography,
//   Tooltip,
//   Button,
//   Paper,
// } from "@mui/material";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
// import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
// import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

// export default function LeftNav({ user }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const menu = [
//     { label: "Home", to: "/home", icon: <HomeRoundedIcon /> },
//     { label: "Products", to: "/products", icon: <Inventory2RoundedIcon /> },
//     { label: "Promotions", to: "/promotions", icon: <LocalOfferRoundedIcon /> },
//     { label: "Campaigns", to: "/campaigns", icon: <CampaignRoundedIcon /> },
//     {
//       label: "Profile",
//       to: "/profile",
//       icon: <Avatar sx={{ width: 24, height: 24, fontSize: 14 }} />,
//     },
//   ];

//   function handleLogout() {
//     localStorage.removeItem("token");
//     navigate("/login");
//   }

//   if (!token) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Stack spacing={2} alignItems="center">
//           <Typography variant="h6" fontWeight={600}>
//             Welcome to ScanQRGo
//           </Typography>
//           <Button
//             fullWidth
//             variant="contained"
//             component={RouterLink}
//             to="/login"
//             sx={{ borderRadius: 2 }}
//           >
//             Login
//           </Button>
//           <Button
//             fullWidth
//             variant="outlined"
//             component={RouterLink}
//             to="/register"
//             sx={{ borderRadius: 2 }}
//           >
//             Start Free
//           </Button>
//         </Stack>
//       </Box>

//     );
//   }

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: 3,
//         overflow: "hidden",
//       }}
//     >
//       {/* Profile Section */}
//       <Box sx={{ p: 3, bgcolor: "grey.50" }}>
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Avatar
//             sx={{
//               bgcolor: "primary.main",
//               width: 48,
//               height: 48,
//               fontWeight: 600,
//             }}
//           >
//             {user?.logoUrl ? (
//               <img
//                 src={user.logoUrl}
//                 alt="Logo"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               user?.name
//                 ?.split(" ")
//                 .map((n) => n[0])
//                 .join("")
//                 .toUpperCase()
//             )}
//           </Avatar>
//           <Box sx={{ minWidth: 0 }}>
//             <Typography variant="subtitle1" fontWeight={600} noWrap>
//               {user?.name || "User"}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               noWrap
//               sx={{ fontSize: 13 }}
//             >
//               {user?.email || ""}
//             </Typography>
//             <Typography
//               variant="caption"
//               sx={{
//                 display: "inline-block",
//                 mt: 0.5,
//                 px: 1,
//                 py: 0.2,
//                 borderRadius: 1,
//                 bgcolor:
//                   user?.subscription?.status === "active"
//                     ? "success.light"
//                     : user?.subscription?.status === "freeTrial"
//                     ? "warning.light"
//                     : "white",
//                 color: "#fff",
//                 fontWeight: 500,
//               }}
//             >
//               {user?.subscription?.status === "freeTrial"
//                 ? "Free Trial"
//                 : user?.subscription?.status === "active"
//                 ? "Active"
//                 : ""}
//             </Typography>
//           </Box>
//         </Stack>
//       </Box>

//       {/* Menu Section */}
//       <List sx={{ flex: 1, px: 2, py: 1 }}>
//         {menu.map((item) => {
//           const active = location.pathname.startsWith(item.to);
//           return (
//             <ListItemButton
//               key={item.to}
//               component={RouterLink}
//               to={item.to}
//               selected={active}
//               sx={{
//                 borderRadius: 2,
//                 mb: 0.5,
//                 ...(active && {
//                   bgcolor: "primary.main",
//                   color: "#333",
//                   "& .MuiListItemIcon-root": { color: "#000" },
//                 }),
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.label} />
//             </ListItemButton>
//           );
//         })}
//       </List>

//       <Divider />

//       {/* Logout */}
//       <Box sx={{ p: 2, textAlign: "center" }}>
//         <Button
//           variant="outlined"
//           color="error"
//           fullWidth
//           startIcon={<LogoutRoundedIcon />}
//           onClick={handleLogout}
//           sx={{ borderRadius: 2 }}
//         >
//           Logout
//         </Button>
//       </Box>
//     </Paper>
//   );
// }

import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Typography,
  Button,
  Paper,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

// Helper to get initials safely
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2) // Limit to 2 chars
    .toUpperCase();
};

// Helper for subscription badge color
const getSubscriptionColor = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "freeTrial":
      return "warning";
    default:
      return "default";
  }
};

// Helper for subscription text
const getSubscriptionLabel = (status) => {
  switch (status) {
    case "active":
      return "Pro Plan";
    case "freeTrial":
      return "Free Trial";
    default:
      return "Free Tier";
  }
};

export default function LeftNav({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const token = localStorage.getItem("token");

  const menu = [
    { label: "Home", to: "/home", icon: <HomeRoundedIcon /> },
    { label: "Products", to: "/products", icon: <Inventory2RoundedIcon /> },
    { label: "Promotions", to: "/promotions", icon: <LocalOfferRoundedIcon /> },
    { label: "Campaigns", to: "/campaigns", icon: <CampaignRoundedIcon /> },
    { label: "Profile", to: "/profile", icon: <PersonRoundedIcon /> },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // --- Render: Guest View ---
  if (!token) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          borderRight: "1px solid",
          borderColor: "divider",
          p: 3,
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%" }}
        >
          <Box sx={{ textAlign: "center" }}>
            {/* Placeholder for Logo */}
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: "primary.main",
                borderRadius: 2,
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Inventory2RoundedIcon sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              ScanQRGo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your products and campaigns efficiently.
            </Typography>
          </Box>

          <Box sx={{ width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              component={RouterLink}
              to="/login"
              startIcon={<LoginRoundedIcon />}
              sx={{ borderRadius: 2, mb: 1.5, py: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/register"
              sx={{ borderRadius: 2, py: 1 }}
            >
              Create Account
            </Button>
          </Box>
        </Stack>
      </Paper>
    );
  }

  // --- Render: Authenticated View ---
  return (
    <Paper
      elevation={0} // Flat design is more modern for sidebars
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {/* 1. User Profile Card */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user?.logoUrl}
            alt={user?.name}
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 48,
              height: 48,
              fontSize: 18,
              fontWeight: 700,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {getInitials(user?.name)}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {user?.name || "User"}
            </Typography>
            <Chip
              label={getSubscriptionLabel(user?.subscription?.status)}
              color={getSubscriptionColor(user?.subscription?.status)}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
            />
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ mx: 3, mb: 2 }} />

      {/* 2. Navigation Menu */}
      <List component="nav" sx={{ flex: 1, px: 2 }}>
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
                py: 1.2,
                color: active ? "primary.main" : "text.secondary",
                bgcolor: active
                  ? alpha(theme.palette.primary.main, 0.12)
                  : "transparent",
                "&:hover": {
                  bgcolor: active
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.text.primary, 0.05),
                  color: active ? "primary.dark" : "text.primary",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: active ? "inherit" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: active ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* 3. Footer / Logout */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="text"
          color="error"
          fullWidth
          startIcon={<LogoutRoundedIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            justifyContent: "flex-start",
            px: 2,
            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
          }}
        >
          Logout
        </Button>

        <Typography
          variant="caption"
          color="text.disabled"
          display="block"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          v1.0.0
        </Typography>
      </Box>
    </Paper>
  );
}
