import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Skeleton,
  Paper,
  Divider,
} from "@mui/material";
import { API_URL } from "../config/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    campaigns: 0,
    promotions: 0,
    reviews: 0,
  });

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchSummary();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      fetchReviewsForCampaign(selectedCampaignId);
    } else {
      fetchAllReviews();
    }
  }, [selectedCampaignId]);

  async function fetchSummary() {
    setLoadingSummary(true);
    setError("");
    try {
      const headers = token ? { Authorization: token } : {};
      const [productRes, campaignRes, promotionRes, reviewsRes] =
        await Promise.all([
          fetch(`${API_URL}/products`, { headers }),
          fetch(`${API_URL}/campaigns`, { headers }),
          fetch(`${API_URL}/promotions`, { headers }),
          fetch(`${API_URL}/public/reviews`, { headers }),
        ]);

      const productData = await productRes.json();
      const campaignData = await campaignRes.json();
      const promotionData = await promotionRes.json();
      const reviewsData = await reviewsRes.json();

      setStats({
        products: productData.products?.length || 0,
        campaigns: campaignData.campaigns?.length || 0,
        promotions: promotionData.promotions?.length || 0,
        reviews:
          reviewsData.total ||
          reviewsData.count ||
          reviewsData.reviews?.length ||
          0,
      });
    } catch (err) {
      setError("Failed to load dashboard summary." + err.message);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function fetchCampaigns() {
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/campaigns`, { headers });
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  }

  async function fetchAllReviews() {
    setLoadingReviews(true);
    setError("");
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/public/reviews`, { headers });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setReviews([]);
      console.error("Failed to load reviews", err);
      setError("Failed to load reviews." + err.message);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function fetchReviewsForCampaign(id) {
    setLoadingReviews(true);
    setError("");
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/public/campaign/${id}/reviews`, {
        headers,
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setReviews([]);
      setError("Failed to load campaign reviews." + err.message);
    } finally {
      setLoadingReviews(false);
    }
  }

  function downloadCSV() {
    if (!reviews.length) {
      alert("No reviews available to download");
      return;
    }

    const csvData = reviews.map(
      ({
        _id,
        createdAt,
        campaign,
        product,
        customerName,
        email,
        phoneNumber,
        review,
      }) => ({
        ID: _id,
        Date: new Date(createdAt).toLocaleString(),
        Campaign: campaign?.name || "",
        Product: product?.name || "",
        CustomerName: customerName || "",
        Email: email || "",
        Review: review || "",
        PhoneNumber: phoneNumber || "",
      })
    );

    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(","),
      ...csvData.map((row) => headers.map((h) => row[h]).join(",")),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reviews_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Dashboard Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            High-level stats and recent reviews
          </Typography>
        </Box>
        <Button variant="contained" onClick={downloadCSV}>
          Download Reviews CSV
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Products"
            value={stats.products}
            loading={loadingSummary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Campaigns"
            value={stats.campaigns}
            loading={loadingSummary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Promotions"
            value={stats.promotions}
            loading={loadingSummary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Reviews"
            value={stats.reviews}
            loading={loadingSummary}
          />
        </Grid>
      </Grid>

      {/* Campaign Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel>Select Campaign</InputLabel>
            <Select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              label="Select Campaign"
            >
              <MenuItem value="">All Campaigns</MenuItem>
              {campaigns.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedCampaignId && (
            <Button onClick={() => setSelectedCampaignId("")}>Clear</Button>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          {error}
        </Paper>
      )}

      {/* Reviews Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Campaign</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingReviews ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No reviews found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((r) => (
                <TableRow key={r._id} hover>
                  <TableCell>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{r.campaign?.name || "-"}</TableCell>
                  <TableCell>{r.product?.name || "-"}</TableCell>
                  <TableCell>{r.customerName || "-"}</TableCell>
                  <TableCell>{r.email || "-"}</TableCell>
                  <TableCell>{r.phoneNumber || "-"}</TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: "normal" }}>
                    {r.review}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Divider />
        {!loadingReviews && reviews.length > 0 && (
          <Typography
            variant="caption"
            sx={{ p: 1.5, display: "block", textAlign: "right" }}
          >
            Showing {reviews.length} review{reviews.length > 1 ? "s" : ""}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

function SummaryCard({ title, value, loading }) {
  return (
    <Card elevation={2}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={60} height={40} sx={{ mx: "auto" }} />
        ) : (
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
