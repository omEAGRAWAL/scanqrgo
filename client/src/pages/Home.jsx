// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Select,
//   MenuItem,
//   Button,
//   FormControl,
//   InputLabel,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   CircularProgress,
//   Skeleton,
//   Paper,
//   Divider,
//   TextField,
//   InputAdornment,
//   Menu,
//   Tooltip,
//   TablePagination,
//   Rating,
// } from "@mui/material";
// import TableSortLabel from "@mui/material/TableSortLabel";
// import SearchIcon from "@mui/icons-material/Search";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import * as XLSX from "xlsx"; // npm i xlsx
// import { API_URL } from "../config/api";

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     products: 0,
//     campaigns: 0,
//     promotions: 0,
//     reviews: 0,
//   });
//   const [campaigns, setCampaigns] = useState([]);
//   const [selectedCampaignId, setSelectedCampaignId] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [loadingSummary, setLoadingSummary] = useState(true);
//   const [loadingReviews, setLoadingReviews] = useState(false);
//   const [error, setError] = useState("");

//   // UI: search, sort, pagination, export menu
//   const [query, setQuery] = useState("");
//   const [orderBy, setOrderBy] = useState("date");
//   const [order, setOrder] = useState("desc");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const menuOpen = Boolean(anchorEl);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // helpers: parse and normalize
//   const parseReviewsResponse = (data) =>
//     Array.isArray(data) ? data : data?.reviews || [];

//   const normalizeReview = (r) => {
//     const s = r?.stepData || {};
//     return {
//       id: r?._id,
//       date: r?.scannedAt || r?.createdAt || null,
//       campaignName: r?.campaign?.name || "",
//       productName: r?.product?.name || "",
//       productImage: r?.product?.imageurl || "",
//       asin: r?.product?.amazonAsin || "",
//       fsn: r?.product?.flipkartFsn || "",
//       customerName: s?.customerName || r?.customerName || "",
//       email: s?.email || r?.email || "",
//       phoneNumber: s?.phoneNumber || r?.phoneNumber || "",
//       review: s?.review || r?.review || "",
//       rating: s?.rating ?? null,
//       marketplace: s?.marketplace || "",
//       clickedMarketplaceButton: s?.clickedMarketplaceButton ?? null,
//       satisfaction: s?.satisfaction || "",
//       usedMoreDays: s?.usedMoreDays || "",
//       orderNumber: s?.orderNumber || "",
//       sellerId: r?.seller || "",
//     };
//   };

//   useEffect(() => {
//     fetchSummary();
//     fetchCampaigns();
//   }, []);

//   useEffect(() => {
//     if (selectedCampaignId) {
//       fetchReviewsForCampaign(selectedCampaignId);
//     } else {
//       fetchAllReviews();
//     }
//     setPage(0);
//   }, [selectedCampaignId]);

//   async function fetchSummary() {
//     setLoadingSummary(true);
//     setError("");
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const [productRes, campaignRes, promotionRes, reviewsRes] =
//         await Promise.all([
//           fetch(`${API_URL}/products`, { headers }),
//           fetch(`${API_URL}/campaigns`, { headers }),
//           fetch(`${API_URL}/promotions`, { headers }),
//           fetch(`${API_URL}/public/reviews`, { headers }),
//         ]);

//       const productData = await productRes.json();
//       const campaignData = await campaignRes.json();
//       const promotionData = await promotionRes.json();
//       const reviewsData = await reviewsRes.json();

//       const arr = parseReviewsResponse(reviewsData);
//       const reviewCount =
//         Array.isArray(arr) && arr.length
//           ? arr.length
//           : reviewsData?.total || reviewsData?.count || 0;

//       setStats({
//         products: productData.products?.length || 0,
//         campaigns: campaignData.campaigns?.length || 0,
//         promotions: promotionData.promotions?.length || 0,
//         reviews: reviewCount,
//       });
//     } catch (err) {
//       setError("Failed to load dashboard summary." + (err?.message || ""));
//     } finally {
//       setLoadingSummary(false);
//     }
//   }

