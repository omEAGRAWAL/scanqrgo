// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";

// //env from .env
// import { API_URL } from "../config/api";

// export default function CampaignDetail() {
//   const [campaign, setCampaign] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { id } = useParams();

//   useEffect(() => {
//     fetchCampaign();
//   }, [id]);

//   async function fetchCampaign() {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/campaigns/${id}`, {
//         headers: { Authorization: token },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");

//       setCampaign(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function getCategoryIcon(category) {
//     return category === "promotion" ? "🎁" : "⭐";
//   }

//   function getStatusColor(status) {
//     const colors = {
//       active: "bg-green-100 text-green-800 border-green-200",
//       paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       ended: "bg-red-100 text-red-800 border-red-200",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading campaign...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             to="/campaigns"
//             className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
//           >
//             <span className="mr-2">←</span>
//             Back to Campaigns
//           </Link>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <span className="text-5xl">
//                 {getCategoryIcon(campaign.category)}
//               </span>
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900">
//                   {campaign.name}
//                 </h1>
//                 <div className="flex items-center space-x-3 mt-2">
//                   <span className="capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {campaign.category} Campaign
//                   </span>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
//                       campaign.status
//                     )}`}
//                   >
//                     {campaign.status}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-2xl shadow-lg">
//             <div className="text-3xl font-bold text-blue-600">
//               {campaign.analytics?.totalScans || 0}
//             </div>
//             <div className="text-sm text-gray-600">Total Scans</div>
//             <div className="text-xs text-gray-400 mt-1">QR code scans</div>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-lg">
//             <div className="text-3xl font-bold text-green-600">
//               {campaign.analytics?.totalCompletions || 0}
//             </div>
//             <div className="text-sm text-gray-600">Completions</div>
//             <div className="text-xs text-gray-400 mt-1">Funnel completed</div>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-lg">
//             <div className="text-3xl font-bold text-purple-600">
//               {campaign.analytics?.totalRedemptions || 0}
//             </div>
//             <div className="text-sm text-gray-600">Redemptions</div>
//             <div className="text-xs text-gray-400 mt-1">Rewards claimed</div>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-lg">
//             <div className="text-3xl font-bold text-orange-600">
//               {campaign.analytics?.conversionRate?.toFixed(1) || 0}%
//             </div>
//             <div className="text-sm text-gray-600">Conversion</div>
//             <div className="text-xs text-gray-400 mt-1">Completion rate</div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Campaign Details */}
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Campaign Details
//               </h2>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Campaign Name
//                   </label>
//                   <p className="text-lg font-semibold text-gray-900">
//                     {campaign.name}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Type
//                   </label>
//                   <p className="text-lg font-semibold text-gray-900 capitalize">
//                     {campaign.category}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Status
//                   </label>
//                   <span
//                     className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                       campaign.status
//                     )}`}
//                   >
//                     {campaign.status}
//                   </span>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Created
//                   </label>
//                   <p className="text-lg font-semibold text-gray-900">
//                     {new Date(campaign.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Products */}
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Associated Products
//               </h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {campaign.products?.map((product) => (
//                   <div
//                     key={product._id}
//                     className="p-4 border border-gray-200 rounded-xl"
//                   >
//                     <h3 className="font-semibold text-gray-900">
//                       {product.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {product.marketplace}
//                     </p>
//                     {product.marketplaceProductId && (
//                       <p className="text-xs text-gray-500 mt-1">
//                         ID: {product.marketplaceProductId}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Promotion Details (if promotion campaign) */}
//             {campaign.category === "promotion" && campaign.promotion && (
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                   Promotion Details
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       Promotion Name
//                     </label>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {campaign.promotion.name}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       Type
//                     </label>
//                     <p className="text-lg font-semibold text-gray-900 capitalize">
//                       {campaign.promotion.type}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       Description
//                     </label>
//                     <p className="text-gray-700">
//                       {campaign.promotion.description}
//                     </p>
//                   </div>
//                   {campaign.promotionSettings && (
//                     <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500 mb-1">
//                           Code Type
//                         </label>
//                         <p className="text-gray-900 capitalize">
//                           {campaign.promotionSettings.codeType}
//                         </p>
//                       </div>
//                       {campaign.promotionSettings.maxRedemptions && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             Max Redemptions
//                           </label>
//                           <p className="text-gray-900">
//                             {campaign.promotionSettings.maxRedemptions}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           {/* Public Form Link - Add this in the sidebar section */}
//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">
//               Public Form
//             </h3>
//             <div className="space-y-3">
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-600 mb-2">Public Form URL:</p>
//                 <code className="text-xs bg-gray-100 p-2 rounded block break-all">
//                   {window.location.origin}/campaign/{campaign._id}
//                 </code>
//               </div>
//               <button
//                 onClick={() => {
//                   const url = `${window.location.origin}/campaign/${campaign._id}`;
//                   navigator.clipboard.writeText(url);
//                   alert("Public form link copied to clipboard!");
//                 }}
//                 className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
//               >
//                 Copy Public Form Link
//               </button>
//               <a
//                 href={`/campaign/${campaign._id}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
//               >
//                 Preview Form
//               </a>
//             </div>
//           </div>
//           <div className="space-y-8">
//             {/* QR Code */}
//             <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code</h3>
//               {campaign.qrCodeUrl ? (
//                 <div>
//                   <img
//                     src={campaign.qrCodeUrl}
//                     alt="Campaign QR Code"
//                     className="mx-auto mb-4 border rounded-lg"
//                   />
//                   <button
//                     onClick={() => window.open(campaign.qrCodeUrl, "_blank")}
//                     className="text-blue-600 hover:underline text-sm"
//                   >
//                     View Full Size
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-gray-500">QR Code not generated</div>
//               )}
//             </div>

