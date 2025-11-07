import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { API_URL } from "../config/api";

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState({ status: "all", type: "all" });

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function fetchPromotions() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `${API_URL}/promotions`;
      const params = new URLSearchParams();
      if (filter.status !== "all") params.append("status", filter.status);
      if (filter.type !== "all") params.append("type", filter.type);
      if (params.toString()) url += `?${params.toString()}`;
      const res = await fetch(url, { headers: { Authorization: token } });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch promotions");
      setPromotions(data.promotions || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deletePromotion(promotionId) {
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/promotions/${promotionId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete promotion");
      }
      setPromotions((prev) => prev.filter((p) => p._id !== promotionId));
      setSuccess("Promotion deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      default:
        return "warning";
    }
  };

  const renderCodeValue = (promotion) => {
    if (promotion.type === "discount code") {
      return promotion.couponCode || "-";
    }
    if (promotion.type === "extended warranty") {
      return promotion.warrantyPeriod
        ? `${promotion.warrantyPeriod} months`
        : "-";
    }
    return "-";
  };

  const rowsSkeleton = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={`sk-${i}`}>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={200} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={60} height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="text" width={120} />
          </TableCell>
        </TableRow>
      )),
    []
  );

  const emptyState = (
    <Box textAlign="center" py={6}>
      <Typography variant="h6" gutterBottom>
        No promotions found
      </Typography>
      <Typography color="text.secondary">
        Add a new promotion to start engaging customers.
      </Typography>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        startIcon={<Add />}
        component={Link}
        to="/promotions/create"
      >
        Create Promotion
      </Button>
    </Box>
  );

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" gutterBottom>
            Promotions
          </Typography>
          <Typography color="text.secondary">
            Create and manage promotional rewards & offers
          </Typography>
        </div>
        <Button
          component={Link}
          to="/promotions/create"
          variant="contained"
          startIcon={<Add />}
        >
          New Promotion
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} my={3}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filter.status}
            onChange={(e) =>
              setFilter((f) => ({ ...f, status: e.target.value }))
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={filter.type}
            onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="discount code">Discount Code</MenuItem>
            <MenuItem value="extended warranty">Extended Warranty</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Alerts */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setError("")} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          variant="filled"
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ minWidth: "200px" }}>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && rowsSkeleton}

              {!loading && promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>{emptyState}</TableCell>
                </TableRow>
              )}

              {!loading &&
                promotions.length > 0 &&
                promotions.map((promotion) => (
                  <TableRow hover key={promotion._id}>
                    <TableCell>{promotion.name}</TableCell>
                    <TableCell>{promotion.description || "-"}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {promotion.type || "-"}
                    </TableCell>
                    <TableCell>{renderCodeValue(promotion)}</TableCell>
                    <TableCell>
                      <Chip
                        label={promotion.status || "pending"}
                        color={statusColor(promotion.status)}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      {promotion.createdAt
                        ? new Date(promotion.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View">
                          <IconButton
                            component={Link}
                            to={`/promotions/${promotion._id}`}
                            size="small"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            to={`/promotions/${promotion._id}/edit`}
                            size="small"
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => deletePromotion(promotion._id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && promotions.length > 0 && (
          <Box px={2} py={1}>
            <Typography variant="body2" color="text.secondary">
              Showing {promotions.length} promotion
              {promotions.length > 1 ? "s" : ""}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