//   async function fetchCampaigns() {
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/campaigns`, { headers });
//       const data = await res.json();
//       setCampaigns(data.campaigns || []);
//     } catch (err) {
//       console.error("Failed to fetch campaigns", err);
//     }
//   }

//   async function fetchAllReviews() {
//     setLoadingReviews(true);
//     setError("");
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/public/reviews`, { headers });
//       const data = await res.json();
//       const parsed = parseReviewsResponse(data);
//       setReviews(parsed.map(normalizeReview));
//     } catch (err) {
//       setReviews([]);
//       console.error("Failed to load reviews", err);
//       setError("Failed to load reviews." + (err?.message || ""));
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   async function fetchReviewsForCampaign(id) {
//     setLoadingReviews(true);
//     setError("");
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/public/campaign/${id}/reviews`, {
//         headers,
//       });
//       const data = await res.json();
//       const parsed = parseReviewsResponse(data);
//       setReviews(parsed.map(normalizeReview));
//     } catch (err) {
//       setReviews([]);
//       setError("Failed to load campaign reviews." + (err?.message || ""));
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   // Map a review to a flat exportable row (shared by CSV/XLSX)
//   function mapReviewToRow(r) {
//     return {
//       ID: r.id,
//       Date: r.date ? new Date(r.date).toLocaleString() : "",
//       Campaign: r.campaignName,
//       Product: r.productName,
//       CustomerName: r.customerName,
//       Email: r.email,
//       PhoneNumber: r.phoneNumber,
//       Review: r.review,
//       Rating: r.rating ?? "",
//       Marketplace: r.marketplace || "",
//       ClickedMarketplace: r.clickedMarketplaceButton ?? "",
//       OrderNumber: r.orderNumber || "",
//       Satisfaction: r.satisfaction || "",
//       UsedMoreDays: r.usedMoreDays || "",
//       ASIN: r.asin || "",
//       FSN: r.fsn || "",
//     };
//   }

//   // CSV export (fixed headers + quoting)
//   function downloadCSV(rows) {
//     const source = rows ?? reviews;
//     if (!source.length) {
//       alert("No reviews available to download");
//       return;
//     }
//     const csvData = source.map(mapReviewToRow);
//     const headers = Object.keys(csvData);
//     const csvRows = [
//       headers.join(","),
//       ...csvData.map((row) =>
//         headers
//           .map((h) => {
//             const cell = String(row[h] ?? "");
//             const needsQuotes = /,|\n|"/.test(cell);
//             const safe = cell.replace(/"/g, '""');
//             return needsQuotes ? `"${safe}"` : safe;
//           })
//           .join(",")
//       ),
//     ];
//     const csvString = csvRows.join("\n");
//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `reviews_${Date.now()}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }

//   // Excel export using SheetJS (.xlsx)
//   function downloadExcel(rows) {
//     const source = rows ?? reviews;
//     if (!source.length) {
//       alert("No reviews available to download");
//       return;
//     }
//     const data = source.map(mapReviewToRow);
//     const ws = XLSX.utils.json_to_sheet(data);

//     // autosize columns
//     const headers = Object.keys(data);
//     const colWidths = headers.map((h) => {
//       const headerLen = String(h).length;
//       const maxCellLen = data.reduce(
//         (acc, row) => Math.max(acc, String(row[h] ?? "").length),
//         0
//       );
//       return { wch: Math.min(Math.max(headerLen, maxCellLen), 60) };
//     });
//     ws["!cols"] = colWidths;

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Reviews");
//     XLSX.writeFile(wb, `reviews_${Date.now()}.xlsx`, { bookType: "xlsx" });
//   }

//   // Filter
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return reviews;
//     return reviews.filter((r) => {
//       const hay = [
//         r.campaignName,
//         r.productName,
//         r.customerName,
//         r.email,
//         r.review,
//         r.marketplace,
//         r.orderNumber,
//         r.asin,
//         r.fsn,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();
//       return hay.includes(q);
//     });
//   }, [reviews, query]);

//   // Sort
//   function cmp(a, b) {
//     if (a == null && b == null) return 0;
//     if (a == null) return -1;
//     if (b == null) return 1;
//     if (typeof a === "number" && typeof b === "number") return a - b;
//     const as = String(a);
//     const bs = String(b);
//     if (as < bs) return -1;
//     if (as > bs) return 1;
//     return 0;
//     // Note: for dates stored as strings, this works after toLocaleString in export; for UI sorting,
//     // comparing ISO or Date objects is better if server returns ISO strings.
//   }
//   const sorted = useMemo(() => {
//     const arr = [...filtered];
//     arr.sort((a, b) => {
//       const res = cmp(a[orderBy], b[orderBy]);
//       return order === "asc" ? res : -res;
//     });
//     return arr;
//   }, [filtered, order, orderBy]);