//             {/* Customization */}
//             {campaign.customization && (
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">
//                   Customization
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-gray-600">
//                       Primary Color
//                     </span>
//                     <div
//                       className="w-6 h-6 rounded border"
//                       style={{
//                         backgroundColor: campaign.customization.primaryColor,
//                       }}
//                     ></div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-gray-600">
//                       Background
//                     </span>
//                     <span className="text-sm text-gray-900 capitalize">
//                       {campaign.customization.backgroundStyle}
//                     </span>
//                   </div>
//                   {campaign.customization.customMessage && (
//                     <div>
//                       <span className="text-sm font-medium text-gray-600 block mb-1">
//                         Message
//                       </span>
//                       <p className="text-sm text-gray-900">
//                         {campaign.customization.customMessage}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Actions */}
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
//               <div className="space-y-3">
//                 <Link
//                   to={`/campaigns/${campaign._id}/edit`}
//                   className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
//                 >
//                   Edit Campaign
//                 </Link>
//                 <button
//                   onClick={() => {
//                     // Copy campaign link to clipboard
//                     navigator.clipboard.writeText(
//                       `https://yourapp.com/campaign/${campaign._id}`
//                     );
//                     alert("Campaign link copied to clipboard!");
//                   }}
//                   className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
//                 >
//                   Copy Link
//                 </button>
//                 <Link
//                   to="/campaigns"
//                   className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center block"
//                 >
//                   Back to Campaigns
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Alert,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { API_URL } from "../config/api";

