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
//   Stack,
//   IconButton,
//   Tooltip,
//   Skeleton,
//   Popover,
//   Link,
// } from "@mui/material";
// import {
//   PlayArrow,
//   Cancel,
//   Edit,
//   Visibility,
//   Launch,
//   BarChart,
//   Campaign,
// } from "@mui/icons-material";
// import { API_URL } from "../config/api";

// export default function Campaigns() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState({ status: "all", category: "all" });
//   const [stats, setStats] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [popoverProducts, setPopoverProducts] = useState([]);

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
//       console.log("Stats data:", error, stats);
//     } catch (err) {
//       console.error("Failed to fetch stats:", err);
//     }
//   }

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

//   // 🟢 Handle popover open/close
//   const handlePopoverOpen = (event, products) => {
//     setAnchorEl(event.currentTarget);
//     setPopoverProducts(products);
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//     setPopoverProducts([]);
//   };

//   const open = Boolean(anchorEl);

//   return (
//     <Box p={4}>
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         mb={3}
//       >
//         <Typography variant="h4" fontWeight={600}>
//           Campaigns
//         </Typography>
//         <Button variant="contained" href="/campaigns/create">
//           + New Campaign
//         </Button>
//       </Stack>

//       {/* Filters */}
//       <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
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
//       </Stack>

//       {/* Campaigns Table */}
//       <TableContainer
//         component={Paper}
//         sx={{
//           maxHeight: "75vh",
//           overflow: "auto",
//           borderRadius: 2,
//           boxShadow: 2,
//         }}
//       >
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>#</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell width={150}>Products</TableCell>
//               <TableCell>Scans</TableCell>
//               <TableCell>Completions</TableCell>
//               <TableCell>Conversion</TableCell>
//               <TableCell>Created</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading && (
//               <TableRow>
//                 <TableCell colSpan={10} align="center">
//                   <Skeleton variant="text" width="80%" />
//                 </TableCell>
//               </TableRow>
//             )}

//             {!loading && campaigns.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={10} align="center">
//                   <Typography>No campaigns found</Typography>
//                 </TableCell>
//               </TableRow>
//             )}

//             {!loading &&
//               campaigns.map((campaign, i) => {
//                 const products = campaign.products || [];
//                 const visible = products.slice(0, 3);
//                 const remaining = products.length - visible.length;

//                 return (
//                   <TableRow key={campaign._id} hover>
//                     <TableCell>{i + 1}</TableCell>
//                     <TableCell>{campaign.name}</TableCell>
//                     <TableCell>{campaign.category}</TableCell>
//                     <TableCell>{statusChip(campaign.status)}</TableCell>

//                     {/* 🟢 Improved Products Column */}
//                     <TableCell width={150}>
//                       {visible.map((p, idx) => (
//                         <Chip
//                           key={idx}
//                           label={p.name}
//                           size="small"
//                           sx={{ mr: 0.5, mb: 0.5, width: "200px " }}
//                           width={100}
//                         />
//                       ))}
//                       {remaining > 0 && (
//                         <Link
//                           component="button"
//                           variant="body2"
//                           onClick={(e) => handlePopoverOpen(e, products)}
//                         >
//                           +{remaining} more
//                         </Link>
//                       )}
//                     </TableCell>

//                     <TableCell>{campaign.analytics?.totalScans || 0}</TableCell>
//                     <TableCell>
//                       {campaign.analytics?.totalCompletions || 0}
//                     </TableCell>
//                     <TableCell>
//                       {campaign.analytics?.conversionRate
//                         ? campaign.analytics.conversionRate.toFixed(1) + "%"
//                         : "0%"}
//                     </TableCell>
//                     <TableCell>
//                       {campaign.createdAt
//                         ? new Date(campaign.createdAt).toLocaleDateString()
//                         : "-"}
//                     </TableCell>
//                     <TableCell align="right">
//                       <Stack direction="row" spacing={1}>
//                         {/* <Tooltip title="Edit">
//                           <IconButton
//                             size="small"
//                             href={`/campaigns/${campaign._id}/edit`}
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                         </Tooltip> */}
//                         <Tooltip title="View">
//                           <IconButton
//                             size="small"
//                             href={`/campaigns/${campaign._id}`}
//                           >
//                             <Visibility fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="View Form">
//                           <IconButton
//                             size="small"
//                             href={`/campaign/${campaign._id}`}
//                           >
//                             <Launch fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* 🟢 Product List Popover */}
//       <Popover
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handlePopoverClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//       >
//         <Box p={2} sx={{ maxWidth: 500 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>
//             Products
//           </Typography>
//           <Stack spacing={0.5}>
//             {popoverProducts.map((p, idx) => (
//               <Chip key={idx} label={p.name} />
//             ))}
//           </Stack>
//         </Box>
//       </Popover>
//     </Box>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  // Button,
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
  Stack,
  IconButton,
  Tooltip,
  Skeleton,
  Popover,
  TextField,
  InputAdornment,
  TablePagination,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add,
  Visibility,
  Launch,
  Search as SearchIcon,
  CampaignOutlined,
  QrCodeScannerOutlined,
  FactCheckOutlined,
  TrendingUpOutlined,
  MoreVert,
} from "@mui/icons-material";
import { API_URL } from "../config/api";
import Button from "../components/base/Button";

