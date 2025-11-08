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
  Stack,
  IconButton,
  Tooltip,
  Skeleton,
  Popover,
  Link,
} from "@mui/material";
import {
  PlayArrow,
  Cancel,
  Edit,
  Visibility,
  Launch,
  BarChart,
  Campaign,
} from "@mui/icons-material";
import { API_URL } from "../config/api";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "all", category: "all" });
  const [stats, setStats] = useState(null);
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

  // 🟢 Handle popover open/close
  const handlePopoverOpen = (event, products) => {
    setAnchorEl(event.currentTarget);
    setPopoverProducts(products);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverProducts([]);
  };

  const open = Boolean(anchorEl);

  return (
    <Box p={4}>
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

      {/* Campaigns Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "75vh",
          overflow: "auto",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width={150}>Products</TableCell>
              <TableCell>Scans</TableCell>
              <TableCell>Completions</TableCell>
              <TableCell>Conversion</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              </TableRow>
            )}

            {!loading && campaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography>No campaigns found</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              campaigns.map((campaign, i) => {
                const products = campaign.products || [];
                const visible = products.slice(0, 3);
                const remaining = products.length - visible.length;

                return (
                  <TableRow key={campaign._id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>{campaign.category}</TableCell>
                    <TableCell>{statusChip(campaign.status)}</TableCell>

                    {/* 🟢 Improved Products Column */}
                    <TableCell width={150}>
                      {visible.map((p, idx) => (
                        <Chip
                          key={idx}
                          label={p.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5, width: "200px " }}
                          width={100}
                        />
                      ))}
                      {remaining > 0 && (
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) => handlePopoverOpen(e, products)}
                        >
                          +{remaining} more
                        </Link>
                      )}
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
                        {/* <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            href={`/campaigns/${campaign._id}/edit`}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip> */}
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
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🟢 Product List Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2} sx={{ maxWidth: 500 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Products
          </Typography>
          <Stack spacing={0.5}>
            {popoverProducts.map((p, idx) => (
              <Chip key={idx} label={p.name} />
            ))}
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}