export default function CampaignDetail() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchCampaign() {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/campaigns/${id}`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");
      setCampaign(data);
    } catch (err) {
      setError(err.message);
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  }

  function getCategoryIcon(category) {
    return category === "promotion" ? (
      <RedeemRoundedIcon color="secondary" />
    ) : (
      <StarRoundedIcon color="info" />
    );
  }

  function getStatusChip(status) {
    const map = {
      active: { color: "success", label: "ACTIVE" },
      paused: { color: "warning", label: "PAUSED" },
      ended: { color: "error", label: "ENDED" },
    };
    return (
      map[status] || { color: "default", label: (status || "").toUpperCase() }
    );
  }

  const publicURL = `${window.location.origin}/campaign/${id}`;

  function copyToClipboard(text, message = "Copied to clipboard!") {
    navigator.clipboard.writeText(text);
    alert(message);
  }

  function downloadQR() {
    if (!campaign?.qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = campaign.qrCodeUrl;
    link.download = `campaign_${campaign._id}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 12 }, pb: 6 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={220} height={40} />
          </Stack>
          <Grid container spacing={2} mb={3}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="text" width={80} height={36} />
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Skeleton variant="text" width={200} />
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              </Paper>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Skeleton variant="text" width={200} />
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              </Paper>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Skeleton variant="text" width={220} />
                <Skeleton
                  variant="rectangular"
                  height={140}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Skeleton variant="text" width={140} />
                <Skeleton
                  variant="rectangular"
                  height={120}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              </Paper>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Skeleton variant="text" width={140} />
                <Skeleton
                  variant="rectangular"
                  height={160}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)",
        }}
      >
        <Container maxWidth="sm" sx={{ pt: { xs: 14, md: 16 } }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  if (!campaign) return null;

  const statusChip = getStatusChip(campaign.status);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 12 }, pb: 6 }}>
        {/* Header */}
        <Stack spacing={1} mb={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link component={RouterLink} color="inherit" to="/campaigns">
              Campaigns
            </Link>
            <Typography color="text.primary" noWrap title={campaign.name}>
              {campaign.name}
            </Typography>
          </Breadcrumbs>
        </Stack>

        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: 3,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ fontSize: 40, lineHeight: 1 }}>
                {getCategoryIcon(campaign.category)}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {campaign.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    size="small"
                    label={`${campaign.category} Campaign`.toUpperCase()}
                    color="info"
                  />
                  <Chip
                    size="small"
                    label={statusChip.label}
                    color={statusChip.color}
                  />
                  <Chip
                    size="small"
                    icon={<LaunchRoundedIcon fontSize="small" />}
                    label={new Date(campaign.createdAt).toLocaleDateString()}
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                component={RouterLink}
                to="/campaigns"
              >
                Back
              </Button>
              <Button
                variant="contained"
                startIcon={<EditRoundedIcon />}
                component={RouterLink}
                to={`/campaigns/${campaign._id}/edit`}
              >
                Edit
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Total Scans
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {campaign.analytics?.totalScans || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                QR code scans
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Completions
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {campaign.analytics?.totalCompletions || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Funnel completed
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Redemptions
              </Typography>
              <Typography variant="h4" fontWeight={800} color="secondary.main">
                {campaign.analytics?.totalRedemptions || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rewards claimed
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Conversion
              </Typography>
              <Typography variant="h4" fontWeight={800} color="warning.main">
                {(campaign.analytics?.conversionRate?.toFixed?.(1) || 0) + "%"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completion rate
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Main column */}
          <Grid item xs={12} lg={8}>
            {/* Campaign Details */}
            <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <CardHeader title="Campaign Details" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Campaign Name
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {campaign.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {campaign.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box mt={0.5}>
                      <Chip
                        size="small"
                        label={statusChip.label}
                        color={statusChip.color}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Associated Products */}
            <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <CardHeader title="Associated Products" />
              <CardContent>
                <Grid container spacing={2}>
                  {(campaign.products || []).map((product) => (
                    <Grid item xs={12} md={6} key={product._id}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.marketplace}
                        </Typography>
                        {!!product.marketplaceProductId && (
                          <Typography variant="caption" color="text.secondary">
                            ID: {product.marketplaceProductId}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                  {(!campaign.products || campaign.products.length === 0) && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        No products linked.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Promotion Details */}
            {campaign.category === "promotion" && campaign.promotion && (
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Promotion Details" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Promotion Name
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {campaign.promotion.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Type
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {campaign.promotion.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body2">
                        {campaign.promotion.description}
                      </Typography>
                    </Grid>
                  </Grid>

                  {campaign.promotionSettings && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">
                            Code Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {campaign.promotionSettings.codeType}
                          </Typography>
                        </Grid>
                        {campaign.promotionSettings.maxRedemptions && (
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Max Redemptions
                            </Typography>
                            <Typography variant="body2">
                              {campaign.promotionSettings.maxRedemptions}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Public Form */}
            <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <CardHeader title="Public Form" />
              <CardContent>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Public Form URL
                  </Typography>
                  <Typography
                    component="code"
                    sx={{
                      display: "block",
                      mt: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: "grey.50",
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                      wordBreak: "break-all",
                      fontSize: 12,
                    }}
                  >
                    {publicURL}
                  </Typography>
                </Paper>

                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<ContentCopyRoundedIcon />}
                    onClick={() =>
                      copyToClipboard(publicURL, "Public form link copied!")
                    }
                  >
                    Copy Link
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    endIcon={<OpenInNewRoundedIcon />}
                    component="a"
                    href={publicURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card
              elevation={3}
              sx={{ borderRadius: 3, textAlign: "center", mb: 3 }}
            >
              <CardHeader title="QR Code" />
              <CardContent>
                {campaign.qrCodeUrl ? (
                  <>
                    <Box
                      component="img"
                      src={campaign.qrCodeUrl}
                      alt="Campaign QR Code"
                      sx={{
                        mx: "auto",
                        mb: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        width: 220,
                        height: 220,
                        objectFit: "contain",
                        backgroundColor: "white",
                      }}
                    />
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Open full size">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            window.open(campaign.qrCodeUrl, "_blank")
                          }
                        >
                          <OpenInNewRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy image URL">
                        <IconButton
                          color="info"
                          onClick={() =>
                            copyToClipboard(
                              campaign.qrCodeUrl,
                              "QR image URL copied!"
                            )
                          }
                        >
                          <ContentCopyRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PNG">
                        <IconButton color="success" onClick={downloadQR}>
                          <DownloadRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    QR Code not generated
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Customization */}
            {campaign.customization && (
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Customization" />
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption" color="text.secondary">
                        Primary Color
                      </Typography>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor:
                            campaign.customization.primaryColor || "#000",
                        }}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption" color="text.secondary">
                        Background
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {campaign.customization.backgroundStyle}
                      </Typography>
                    </Stack>
                    {campaign.customization.customMessage && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Message
                        </Typography>
                        <Typography variant="body2">
                          {campaign.customization.customMessage}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card elevation={3} sx={{ borderRadius: 3, mt: 3 }}>
              <CardHeader title="Actions" />
              <CardContent>
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EditRoundedIcon />}
                    component={RouterLink}
                    to={`/campaigns/${campaign._id}/edit`}
                  >
                    Edit Campaign
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => {
                      const link = `${window.location.origin}/campaign/${campaign._id}`;
                      copyToClipboard(
                        link,
                        "Campaign link copied to clipboard!"
                      );
                    }}
                  >
                    Copy Link
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={RouterLink}
                    to="/campaigns"
                  >
                    Back to Campaigns
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