export default function Campaigns() {
  const theme = useTheme();

  // Data States
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI States
  const [filter, setFilter] = useState({ status: "all", category: "all" });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Popover State
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverProducts, setPopoverProducts] = useState([]);

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
      console.log("Fetched campaigns:", error);
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
      console.log("Stats data:", error, stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  // --- Popover Logic ---
  const handlePopoverOpen = (event, products) => {
    setAnchorEl(event.currentTarget);
    setPopoverProducts(products);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverProducts([]);
  };
  const open = Boolean(anchorEl);

  // --- Filtering & Pagination Logic ---
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

  const paginatedCampaigns = useMemo(() => {
    return filteredCampaigns.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredCampaigns, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Render Helpers ---
  const statusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "ended":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Campaigns
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track performance and manage your QR campaigns.
          </Typography>
        </Box>
        <Button
          to="/campaigns/new"
          icon={<Add />}
          variant="primary"
          className="shadow-lg px-6"
        >
          New Campaign
        </Button>
      </Stack>

      {/* Stats Overview */}
      {/* <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Campaigns"
            value={campaigns.length}
            icon={<CampaignOutlined />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Scans"
            value={stats?.totalScans || 0}
            icon={<QrCodeScannerOutlined />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completions"
            value={stats?.totalCompletions || 0}
            icon={<FactCheckOutlined />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Conversion"
            value={`${stats?.avgConversion || 0}%`}
            icon={<TrendingUpOutlined />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid> */}

      {/* Toolbar: Search & Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ flexGrow: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter.status}
            label="Status"
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="paused">Paused</MenuItem>
            <MenuItem value="ended">Ended</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filter.category}
            label="Category"
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="promotion">Promotion</MenuItem>
            <MenuItem value="review">Review</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Main Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Campaign Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Products</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>
                  Scans
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>
                  Conv. Rate
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width={150} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No campaigns found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCampaigns.map((campaign) => {
                  const products = campaign.products || [];
                  const visibleProducts = products.slice(0, 2);
                  const remainingProducts =
                    products.length - visibleProducts.length;

                  return (
                    <TableRow key={campaign._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: "primary.main",
                              width: 40,
                              height: 40,
                            }}
                          >
                            {campaign.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {campaign.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Created:{" "}
                              {new Date(
                                campaign.createdAt
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {campaign.category}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={campaign.status}
                          color={statusColor(campaign.status)}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            textTransform: "capitalize",
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          {visibleProducts.map((p, idx) => (
                            <Chip
                              key={idx}
                              label={p.name}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, maxWidth: 100 }}
                            />
                          ))}
                          {remainingProducts > 0 && (
                            <Chip
                              label={`+${remainingProducts}`}
                              size="small"
                              onClick={(e) => handlePopoverOpen(e, products)}
                              sx={{ cursor: "pointer", bgcolor: "grey.200" }}
                            />
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>
                          {campaign.analytics?.totalScans || 0}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={
                            campaign.analytics?.conversionRate
                              ? `${campaign.analytics.conversionRate.toFixed(
                                1
                              )}%`
                              : "0%"
                          }
                          size="small"
                          color={
                            campaign.analytics?.conversionRate > 10
                              ? "success"
                              : "default"
                          }
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              component={Link}
                              to={`/campaigns/${campaign._id}`}
                              size="small"
                              sx={{ color: "text.secondary" }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Preview Form">
                            <IconButton
                              component={Link}
                              to={`/campaign/${campaign._id}`}
                              target="_blank"
                              size="small"
                              sx={{ color: "primary.main" }}
                            >
                              <Launch fontSize="small" />
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCampaigns.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>

      {/* Product Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 2, maxWidth: 300 } }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Linked Products
        </Typography>
        <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
          {popoverProducts.map((p, idx) => (
            <Chip key={idx} label={p.name} size="small" />
          ))}
        </Stack>
      </Popover>
    </Box>
  );
}

// --- Sub-component: Stat Card ---
function StatCard({ title, value, icon, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          "&:last-child": { pb: 3 },
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
