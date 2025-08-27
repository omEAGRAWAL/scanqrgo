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

  // ⬇️ Replace deleteCampaign with toggleStatus
  async function toggleStatus(campaignId, currentStatus) {
    try {
      const token = localStorage.getItem("token");
      // Toggle between active ↔︎ ended
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
                          <TableCell
                            sx={{
                              width: 200, // fixed width in px
                              minWidth: 200,
                              maxWidth: 200,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
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
