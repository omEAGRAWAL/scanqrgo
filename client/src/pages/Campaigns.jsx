// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Paper,
//   CircularProgress,
//   Stack,
// } from "@mui/material";

// import { Navigate } from "react-router-dom";
// import { API_URL } from "../config/api";
// import { Assessment, PlayArrow, Pause, Cancel } from "@mui/icons-material";
// import { Link as RouterLink } from "react-router-dom";
// export default function Campaigns() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState({ status: "all", category: "all" });
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     fetchCampaigns();
//     fetchStats();
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
//       const res = await fetch(url, { headers: { Authorization: token } });
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

//   async function toggleStatus(campaignId, currentStatus) {
//     try {
//       const token = localStorage.getItem("token");
//       const newStatus = currentStatus === "active" ? "ended" : "active";
//       const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update status");
//       await fetchCampaigns();
//       await fetchStats();
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   //add new campaign

//   const statusChip = (status) => {
//     switch (status) {
//       case "active":
//         return <Chip label="Active" color="success" size="small" />;
//       case "paused":
//         return <Chip label="Paused" color="warning" size="small" />;
//       case "ended":
//         return <Chip label="Ended" color="default" size="small" />;
//       default:
//         return <Chip label="Unknown" color="error" size="small" />;
//     }
//   };

//   return (
//     <Box p={4}>
//       {/* Header */}
//       {/* make them in a row */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Campaigns
//         </Typography>

//         <Button variant="contained" href="/campaigns/create" sx={{ mb: 2 }}>
//           + New Campaign
//         </Button>
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           alignItems: "center",
//           gap: 1.5, // tighter than spacing={2}
//           mb: 2,
//         }}
//       >
//         <FormControl size="small" sx={{ minWidth: 160 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={filter.status}
//             label="Status"
//             onChange={(e) => setFilter({ ...filter, status: e.target.value })}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="active">Active</MenuItem>
//             <MenuItem value="paused">Paused</MenuItem>
//             <MenuItem value="ended">Ended</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl size="small" sx={{ minWidth: 180 }}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={filter.category}
//             label="Category"
//             onChange={(e) => setFilter({ ...filter, category: e.target.value })}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="promotion">Promotion</MenuItem>
//             <MenuItem value="review">Review</MenuItem>
//           </Select>
//         </FormControl>

//         {/* Optional: add Search and Reset to utilize row space efficiently */}
//         {/* <TextField size="small" placeholder="Search…" sx={{ minWidth: 220 }} /> */}
//         {/* <Button size="small" variant="outlined">Reset</Button> */}
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 1.5,
//           mb: 2,
//         }}
//       >
//         {[
//           { label: "Total Campaigns", value: stats?.summary?.total ?? 0 },
//           { label: "Active", value: stats?.summary?.active ?? 0 },
//           { label: "Total Scans", value: stats?.analytics?.totalScans ?? 0 },
//           {
//             label: "Completions",
//             value: stats?.analytics?.totalCompletions ?? 0,
//           },
//         ].map((s, i) => (
//           <Paper
//             key={i}
//             variant="outlined"
//             sx={{
//               px: 1.25,
//               py: 1,
//               minWidth: 180,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ pr: 1 }}
//               noWrap
//             >
//               {s.label}
//             </Typography>
//             <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
//               {s.value}
//             </Typography>
//           </Paper>
//         ))}
//       </Box>
//       {/* Error & Loading */}
//       {error && <Typography color="error">{error}</Typography>}
//       {loading && (
//         <Box display="flex" justifyContent="center" mt={5}>
//           <CircularProgress />
//         </Box>
//       )}
//       {/* Campaigns Table */}
//       {!loading && campaigns.length === 0 && (
//         <Typography>No campaigns found</Typography>
//       )}
//       {!loading && campaigns.length > 0 && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Products</TableCell>
//                 <TableCell>Scans</TableCell>
//                 <TableCell>Completions</TableCell>
//                 <TableCell>Conversion Rate</TableCell>
//                 <TableCell>Created</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {campaigns.map((campaign, i) => (
//                 <TableRow key={campaign._id}>
//                   <TableCell>{i + 1}</TableCell>
//                   <TableCell>{campaign.name}</TableCell>
//                   <TableCell>{campaign.category}</TableCell>
//                   <TableCell>{statusChip(campaign.status)}</TableCell>
//                   <TableCell>
//                     {(campaign.products || []).map((p) => p.name).join(", ") ||
//                       "-"}
//                   </TableCell>
//                   <TableCell>{campaign.analytics?.totalScans || 0}</TableCell>
//                   <TableCell>
//                     {campaign.analytics?.totalCompletions || 0}
//                   </TableCell>
//                   <TableCell>
//                     {campaign.analytics?.conversionRate
//                       ? campaign.analytics.conversionRate.toFixed(1) + "%"
//                       : "0%"}
//                   </TableCell>
//                   <TableCell>
//                     {campaign.createdAt
//                       ? new Date(campaign.createdAt).toLocaleDateString()
//                       : "-"}
//                   </TableCell>
//                   <TableCell align="right">
//                     <Button
//                       size="small"
//                       href={`/campaigns/${campaign._id}/edit`}
//                     >
//                       edit
//                     </Button>
//                   </TableCell>
//                   <TableCell align="right">
//                     <Button size="small" href={`/campaigns/${campaign._id}`}>
//                       view
//                     </Button>
//                   </TableCell>
//                   <TableCell align="right">
//                     <Button size="small" href={`/campaign/${campaign._id}`}>
//                       view form
//                     </Button>
//                   </TableCell>