//   // Pagination
//   const paged = useMemo(() => {
//     const start = page * rowsPerPage;
//     return sorted.slice(start, start + rowsPerPage);
//   }, [sorted, page, rowsPerPage]);

//   // Handlers
//   function handleSortRequest(property) {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header with search + export */}
//       <Box
//         sx={{
//           mb: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 2,
//           flexWrap: "wrap",
//         }}
//       >
//         <Box>
//           <Typography variant="h5" fontWeight={700}>
//             Dashboard Summary
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             High-level stats and recent reviews
//           </Typography>
//         </Box>

//         <Box sx={{ display: "flex", gap: 1 }}>
//           <TextField
//             size="small"
//             placeholder="Search reviews..."
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setPage(0);
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon fontSize="small" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             variant="contained"
//             endIcon={<MoreVertIcon />}
//             onClick={(e) => setAnchorEl(e.currentTarget)}
//           >
//             Export
//           </Button>
//           <Menu
//             anchorEl={anchorEl}
//             open={menuOpen}
//             onClose={() => setAnchorEl(null)}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//           >
//             <MenuItem
//               onClick={() => {
//                 setAnchorEl(null);
//                 downloadExcel(filtered); // export filtered
//               }}
//             >
//               Export Excel (.xlsx)
//             </MenuItem>
//             <MenuItem
//               onClick={() => {
//                 setAnchorEl(null);
//                 downloadCSV(filtered); // export filtered
//               }}
//             >
//               Export CSV
//             </MenuItem>
//             <MenuItem
//               onClick={() => {
//                 setAnchorEl(null);
//                 downloadExcel(reviews); // export all
//               }}
//             >
//               Export All (Excel)
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             title="Products"
//             value={stats.products}
//             loading={loadingSummary}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             title="Campaigns"
//             value={stats.campaigns}
//             loading={loadingSummary}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             title="Promotions"
//             value={stats.promotions}
//             loading={loadingSummary}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             title="Reviews"
//             value={stats.reviews}
//             loading={loadingSummary}
//           />
//         </Grid>
//       </Grid>

//       {/* Campaign Selector */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//             flexWrap: "wrap",
//           }}
//         >
//           <FormControl size="small" sx={{ minWidth: 240 }}>
//             <InputLabel>Select Campaign</InputLabel>
//             <Select
//               value={selectedCampaignId}
//               onChange={(e) => setSelectedCampaignId(e.target.value)}
//               label="Select Campaign"
//             >
//               <MenuItem value="">All Campaigns</MenuItem>
//               {campaigns.map((c) => (
//                 <MenuItem key={c._id} value={c._id}>
//                   {c.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           {selectedCampaignId && (
//             <Button onClick={() => setSelectedCampaignId("")}>Clear</Button>
//           )}
//         </CardContent>
//       </Card>

//       {/* Error */}
//       {error && (
//         <Paper
//           sx={{
//             p: 2,
//             mb: 2,
//             bgcolor: "error.light",
//             color: "error.contrastText",
//           }}
//         >
//           {error}
//         </Paper>
//       )}

