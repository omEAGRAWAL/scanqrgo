// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { API_URL } from "../config/api";

// export default function Campaigns() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState({ status: "all", category: "all" });
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     fetchCampaigns();
//     fetchStats();
//     // eslint-disable-next-line
//   }, [filter]);

//   async function fetchCampaigns() {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       let url = `${API_URL}/campaigns`;

//       const params = new URLSearchParams();
//       if (filter.status !== "all") params.append("status", filter.status);
//       if (filter.category !== "all") params.append("category", filter.category);
//       if (params.toString()) url += `?${params.toString()}`;

//       const res = await fetch(url, {
//         headers: { Authorization: token },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch campaigns");

//       setCampaigns(data.campaigns || []);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchStats() {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/campaigns/stats/dashboard`, {
//         headers: { Authorization: token },
//       });

//       const data = await res.json();
//       if (res.ok) setStats(data);
//     } catch (err) {
//       console.error("Failed to fetch stats:", err);
//     }
//   }

//   async function deleteCampaign(campaignId) {
//     if (!window.confirm("Are you sure you want to delete this campaign?"))
//       return;

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
//         method: "DELETE",
//         headers: { Authorization: token },
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to delete campaign");
//       }

//       setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
//       fetchStats();
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   function getCategoryColor(category) {
//     return category === "promotion"
//       ? "bg-purple-100 text-purple-800"
//       : "bg-blue-100 text-blue-800";
//   }

//   function getStatusColor(status) {
//     const colors = {
//       active: "bg-green-100 text-green-800",
//       paused: "bg-yellow-100 text-yellow-800",
//       ended: "bg-red-100 text-red-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   }

//   function getCategoryIcon(category) {
//     return category === "promotion" ? "🎁" : "⭐";
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 pt-24 px-4 md:px-12 lg:px-24">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-1">Campaigns</h1>
//             <p className="text-gray-600">
//               Manage your marketing campaigns and track performance
//             </p>
//           </div>
//           <Link
//             to="/campaigns/create"
//             className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
//           >
//             Create Campaign
//           </Link>
//         </div>

//         {/* Stats Cards */}
//         {stats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <div className="text-3xl font-bold text-blue-600">
//                 {stats.summary.total}
//               </div>
//               <div className="text-sm text-gray-600">Total Campaigns</div>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <div className="text-3xl font-bold text-green-600">
//                 {stats.summary.active}
//               </div>
//               <div className="text-sm text-gray-600">Active</div>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <div className="text-3xl font-bold text-orange-600">
//                 {stats.analytics.totalScans}
//               </div>
//               <div className="text-sm text-gray-600">Total Scans</div>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <div className="text-3xl font-bold text-purple-600">
//                 {stats.analytics.totalCompletions}
//               </div>
//               <div className="text-sm text-gray-600">Completions</div>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
//           <div className="flex flex-wrap gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 value={filter.status}
//                 onChange={(e) =>
//                   setFilter({ ...filter, status: e.target.value })
//                 }
//                 className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="paused">Paused</option>
//                 <option value="ended">Ended</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={filter.category}
//                 onChange={(e) =>
//                   setFilter({ ...filter, category: e.target.value })
//                 }
//                 className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Categories</option>
//                 <option value="promotion">Promotion</option>
//                 <option value="review">Review</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl mb-6">
//             <div className="flex items-center">
//               <span className="text-red-600 mr-3">⚠️</span>
//               <p className="text-red-700">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && campaigns.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="text-8xl mb-6">🚀</div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               No campaigns found
//             </h3>
//             <p className="text-gray-600 mb-8">
//               Start creating campaigns to engage your customers and grow your
//               business
//             </p>
//             <Link
//               to="/campaigns/create"
//               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
//             >
//               Create Your First Campaign
//             </Link>
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
//             <table className="min-w-full text-left rounded-2xl overflow-hidden">
//               <thead className="bg-gray-100 border-b border-gray-300">
//                 <tr>
//                   <th className="py-4 px-6 font-semibold text-gray-700">#</th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Campaign
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Category
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Status
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Products
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Scans
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Completions
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Conversion Rate
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700">
//                     Created On
//                   </th>
//                   <th className="py-4 px-6 font-semibold text-gray-700 text-center">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="10" className="py-8 text-center text-gray-600">
//                       Loading campaigns...
//                     </td>
//                   </tr>
//                 ) : (
//                   campaigns.map((campaign, i) => (
//                     <tr
//                       key={campaign._id}
//                       className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                       <td className="py-4 px-6">{i + 1}</td>
//                       <td className="py-4 px-6 max-w-xs truncate flex items-center space-x-2">
//                         <span>{getCategoryIcon(campaign.category)}</span>
//                         <span>{campaign.name}</span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getCategoryColor(
//                             campaign.category
//                           )}`}
//                         >
//                           {campaign.category}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
//                             campaign.status
//                           )}`}
//                         >
//                           {campaign.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6 max-w-xs truncate">
//                         {campaign.products?.map((p) => p.name).join(", ") ||
//                           "-"}
//                       </td>
//                       <td className="py-4 px-6 text-center">
//                         {campaign.analytics?.totalScans || 0}
//                       </td>
//                       <td className="py-4 px-6 text-center">
//                         {campaign.analytics?.totalCompletions || 0}
//                       </td>
//                       <td className="py-4 px-6 text-center">
//                         {campaign.analytics?.conversionRate
//                           ? `${campaign.analytics.conversionRate.toFixed(1)}%`
//                           : "0%"}
//                       </td>
//                       <td className="py-4 px-6">
//                         {campaign.createdAt
//                           ? new Date(campaign.createdAt).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td className="py-4 px-6 flex justify-center gap-2">
//                         <Link
//                           to={`/campaigns/${campaign._id}`}
//                           className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//                         >
//                           View
//                         </Link>
//                         <Link
//                           to={`/campaigns/${campaign._id}/edit`}
//                           className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
//                         >
//                           Edit
//                         </Link>
//                         <button
//                           onClick={() => deleteCampaign(campaign._id)}
//                           className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/Campaigns.jsx
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { API_URL } from "../config/api"; // adjust path as needed
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";


export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "all", category: "all" });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
    // eslint-disable-next-line
  }, [filter]);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `${API_URL}/campaigns`;
      const params = new URLSearchParams();
      if (filter.status !== "all") params.append("status", filter.status);
      if (filter.category !== "all") params.append("category", filter.category);
      if (params.toString()) url += `?${params.toString()}`;
      const res = await fetch(url, { headers: { Authorization: token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch campaigns");
      setCampaigns(data.campaigns || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/campaigns/stats/dashboard`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  // async function deleteCampaign(campaignId) {
  //   if (!window.confirm("Are you sure you want to delete this campaign?"))
  //     return;
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
  //       method: "DELETE",
  //       headers: { Authorization: token },
  //     });
  //     if (!res.ok) {
  //       const data = await res.json();
  //       throw new Error(data.message || "Failed to delete campaign");
  //     }
  //     setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
  //     fetchStats();
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // }
  // ⬇️ Replace deleteCampaign with toggleStatus
  async function toggleStatus(campaignId, currentStatus) {
    try {
      const token = localStorage.getItem("token");
      // Toggle between active ↔︎ ended
      const newStatus = currentStatus === "active" ? "ended" : "active";

      const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      // Fetch fresh campaigns and stats after update
      await fetchCampaigns();
      await fetchStats();
    } catch (err) {
      alert(err.message);
    }
  }

  function getCategoryColor(category) {
    return category === "promotion" ? "secondary" : "info";
  }
  function getStatusMeta(status) {
    const map = {
      active: { color: "success", label: "ACTIVE" },
      paused: { color: "warning", label: "PAUSED" },
      ended: { color: "error", label: "ENDED" },
    };
    return (
      map[status] || { color: "default", label: (status || "").toUpperCase() }
    );
  }
  function getCategoryIcon(category) {
    return category === "promotion" ? (
      <RedeemRoundedIcon fontSize="small" />
    ) : (
      <StarRoundedIcon fontSize="small" />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 6,
        background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box>
            <Typography variant="h3" fontWeight={800}>
              Campaigns
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your marketing campaigns and track performance
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            component={RouterLink}
            to="/campaigns/create"
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              fontWeight: 700,
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              boxShadow: 3,
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #6d28d9)",
                boxShadow: 6,
              },
            }}
          >
            Create Campaign
          </Button>
        </Stack>

        {stats && (
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <CampaignRoundedIcon color="primary" />
                  <Typography variant="overline" color="text.secondary">
                    Total Campaigns
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {stats.summary.total}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <CampaignRoundedIcon color="success" />
                  <Typography variant="overline" color="text.secondary">
                    Active
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="success.main">
                  {stats.summary.active}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <InsightsRoundedIcon color="warning" />
                  <Typography variant="overline" color="text.secondary">
                    Total Scans
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="warning.main">
                  {stats.analytics.totalScans}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <DoneAllRoundedIcon color="secondary" />
                  <Typography variant="overline" color="text.secondary">
                    Completions
                  </Typography>
                </Stack>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="secondary.main"
                >
                  {stats.analytics.totalCompletions}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <FormControl size="medium" sx={{ minWidth: 180 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={filter.status}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, status: e.target.value }))
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="ended">Ended</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="medium" sx={{ minWidth: 220 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={filter.category}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, category: e.target.value }))
                }
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="promotion">Promotion</MenuItem>
                <MenuItem value="review">Review</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && campaigns.length === 0 ? (
          <Paper
            elevation={3}
            sx={{ p: { xs: 6, md: 10 }, textAlign: "center", borderRadius: 3 }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: 56, md: 96 } }}
              gutterBottom
            >
              🚀
            </Typography>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              No campaigns found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start creating campaigns to engage customers and grow the
              business.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/campaigns/create"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1d4ed8, #6d28d9)",
                },
              }}
            >
              Create Your First Campaign
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 640 }}>
              <Table stickyHeader size="small" aria-label="campaigns table">
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700 } }}>
                    <TableCell>#</TableCell>
                    <TableCell>Campaign</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell align="center">Scans</TableCell>
                    <TableCell align="center">Completions</TableCell>
                    <TableCell align="center">Conversion Rate</TableCell>
                    <TableCell>Created On</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} sx={{ p: 0 }}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaigns.map((campaign, i) => {
                      const status = getStatusMeta(campaign.status);
                      return (
                        <TableRow hover key={campaign._id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{ maxWidth: 360 }}
                            >
                              {getCategoryIcon(campaign.category)}
                              <Typography noWrap title={campaign.name}>
                                {campaign.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={(campaign.category || "").toUpperCase()}
                              color={getCategoryColor(campaign.category)}
                              icon={getCategoryIcon(campaign.category)}
                              sx={{ fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={status.label}
                              color={status.color}
                              sx={{ fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              noWrap
                              title={(campaign.products || [])
                                .map((p) => p.name)
                                .join(", ")}
                            >
                              {campaign.products
                                ?.map((p) => p.name)
                                .join(", ") || "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {campaign.analytics?.totalScans || 0}
                          </TableCell>
                          <TableCell align="center">
                            {campaign.analytics?.totalCompletions || 0}
                          </TableCell>
                          <TableCell align="center">
                            {campaign.analytics?.conversionRate
                              ? `${campaign.analytics.conversionRate.toFixed(
                                  1
                                )}%`
                              : "0%"}
                          </TableCell>
                          <TableCell>
                            {campaign.createdAt
                              ? new Date(
                                  campaign.createdAt
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Tooltip title="View">
                                <IconButton
                                  color="primary"
                                  component={RouterLink}
                                  to={`/campaigns/${campaign._id}`}
                                  size="small"
                                >
                                  <OpenInNewRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  color="warning"
                                  component={RouterLink}
                                  to={`/campaigns/${campaign._id}/edit`}
                                  size="small"
                                >
                                  <EditRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {/* <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  onClick={() => deleteCampaign(campaign._id)}
                                  size="small"
                                >
                                  <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip> */}
                              <Tooltip
                                title={
                                  campaign.status === "active"
                                    ? "End Campaign"
                                    : "Activate Campaign"
                                }
                              >
                                <IconButton
                                  color={
                                    campaign.status === "active"
                                      ? "error"
                                      : "success"
                                  }
                                  onClick={() =>
                                    toggleStatus(campaign._id, campaign.status)
                                  }
                                  size="small"
                                >
                                  <PowerSettingsNewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {!loading && campaigns.length > 0 && (
              <>
                <Divider />
                <Box sx={{ p: 2, textAlign: "right", color: "text.secondary" }}>
                  <Typography variant="caption">
                    Showing {campaigns.length} campaign
                    {campaigns.length > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
}