//                   <TableCell align="right">
//                     <Button
//                       size="small"
//                       variant={
//                         campaign.status === "active" ? "outlined" : "contained"
//                       }
//                       color={campaign.status === "active" ? "error" : "success"}
//                       startIcon={
//                         campaign.status === "active" ? (
//                           <Cancel />
//                         ) : (
//                           <PlayArrow />
//                         )
//                       }
//                       onClick={() =>
//                         toggleStatus(campaign._id, campaign.status)
//                       }
//                     >
//                       {campaign.status === "active" ? "End" : "Activate"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";

import { API_URL } from "../config/api";
import {
  PlayArrow,
  Cancel,
  Edit,
  Visibility,
  Launch,
  BarChart,
  Campaign,
} from "@mui/icons-material";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "all", category: "all" });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
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

  async function toggleStatus(campaignId, currentStatus) {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "active" ? "ended" : "active";
      const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      await fetchCampaigns();
      await fetchStats();
    } catch (err) {
      alert(err.message);
    }
  }

  const statusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" />;
      case "paused":
        return <Chip label="Paused" color="warning" size="small" />;
      case "ended":
        return <Chip label="Ended" color="default" size="small" />;
      default:
        return <Chip label="Unknown" color="error" size="small" />;
    }
  };

  const statCards = [
    {
      label: "Total Campaigns",
      value: stats?.summary?.total ?? 0,
      icon: <Campaign color="primary" />,
    },
    {
      label: "Active Campaigns",
      value: stats?.summary?.active ?? 0,
      icon: <PlayArrow color="success" />,
    },
    {
      label: "Total Scans",
      value: stats?.analytics?.totalScans ?? 0,
      icon: <BarChart color="info" />,
    },
    {
      label: "Completions",
      value: stats?.analytics?.totalCompletions ?? 0,
      icon: <BarChart color="secondary" />,
    },
  ];

  return (
    <Box p={4}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight={600}>
          Campaigns
        </Typography>
        <Button variant="contained" href="/campaigns/create">
          + New Campaign
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter.status}
            label="Status"
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="paused">Paused</MenuItem>
            <MenuItem value="ended">Ended</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filter.category}
            label="Category"
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="promotion">Promotion</MenuItem>
            <MenuItem value="review">Review</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={4}>
        {statCards.map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card elevation={2}>
              <CardContent
                sx={
                  {
                    // display: "flex",
                    // // alignItems: "center",
                    // justifyContent: "space-between",
                  }
                }
              >
                <Box>
                  <Typography
                    // variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {s.label}
                    {/* {s.value} */}
                  </Typography>
                  <Typography variant="h6">{s.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Error & Loading */}
      {error && <Typography color="error">{error}</Typography>}
      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      )}

      {/* Campaigns Table */}
      {!loading && campaigns.length === 0 && (
        <Typography>No campaigns found</Typography>
      )}
      {!loading && campaigns.length > 0 && (
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Scans</TableCell>
                <TableCell>Completions</TableCell>
                <TableCell>Conversion</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign, i) => (
                <TableRow key={campaign._id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.category}</TableCell>
                  <TableCell>{statusChip(campaign.status)}</TableCell>
                  <TableCell>
                    {(campaign.products || []).map((p) => p.name).join(", ") ||
                      "-"}
                  </TableCell>
                  <TableCell>{campaign.analytics?.totalScans || 0}</TableCell>
                  <TableCell>
                    {campaign.analytics?.totalCompletions || 0}
                  </TableCell>
                  <TableCell>
                    {campaign.analytics?.conversionRate
                      ? campaign.analytics.conversionRate.toFixed(1) + "%"
                      : "0%"}
                  </TableCell>
                  <TableCell>
                    {campaign.createdAt
                      ? new Date(campaign.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          href={`/campaigns/${campaign._id}/edit`}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          href={`/campaigns/${campaign._id}`}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Form">
                        <IconButton
                          size="small"
                          href={`/campaign/${campaign._id}`}
                        >
                          <Launch fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          campaign.status === "active"
                            ? "End Campaign"
                            : "Activate Campaign"
                        }
                      >
                        <Button
                          size="small"
                          variant={
                            campaign.status === "active"
                              ? "outlined"
                              : "contained"
                          }
                          color={
                            campaign.status === "active" ? "error" : "success"
                          }
                          startIcon={
                            campaign.status === "active" ? (
                              <Cancel />
                            ) : (
                              <PlayArrow />
                            )
                          }
                          onClick={() =>
                            toggleStatus(campaign._id, campaign.status)
                          }
                        >
                          {campaign.status === "active" ? "End" : "Activate"}
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