//       {/* Reviews Table */}
//       <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell sortDirection={orderBy === "date" ? order : false}>
//                 <TableSortLabel
//                   active={orderBy === "date"}
//                   direction={orderBy === "date" ? order : "asc"}
//                   onClick={() => handleSortRequest("date")}
//                 >
//                   Date
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell
//                 sortDirection={orderBy === "campaignName" ? order : false}
//               >
//                 <TableSortLabel
//                   active={orderBy === "campaignName"}
//                   direction={orderBy === "campaignName" ? order : "asc"}
//                   onClick={() => handleSortRequest("campaignName")}
//                 >
//                   Campaign
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell
//                 sortDirection={orderBy === "productName" ? order : false}
//               >
//                 <TableSortLabel
//                   active={orderBy === "productName"}
//                   direction={orderBy === "productName" ? order : "asc"}
//                   onClick={() => handleSortRequest("productName")}
//                 >
//                   Product
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell
//                 sortDirection={orderBy === "customerName" ? order : false}
//               >
//                 <TableSortLabel
//                   active={orderBy === "customerName"}
//                   direction={orderBy === "customerName" ? order : "asc"}
//                   onClick={() => handleSortRequest("customerName")}
//                 >
//                   Customer Name
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>Review</TableCell>
//               <TableCell sortDirection={orderBy === "rating" ? order : false}>
//                 <TableSortLabel
//                   active={orderBy === "rating"}
//                   direction={orderBy === "rating" ? order : "asc"}
//                   onClick={() => handleSortRequest("rating")}
//                 >
//                   Rating
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Marketplace</TableCell>
//               <TableCell>Clicked to Marketplace</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loadingReviews ? (
//               // Skeleton Rows while loading reviews
//               [...Array(rowsPerPage)].map((_, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>
//                     <Skeleton variant="text" width={80} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={100} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={120} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={90} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={140} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={140} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={100} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={160} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="rectangular" width={80} height={20} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={70} />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton variant="text" width={60} />
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : paged.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={10} align="center">
//                   <Typography>No reviews found</Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paged.map((r) => (
//                 <TableRow key={r.id} hover>
//                   <TableCell>
//                     {r.date ? new Date(r.date).toLocaleDateString() : "-"}
//                   </TableCell>
//                   <TableCell>{r.campaignName || "-"}</TableCell>
//                   <TableCell sx={{ maxWidth: 50 }}>
//                     <Tooltip title={r.productName || ""} arrow>
//                       <Typography variant="body2" noWrap>
//                         {r.productName || "-"}
//                       </Typography>
//                     </Tooltip>
//                   </TableCell>
//                   <TableCell>{r.orderNumber || "-"}</TableCell>
//                   <TableCell>{r.customerName || "-"}</TableCell>
//                   <TableCell>{r.email || "-"}</TableCell>
//                   <TableCell>{r.phoneNumber || "-"}</TableCell>

//                   <TableCell>{r.review || "-"}</TableCell>
//                   <TableCell>
//                     <Rating
//                       size="small"
//                       value={Number(r.rating) || 0}
//                       precision={0.5}
//                       readOnly
//                     />
//                   </TableCell>
//                   <TableCell>{r.marketplace || "-"}</TableCell>
//                   <TableCell>
//                     {r.clickedMarketplaceButton ? "Yes" : "No"}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//         <Divider />
//         {!loadingReviews && (
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               p: 1,
//             }}
//           >
//             <Typography variant="caption">
//               Showing {paged.length} of {sorted.length} filtered reviews
//             </Typography>
//             <TablePagination
//               component="div"
//               count={sorted.length}
//               page={page}
//               onPageChange={(_, p) => setPage(p)}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={(e) => {
//                 setRowsPerPage(parseInt(e.target.value, 10));
//                 setPage(0);
//               }}
//               rowsPerPageOptions={[10, 25, 50, 100]}
//             />
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// function SummaryCard({ title, value, loading }) {
//   return (
//     <Card elevation={2}>
//       <CardContent sx={{ textAlign: "center" }}>
//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           {title}
//         </Typography>
//         {loading ? (
//           <Skeleton variant="text" width={60} height={40} sx={{ mx: "auto" }} />
//         ) : (
//           <Typography variant="h4" fontWeight={700}>
//             {value}
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
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
  Skeleton,
  Paper,
  TextField,
  InputAdornment,
  Menu,
  Tooltip,
  TablePagination,
  Rating,
  Chip,
  IconButton,
  Collapse,
  Avatar,
  useTheme,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";

import * as XLSX from "xlsx";
import { API_URL } from "../config/api";

// --- Styled Components & Helpers ---

