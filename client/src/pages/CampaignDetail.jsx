// import React, { useEffect, useState } from "react";
// import { useParams, Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Stack,
//   Typography,
//   Breadcrumbs,
//   Link,
//   Chip,
//   Grid,
//   Paper,
//   Skeleton,
//   Alert,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   IconButton,
// } from "@mui/material";
// import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
// import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
// import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
// import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
// import StarRoundedIcon from "@mui/icons-material/StarRounded";
// import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
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
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/campaigns/${id}`, {
//         headers: { Authorization: token },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");
//       setCampaign(data);
//     } catch (err) {
//       setError(err.message);
//       setCampaign(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const publicURL = `${window.location.origin}/campaign/${id}`;

//   function copyToClipboard(text, message = "Copied to clipboard!") {
//     navigator.clipboard.writeText(text);
//     alert(message);
//   }

//   function downloadQR() {
//     if (!campaign?.qrCodeUrl) return;
//     const link = document.createElement("a");
//     link.href = `https://reviu.store/campaign/${campaign._id}`;
//     link.download = `campaign_${campaign._id}_qr.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//   if (loading) {
//     return (
//       <Container maxWidth="lg">
//         <Skeleton variant="rectangular" height={120} />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg">
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   if (!campaign) return null;

//   return (
//     <Container maxWidth="lg">
//       {/* Breadcrumb + Header */}
//       <Stack spacing={2} mb={3}>
//         <Breadcrumbs separator="›">
//           <Link component={RouterLink} to="/campaigns">
//             Campaigns
//           </Link>
//           <Typography>{campaign.name}</Typography>
//         </Breadcrumbs>

//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Stack spacing={1}>
//             <Typography variant="h4">{campaign.name}</Typography>
//             <Stack direction="row" spacing={1}>
//               <Chip
//                 icon={
//                   campaign.category === "promotion" ? (
//                     <RedeemRoundedIcon />
//                   ) : (
//                     <StarRoundedIcon />
//                   )
//                 }
//                 label={`${campaign.category} Campaign`.toUpperCase()}
//               />
//               <Chip
//                 label={campaign.status.toUpperCase()}
//                 color={campaign.status === "active" ? "success" : "default"}
//               />
//               <Chip
//                 icon={<LaunchRoundedIcon />}
//                 label={new Date(campaign.createdAt).toLocaleDateString()}
//               />
//             </Stack>
//           </Stack>
//           <Stack direction="row" spacing={1}>
//             <Button
//               startIcon={<ArrowBackRoundedIcon />}
//               component={RouterLink}
//               to="/campaigns"
//             >
//               Back
//             </Button>
//             <Button
//               startIcon={<EditRoundedIcon />}
//               component={RouterLink}
//               to={`/campaigns/${campaign._id}/edit`}
//             >
//               Edit
//             </Button>
//           </Stack>
//         </Stack>
//       </Stack>

//       {/* Analytics */}
//       <Grid container spacing={2} mb={3}>
//         {[
//           { label: "Total Scans", value: campaign.analytics?.totalScans || 0 },
//           {
//             label: "Completions",
//             value: campaign.analytics?.totalCompletions || 0,
//           },
//           {
//             label: "Redemptions",
//             value: campaign.analytics?.totalRedemptions || 0,
//           },
//           {
//             label: "Conversion",
//             value:
//               (campaign.analytics?.conversionRate?.toFixed?.(1) || 0) + "%",
//           },
//         ].map((stat, idx) => (
//           <Grid item xs={6} md={3} key={idx}>
//             <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
//               <Typography variant="h6">{stat.value}</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {stat.label}
//               </Typography>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       <Stack spacing={3}>
//         {/* Campaign Details */}
//         <Card>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Campaign Details
//             </Typography>
//             <Divider sx={{ mb: 2 }} />
//             <Typography>Name: {campaign.name}</Typography>
//             <Typography>Category: {campaign.category}</Typography>
//             <Typography>Status: {campaign.status.toUpperCase()}</Typography>
//           </CardContent>
//         </Card>

