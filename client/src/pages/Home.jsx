// import React, { useEffect, useState } from "react";
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
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchSummary();
//     fetchCampaigns();
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     if (selectedCampaignId) {
//       fetchReviewsForCampaign(selectedCampaignId);
//     } else {
//       fetchAllReviews();
//     }
//   }, [selectedCampaignId]);

//   async function fetchSummary() {
//     setLoadingSummary(true);
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

//       setStats({
//         products: productData.products?.length || 0,
//         campaigns: campaignData.campaigns?.length || 0,
//         promotions: promotionData.promotions?.length || 0,
//         reviews: reviewsData.total || reviewsData.count || 0,
//       });
//     } catch (error) {
//       console.error("Failed to fetch summary", error);
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
//     } catch (error) {
//       console.error("Failed to fetch campaigns", error);
//     }
//   }

//   async function fetchAllReviews() {
//     setLoadingReviews(true);
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/public/reviews`, { headers });
//       const data = await res.json();
//       setReviews(data.reviews || []);
//     } catch (error) {
//       console.error("Failed to fetch all reviews", error);
//       setReviews([]);
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   async function fetchReviewsForCampaign(id) {
//     setLoadingReviews(true);
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/public/campaign/${id}/reviews`, {
//         headers,
//       });
//       const data = await res.json();
//       setReviews(data.reviews || []);
//     } catch (error) {
//       console.error(`Failed to fetch reviews for campaign ${id}`, error);
//       setReviews([]);
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   // Convert JSON array to CSV string
//   function arrayToCSV(data) {
//     if (!data.length) return "";

//     const headers = Object.keys(data[0]);
//     const csvRows = [
//       headers.join(","),
//       ...data.map((row) =>
//         headers
//           .map((field) => {
//             let val = row[field];
//             if (val === null || val === undefined) val = "";
//             else if (typeof val === "string") {
//               val = val.replace(/"/g, '""');
//               if (val.search(/("|,|\\n)/g) >= 0) {
//                 val = `"${val}"`;
//               }
//             }
//             return val;
//           })
//           .join(",")
//       ),
//     ];
//     return csvRows.join("\n");
//   }

//   // Trigger CSV download of reviews
//   function downloadCSV() {
//     if (!reviews.length) {
//       alert("No reviews available to download");
//       return;
//     }

//     // Flatten nested fields for CSV
//     const csvData = reviews.map(
//       ({
//         _id,
//         createdAt,
//         campaign,
//         product,
//         customerName,
//         email,
//         phoneNumber,
//         review,
//       }) => ({
//         ID: _id,
//         Date: new Date(createdAt).toLocaleString(),
//         Campaign: campaign?.name || "",
//         Product: product?.name || "",
//         CustomerName: customerName || "",
//         Email: email || "",
//         Review: review || "",
//         PhoneNumber: phoneNumber || "",
//       })
//     );

//     const csvString = arrayToCSV(csvData);
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

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Dashboard Summary
//         </h1>

//         {/* Summary Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Products</h3>
//             <p className="text-3xl font-semibold text-blue-600">
//               {loadingSummary ? "..." : stats.products}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Campaigns</h3>
//             <p className="text-3xl font-semibold text-green-600">
//               {loadingSummary ? "..." : stats.campaigns}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Promotions</h3>
//             <p className="text-3xl font-semibold text-purple-600">
//               {loadingSummary ? "..." : stats.promotions}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Reviews</h3>
//             <p className="text-3xl font-semibold text-orange-600">
//               {loadingSummary ? "..." : stats.reviews}
//             </p>
//           </div>
//         </div>

//         {/* Campaign Selector */}
//         <div className="mb-6">
//           <label
//             htmlFor="campaign"
//             className="block text-gray-700 font-semibold mb-2"
//           >
//             Select Campaign
//           </label>
//           <select
//             id="campaign"
//             className="border rounded p-2 w-full max-w-md"
//             value={selectedCampaignId}
//             onChange={(e) => setSelectedCampaignId(e.target.value)}
//           >
//             <option value="">All Campaigns</option>
//             {campaigns.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Download CSV button */}
//         <div className="mb-4 flex justify-end">
//           <button
//             onClick={downloadCSV}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Download CSV
//           </button>
//         </div>

//         {/* Reviews Table */}
//         <div className="bg-white rounded-lg shadow overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Date
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Campaign
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Product
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Customer Name
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Email
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Phone Number
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Review
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loadingReviews ? (
//                 <tr>
//                   <td colSpan={6} className="text-center p-4 text-gray-600">
//                     Loading reviews...
//                   </td>
//                 </tr>
//               ) : reviews.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center p-4 text-gray-400">
//                     No reviews found.
//                   </td>
//                 </tr>
//               ) : (
//                 reviews.map((r) => (
//                   <tr key={r._id} className="border-b">
//                     <td className="px-4 py-2">
//                       {new Date(r.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-2">{r.campaign?.name || "-"}</td>
//                     <td className="px-4 py-2">{r.product?.name || "-"}</td>
//                     <td className="px-4 py-2">{r.customerName || "-"}</td>
//                     <td className="px-4 py-2">{r.email || "-"}</td>
//                     <td className="px-4 py-2">{r.phoneNumber || "-"}</td>
//                     <td className="px-4 py-2 max-w-2xl whitespace-pre-wrap">
//                       {r.review}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Paper,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ReviewsRoundedIcon from "@mui/icons-material/ReviewsRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
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
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSummary();
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      fetchReviewsForCampaign(selectedCampaignId);
    } else {
      fetchAllReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.error("Failed to fetch summary", err);
      setError("Failed to load dashboard summary.");
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
      console.error("Failed to fetch all reviews", err);
      setReviews([]);
      setError("Failed to load reviews.");
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
      console.error(`Failed to fetch reviews for campaign ${id}`, err);
      setReviews([]);
      setError("Failed to load campaign reviews.");
    } finally {
      setLoadingReviews(false);
    }
  }

  // Convert JSON array to CSV string
  function arrayToCSV(data) {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((field) => {
            let val = row[field];
            if (val === null || val === undefined) val = "";
            else if (typeof val === "string") {
              val = val.replace(/"/g, '""');
              if (val.search(/("|,|\\n)/g) >= 0) {
                val = `"${val}"`;
              }
            }
            return val;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  }

  // Trigger CSV download of reviews
  function downloadCSV() {
    if (!reviews.length) {
      alert("No reviews available to download");
      return;
    }

    // Flatten nested fields for CSV
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

    const csvString = arrayToCSV(csvData);
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
    <Box
      sx={{
        // minHeight: "100vh",
        // pb: 6,
        pt: 0,
        mb: 0,
        background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Dashboard Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High-level stats and recent reviews
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={downloadCSV}
            startIcon={<FileDownloadRoundedIcon />}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              fontWeight: 700,
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #6d28d9)",
              },
            }}
          >
            Download CSV
          </Button>
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                mb={1}
              >
                <Inventory2RoundedIcon color="primary" />
                <Typography variant="overline" color="text.secondary">
                  Products
                </Typography>
              </Stack>
              {loadingSummary ? (
                <Skeleton
                  variant="text"
                  width={60}
                  height={36}
                  sx={{ mx: "auto" }}
                />
              ) : (
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {stats.products}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                mb={1}
              >
                <CampaignRoundedIcon color="success" />
                <Typography variant="overline" color="text.secondary">
                  Campaigns
                </Typography>
              </Stack>
              {loadingSummary ? (
                <Skeleton
                  variant="text"
                  width={60}
                  height={36}
                  sx={{ mx: "auto" }}
                />
              ) : (
                <Typography variant="h4" fontWeight={800} color="success.main">
                  {stats.campaigns}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                mb={1}
              >
                <LocalOfferRoundedIcon color="secondary" />
                <Typography variant="overline" color="text.secondary">
                  Promotions
                </Typography>
              </Stack>
              {loadingSummary ? (
                <Skeleton
                  variant="text"
                  width={60}
                  height={36}
                  sx={{ mx: "auto" }}
                />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="secondary.main"
                >
                  {stats.promotions}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                mb={1}
              >
                <ReviewsRoundedIcon color="warning" />
                <Typography variant="overline" color="text.secondary">
                  Reviews
                </Typography>
              </Stack>
              {loadingSummary ? (
                <Skeleton
                  variant="text"
                  width={60}
                  height={36}
                  sx={{ mx: "auto" }}
                />
              ) : (
                <Typography variant="h4" fontWeight={800} color="warning.main">
                  {stats.reviews}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Campaign Selector */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="campaign-label">Select Campaign</InputLabel>
              <Select
                labelId="campaign-label"
                label="Select Campaign"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
              >
                <MenuItem value="">All Campaigns</MenuItem>
                {campaigns.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!!selectedCampaignId && (
              <Chip
                label="Filtered"
                color="info"
                onDelete={() => setSelectedCampaignId("")}
                sx={{ borderRadius: 2 }}
              />
            )}
          </Stack>
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Reviews Table */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table stickyHeader size="small" aria-label="reviews table">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 700 } }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingReviews ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0 }}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" fontWeight={800} gutterBottom>
                        No reviews found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try selecting a different campaign.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((r) => (
                    <TableRow hover key={r._id}>
                      <TableCell>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography noWrap title={r.campaign?.name || "-"}>
                          {r.campaign?.name || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap title={r.product?.name || "-"}>
                          {r.product?.name || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap title={r.customerName || "-"}>
                          {r.customerName || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap title={r.email || "-"}>
                          {r.email || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap title={r.phoneNumber || "-"}>
                          {r.phoneNumber || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 560 }}>
                        <Typography
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          title={r.review}
                        >
                          {r.review}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loadingReviews && reviews.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: 2, textAlign: "right", color: "text.secondary" }}>
                <Typography variant="caption">
                  Showing {reviews.length} review{reviews.length > 1 ? "s" : ""}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
