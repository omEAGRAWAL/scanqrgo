import React, { useEffect, useMemo, useState } from "react";
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
  TextField,
  InputAdornment,
  Menu,
  Tooltip,
  TablePagination,
  Rating,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as XLSX from "xlsx"; // npm i xlsx
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

  // UI: search, sort, pagination, export menu
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // helpers: parse and normalize
  const parseReviewsResponse = (data) =>
    Array.isArray(data) ? data : data?.reviews || [];

  const normalizeReview = (r) => {
    const s = r?.stepData || {};
    return {
      id: r?._id,
      date: r?.scannedAt || r?.createdAt || null,
      campaignName: r?.campaign?.name || "",
      productName: r?.product?.name || "",
      productImage: r?.product?.imageurl || "",
      asin: r?.product?.amazonAsin || "",
      fsn: r?.product?.flipkartFsn || "",
      customerName: s?.customerName || r?.customerName || "",
      email: s?.email || r?.email || "",
      phoneNumber: s?.phoneNumber || r?.phoneNumber || "",
      review: s?.review || r?.review || "",
      rating: s?.rating ?? null,
      marketplace: s?.marketplace || "",
      clickedMarketplaceButton: s?.clickedMarketplaceButton ?? null,
      satisfaction: s?.satisfaction || "",
      usedMoreDays: s?.usedMoreDays || "",
      orderNumber: s?.orderNumber || "",
      sellerId: r?.seller || "",
    };
  };

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
    setPage(0);
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

      const arr = parseReviewsResponse(reviewsData);
      const reviewCount =
        Array.isArray(arr) && arr.length
          ? arr.length
          : reviewsData?.total || reviewsData?.count || 0;

      setStats({
        products: productData.products?.length || 0,
        campaigns: campaignData.campaigns?.length || 0,
        promotions: promotionData.promotions?.length || 0,
        reviews: reviewCount,
      });
    } catch (err) {
      setError("Failed to load dashboard summary." + (err?.message || ""));
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
      const parsed = parseReviewsResponse(data);
      setReviews(parsed.map(normalizeReview));
    } catch (err) {
      setReviews([]);
      console.error("Failed to load reviews", err);
      setError("Failed to load reviews." + (err?.message || ""));
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
      const parsed = parseReviewsResponse(data);
      setReviews(parsed.map(normalizeReview));
    } catch (err) {
      setReviews([]);
      setError("Failed to load campaign reviews." + (err?.message || ""));
    } finally {
      setLoadingReviews(false);
    }
  }

  // Map a review to a flat exportable row (shared by CSV/XLSX)
  function mapReviewToRow(r) {
    return {
      ID: r.id,
      Date: r.date ? new Date(r.date).toLocaleString() : "",
      Campaign: r.campaignName,
      Product: r.productName,
      CustomerName: r.customerName,
      Email: r.email,
      PhoneNumber: r.phoneNumber,
      Review: r.review,
      Rating: r.rating ?? "",
      Marketplace: r.marketplace || "",
      ClickedMarketplace: r.clickedMarketplaceButton ?? "",
      OrderNumber: r.orderNumber || "",
      Satisfaction: r.satisfaction || "",
      UsedMoreDays: r.usedMoreDays || "",
      ASIN: r.asin || "",
      FSN: r.fsn || "",
    };
  }

  // CSV export (fixed headers + quoting)
  function downloadCSV(rows) {
    const source = rows ?? reviews;
    if (!source.length) {
      alert("No reviews available to download");
      return;
    }
    const csvData = source.map(mapReviewToRow);
    const headers = Object.keys(csvData);
    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((h) => {
            const cell = String(row[h] ?? "");
            const needsQuotes = /,|\n|"/.test(cell);
            const safe = cell.replace(/"/g, '""');
            return needsQuotes ? `"${safe}"` : safe;
          })
          .join(",")
      ),
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

  // Excel export using SheetJS (.xlsx)
  function downloadExcel(rows) {
    const source = rows ?? reviews;
    if (!source.length) {
      alert("No reviews available to download");
      return;
    }
    const data = source.map(mapReviewToRow);
    const ws = XLSX.utils.json_to_sheet(data);

    // autosize columns
    const headers = Object.keys(data);
    const colWidths = headers.map((h) => {
      const headerLen = String(h).length;
      const maxCellLen = data.reduce(
        (acc, row) => Math.max(acc, String(row[h] ?? "").length),
        0
      );
      return { wch: Math.min(Math.max(headerLen, maxCellLen), 60) };
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reviews");
    XLSX.writeFile(wb, `reviews_${Date.now()}.xlsx`, { bookType: "xlsx" });
  }

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) => {
      const hay = [
        r.campaignName,
        r.productName,
        r.customerName,
        r.email,
        r.review,
        r.marketplace,
        r.orderNumber,
        r.asin,
        r.fsn,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [reviews, query]);

  // Sort
  function cmp(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    const as = String(a);
    const bs = String(b);
    if (as < bs) return -1;
    if (as > bs) return 1;
    return 0;
    // Note: for dates stored as strings, this works after toLocaleString in export; for UI sorting,
    // comparing ISO or Date objects is better if server returns ISO strings.
  }
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const res = cmp(a[orderBy], b[orderBy]);
      return order === "asc" ? res : -res;
    });
    return arr;
  }, [filtered, order, orderBy]);

  // Pagination
  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  // Handlers
  function handleSortRequest(property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with search + export */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
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

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search reviews..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            endIcon={<MoreVertIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                downloadExcel(filtered); // export filtered
              }}
            >
              Export Excel (.xlsx)
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                downloadCSV(filtered); // export filtered
              }}
            >
              Export CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                downloadExcel(reviews); // export all
              }}
            >
              Export All (Excel)
            </MenuItem>
          </Menu>
        </Box>
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
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
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
              <TableCell sortDirection={orderBy === "date" ? order : false}>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={() => handleSortRequest("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "campaignName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "campaignName"}
                  direction={orderBy === "campaignName" ? order : "asc"}
                  onClick={() => handleSortRequest("campaignName")}
                >
                  Campaign
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "productName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "productName"}
                  direction={orderBy === "productName" ? order : "asc"}
                  onClick={() => handleSortRequest("productName")}
                >
                  Product
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "customerName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "customerName"}
                  direction={orderBy === "customerName" ? order : "asc"}
                  onClick={() => handleSortRequest("customerName")}
                >
                  Customer Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Review</TableCell>
              <TableCell sortDirection={orderBy === "rating" ? order : false}>
                <TableSortLabel
                  active={orderBy === "rating"}
                  direction={orderBy === "rating" ? order : "asc"}
                  onClick={() => handleSortRequest("rating")}
                >
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell>Marketplace</TableCell>
              <TableCell>Clicked to Marketplace</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loadingReviews ? (
              // Skeleton Rows while loading reviews
              [...Array(rowsPerPage)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={90} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={140} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={160} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={70} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                </TableRow>
              ))
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography>No reviews found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>{r.campaignName || "-"}</TableCell>
                  <TableCell>{r.productName || "-"}</TableCell>
                  <TableCell>{r.customerName || "-"}</TableCell>
                  <TableCell>{r.email || "-"}</TableCell>
                  <TableCell>{r.phoneNumber || "-"}</TableCell>
                  <TableCell sx={{ maxWidth: 30 }}>
                    <Tooltip title={r.review || ""} arrow>
                      <Typography variant="body2" noWrap>
                        {r.review || "-"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Rating
                      size="small"
                      value={Number(r.rating) || 0}
                      precision={0.5}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>{r.marketplace || "-"}</TableCell>
                  <TableCell>
                    {r.clickedMarketplaceButton ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Divider />
        {!loadingReviews && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <Typography variant="caption">
              Showing {paged.length} of {sorted.length} filtered reviews
            </Typography>
            <TablePagination
              component="div"
              count={sorted.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </Box>
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