//         {/* Products */}
//         <Card>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Associated Products
//             </Typography>
//             <Divider sx={{ mb: 2 }} />
//             {(campaign.products || []).length > 0 ? (
//               <Grid container spacing={2}>
//                 {campaign.products.map((p) => (
//                   <Grid item xs={12} md={6} key={p._id}>
//                     <Paper sx={{ p: 2 }}>
//                       <Typography variant="subtitle1">{p.name}</Typography>
//                       <Typography variant="body2">{p.marketplace}</Typography>
//                       {p.marketplaceProductId && (
//                         <Typography variant="caption">
//                           ID: {p.marketplaceProductId}
//                         </Typography>
//                       )}
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : (
//               <Typography color="text.secondary">
//                 No products linked.
//               </Typography>
//             )}
//           </CardContent>
//         </Card>

//         {/* Public Form */}
//         <Card>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Public Form
//             </Typography>
//             <Divider sx={{ mb: 2 }} />
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <Typography>{publicURL}</Typography>
//               <IconButton onClick={() => copyToClipboard(publicURL)}>
//                 <ContentCopyRoundedIcon />
//               </IconButton>
//               <IconButton
//                 component="a"
//                 href={publicURL}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <OpenInNewRoundedIcon />
//               </IconButton>
//             </Stack>
//           </CardContent>
//         </Card>

//         {/* QR Code */}
//         <Card>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               QR Code
//             </Typography>
//             <Divider sx={{ mb: 2 }} />

//             <Stack direction="row" alignItems="center" spacing={2}>
//               <img
//                 src={`https://reviu.store/campaign/${campaign._id}`}
//                 alt="QR"
//                 width={120}
//                 height={120}
//               />
//               <Stack direction="row" spacing={1}>
//                 <IconButton
//                   onClick={() =>
//                     window.open(
//                       `https://reviu.store/campaign/${campaign._id}`,
//                       "_blank"
//                     )
//                   }
//                 >
//                   <OpenInNewRoundedIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={() =>
//                     copyToClipboard(
//                       `https://reviu.store/campaign/${campaign._id}`
//                     )
//                   }
//                 >
//                   <ContentCopyRoundedIcon />
//                 </IconButton>
//                 <IconButton onClick={downloadQR}>
//                   <DownloadRoundedIcon />
//                 </IconButton>
//               </Stack>
//             </Stack>
//           </CardContent>
//         </Card>
//       </Stack>
//     </Container>
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
  Card,
  CardContent,
  Divider,
  IconButton,
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
import QRCode from "react-qr-code";

export default function CampaignDetail() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchCampaign();
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

  const publicURL = `${window.location.origin}/campaign/${id}`;

  function copyToClipboard(text, message = "Copied to clipboard!") {
    navigator.clipboard.writeText(text);
    alert(message);
  }

  function downloadQR() {
    // Download SVG QR code
    const svg = document.querySelector("#qr-code-svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `campaign_${campaign._id}_qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="rectangular" height={120} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!campaign) return null;

  return (
    <Container maxWidth="lg">
      {/* Breadcrumb + Header */}
      <Stack spacing={2} mb={3}>
        <Breadcrumbs separator="›">
          <Link component={RouterLink} to="/campaigns">
            Campaigns
          </Link>
          <Typography>{campaign.name}</Typography>
        </Breadcrumbs>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={1}>
            <Typography variant="h4">{campaign.name}</Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={
                  campaign.category === "promotion" ? (
                    <RedeemRoundedIcon />
                  ) : (
                    <StarRoundedIcon />
                  )
                }
                label={`${campaign.category} Campaign`.toUpperCase()}
              />
              <Chip
                label={campaign.status.toUpperCase()}
                color={campaign.status === "active" ? "success" : "default"}
              />
              <Chip
                icon={<LaunchRoundedIcon />}
                label={new Date(campaign.createdAt).toLocaleDateString()}
              />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              component={RouterLink}
              to="/campaigns"
            >
              Back
            </Button>
            <Button
              startIcon={<EditRoundedIcon />}
              component={RouterLink}
              to={`/campaigns/${campaign._id}/edit`}
            >
              Edit
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Analytics */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Total Scans", value: campaign.analytics?.totalScans || 0 },
          {
            label: "Completions",
            value: campaign.analytics?.totalCompletions || 0,
          },
          {
            label: "Redemptions",
            value: campaign.analytics?.totalRedemptions || 0,
          },
          {
            label: "Conversion",
            value:
              (campaign.analytics?.conversionRate?.toFixed?.(1) || 0) + "%",
          },
        ].map((stat, idx) => (
          <Grid item xs={6} md={3} key={idx}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">{stat.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Stack spacing={3}>
        {/* Campaign Details */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Campaign Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>Name: {campaign.name}</Typography>
            <Typography>Category: {campaign.category}</Typography>
            <Typography>Status: {campaign.status.toUpperCase()}</Typography>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Associated Products
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {(campaign.products || []).length > 0 ? (
              <Grid container spacing={2}>
                {campaign.products.map((p) => (
                  <Grid item xs={12} md={6} key={p._id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1">{p.name}</Typography>
                      <Typography variant="body2">{p.marketplace}</Typography>
                      {p.marketplaceProductId && (
                        <Typography variant="caption">
                          ID: {p.marketplaceProductId}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">
                No products linked.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Public Form */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Public Form
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>{publicURL}</Typography>
              <IconButton onClick={() => copyToClipboard(publicURL)}>
                <ContentCopyRoundedIcon />
              </IconButton>
              <IconButton
                component="a"
                href={publicURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNewRoundedIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              QR Code
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1, background: "#fff", borderRadius: 1 }}>
                <QRCode
                  id="qr-code-svg"
                  value={`https://reviu.store/campaign/${campaign._id}`}
                  size={120}
                  bgColor="#fff"
                  fgColor="#000"
                  level="Q"
                  style={{ width: 120, height: 120 }}
                />
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() =>
                    window.open(
                      `https://reviu.store/campaign/${campaign._id}`,
                      "_blank"
                    )
                  }
                >
                  <OpenInNewRoundedIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    copyToClipboard(
                      `https://reviu.store/campaign/${campaign._id}`
                    )
                  }
                >
                  <ContentCopyRoundedIcon />
                </IconButton>
                <IconButton onClick={downloadQR}>
                  <DownloadRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