// Helper to truncate long text safely
const TruncatedText = ({ text, limit = 50 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return "-";
  if (text.length <= limit) return text;

  return (
    <Box>
      <Typography variant="body2" component="span">
        {expanded ? text : `${text.substring(0, limit)}...`}
      </Typography>
      <Button
        size="small"
        sx={{
          minWidth: 0,
          p: 0,
          ml: 1,
          textTransform: "none",
          fontSize: "0.75rem",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        {expanded ? "Show less" : "Read more"}
      </Button>
    </Box>
  );
};

export default function Dashboard() {
  const theme = useTheme();
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

  // UI States
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // Token handling
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // --- Data Fetching Logic (Same as original) ---
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
      const reviewCount = Array.isArray(arr)
        ? arr.length
        : reviewsData?.total || 0;

      setStats({
        products: productData.products?.length || 0,
        campaigns: campaignData.campaigns?.length || 0,
        promotions: promotionData.promotions?.length || 0,
        reviews: reviewCount,
      });
    } catch (err) {
      setError("Failed to load dashboard summary.", err);
      console.error(error);
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
      console.error(err);
    }
  }

  async function fetchAllReviews() {
    setLoadingReviews(true);
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/public/reviews`, { headers });
      const data = await res.json();
      const parsed = parseReviewsResponse(data);
      setReviews(parsed.map(normalizeReview));
    } catch (err) {
      console.error(err);
      setReviews([]);
      setError("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  }

  async function fetchReviewsForCampaign(id) {
    setLoadingReviews(true);
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/public/campaign/${id}/reviews`, {
        headers,
      });
      const data = await res.json();
      const parsed = parseReviewsResponse(data);
      setReviews(parsed.map(normalizeReview));
    } catch (err) {
      console.error(err);
      setReviews([]);
      setError("Failed to load campaign reviews.");
    } finally {
      setLoadingReviews(false);
    }
  }

  // --- Export Functions ---
  function mapReviewToRow(r) {
    return {
      ID: r.id,
      Date: r.date ? new Date(r.date).toLocaleString() : "",
      Campaign: r.campaignName,
      Product: r.productName,
      CustomerName: r.customerName,
      Email: r.email,
      Phone: r.phoneNumber,
      Review: r.review,
      Rating: r.rating ?? "",
      Marketplace: r.marketplace || "",
      ClickedMarketplace: r.clickedMarketplaceButton ? "Yes" : "No",
      OrderNumber: r.orderNumber || "",
    };
  }

  function downloadExcel(rows) {
    const source = rows ?? reviews;
    if (!source.length) return alert("No data to export");
    const data = source.map(mapReviewToRow);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reviews");
    XLSX.writeFile(
      wb,
      `Reviews_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  function downloadCSV(rows) {
    const source = rows ?? reviews;
    if (!source.length) return alert("No data to export");
    const data = source.map(mapReviewToRow);
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Reviews_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Sorting & Filtering ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) =>
      [
        r.campaignName,
        r.productName,
        r.customerName,
        r.email,
        r.review,
        r.orderNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [reviews, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (orderBy === "date") {
        return order === "asc"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      if (typeof aVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
    return arr;
  }, [filtered, order, orderBy]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // --- Render Helpers ---
  const StatusBadge = ({ value }) => {
    let color = "default";
    let label = "No";

    if (value === true || value === "Yes") {
      color = "success";
      label = "Yes";
    }
    return (
      <Chip
        label={label}
        color={color}
        size="small"
        variant="outlined"
        sx={{ height: 24, fontSize: "0.7rem" }}
      />
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            color="text.primary"
            gutterBottom
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of campaigns, products, and customer feedback.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200, bgcolor: "white" }}>
            <InputLabel>Filter by Campaign</InputLabel>
            <Select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              label="Filter by Campaign"
            >
              <MenuItem value="">All Campaigns</MenuItem>
              {campaigns.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ elevation: 3, sx: { mt: 1, borderRadius: 2 } }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                downloadExcel(filtered);
              }}
            >
              Excel (.xlsx)
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                downloadCSV(filtered);
              }}
            >
              CSV (.csv)
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.products}
            loading={loadingSummary}
            icon={
              <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "#6366f1" }} />
            }
            color="#e0e7ff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Campaigns"
            value={stats.campaigns}
            loading={loadingSummary}
            icon={
              <CampaignOutlinedIcon sx={{ fontSize: 32, color: "#ec4899" }} />
            }
            color="#fce7f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Promotions"
            value={stats.promotions}
            loading={loadingSummary}
            icon={
              <LocalOfferOutlinedIcon sx={{ fontSize: 32, color: "#14b8a6" }} />
            }
            color="#ccfbf1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reviews"
            value={stats.reviews}
            loading={loadingSummary}
            icon={
              <ReviewsOutlinedIcon sx={{ fontSize: 32, color: "#f59e0b" }} />
            }
            color="#fef3c7"
          />
        </Grid>
      </Grid>

      {/* Main Data Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name, email, product..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            sx={{ flexGrow: 1, maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                {/* Expand Row */}
                <TableCell width="50" />

                <SortableHeader
                  label="Date"
                  property="date"
                  orderBy={orderBy}
                  order={order}
                  onSort={handleSort}
                  width="120px"
                />
                <SortableHeader
                  label="Product"
                  property="productName"
                  orderBy={orderBy}
                  order={order}
                  onSort={handleSort}
                  width="200px"
                />
                <SortableHeader
                  label="Customer"
                  property="customerName"
                  orderBy={orderBy}
                  order={order}
                  onSort={handleSort}
                  width="180px"
                />
                <SortableHeader
                  label="Rating"
                  property="rating"
                  orderBy={orderBy}
                  order={order}
                  onSort={handleSort}
                  width="120px"
                />

                <TableCell
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                  width="300px"
                >
                  Review
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                  width="120px"
                >
                  Marketplace
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                  width="100px"
                >
                  Click-Through
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingReviews ? (
                [...Array(5)].map((_, i) => <TableSkeletonRow key={i} />)
              ) : paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No reviews found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => <Row key={row.id} row={row} />)
              )}
            </TableBody>
          </Table>
        </Box>

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
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </Card>
    </Box>
  );
}

// --- Sub Components ---

// 1. Collapsible Table Row
function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={500}>
            {row.date ? new Date(row.date).toLocaleDateString() : "-"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.date
              ? new Date(row.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Typography>
        </TableCell>
        <TableCell>
          <Tooltip title={row.productName} placement="top-start">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                variant="rounded"
                src={row.productImage}
                sx={{ width: 32, height: 32, bgcolor: "grey.200" }}
              >
                P
              </Avatar>
              <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                {row.productName || "Unknown Product"}
              </Typography>
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {row.customerName || "Anonymous"}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {row.email}
          </Typography>
        </TableCell>
        <TableCell>
          <Rating
            value={Number(row.rating) || 0}
            size="small"
            readOnly
            precision={0.5}
          />
        </TableCell>
        <TableCell>
          <TruncatedText text={row.review} limit={60} />
        </TableCell>
        <TableCell>
          <Chip
            label={row.marketplace || "N/A"}
            size="small"
            sx={{
              borderRadius: 1,
              bgcolor:
                row.marketplace?.toLowerCase() === "amazon"
                  ? "#fff7ed"
                  : row.marketplace?.toLowerCase() === "flipkart"
                  ? "#eff6ff"
                  : "#f3f4f6",
              color:
                row.marketplace?.toLowerCase() === "amazon"
                  ? "#c2410c"
                  : row.marketplace?.toLowerCase() === "flipkart"
                  ? "#1d4ed8"
                  : "#374151",
              fontWeight: 600,
            }}
          />
        </TableCell>
        <TableCell align="center">
          {row.clickedMarketplaceButton ? (
            <Tooltip title="User clicked 'Post Review'">
              <Inventory2OutlinedIcon color="success" fontSize="small" />
            </Tooltip>
          ) : (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "grey.300",
                mx: "auto",
              }}
            />
          )}
        </TableCell>
      </TableRow>
      {/* Expanded Details */}
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: "#fafafa",
          }}
          colSpan={8}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                fontSize="1rem"
              >
                Detailed Feedback
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Order #
                        </TableCell>
                        <TableCell>{row.orderNumber || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Phone
                        </TableCell>
                        <TableCell>{row.phoneNumber || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Campaign
                        </TableCell>
                        <TableCell>{row.campaignName}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 1,
                      border: "1px solid #eee",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="text.secondary"
                    >
                      Full Review:
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {row.review || "No written review provided."}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        pt: 1,
                        borderTop: "1px dashed #eee",
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      {row.satisfaction && (
                        <Chip
                          label={`Satisfaction: ${row.satisfaction}`}
                          size="small"
                        />
                      )}
                      {row.usedMoreDays && (
                        <Chip
                          label={`Used >7 Days: ${row.usedMoreDays}`}
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// 2. Sortable Header
function SortableHeader({ label, property, orderBy, order, onSort, width }) {
  return (
    <TableCell
      width={width}
      sortDirection={orderBy === property ? order : false}
      sx={{ fontWeight: 600, color: "text.secondary" }}
    >
      <TableSortLabel
        active={orderBy === property}
        direction={orderBy === property ? order : "asc"}
        onClick={() => onSort(property)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}

// 3. Stat Card
function StatCard({ title, value, loading, icon, color }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        p: 2,
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        {loading ? (
          <Skeleton width={60} height={32} />
        ) : (
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {value}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

// 4. Skeleton Row
function TableSkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="circular" width={24} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton width={120} />
        </Box>
      </TableCell>
      <TableCell>
        <Skeleton width={100} />
        <Skeleton width={60} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} />
      </TableCell>
      <TableCell>
        <Skeleton width={200} />
      </TableCell>
      <TableCell>
        <Skeleton width={60} />
      </TableCell>
      <TableCell>
        <Skeleton width={20} />
      </TableCell>
    </TableRow>
  );
}
