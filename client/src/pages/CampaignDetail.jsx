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
  // Button,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from "@mui/material";
import Button from "../components/base/Button";
import {
  ArrowBackRounded,
  ContentCopyRounded,
  OpenInNewRounded,
  DownloadRounded,
  QrCodeScannerRounded,
  TaskAltRounded,
  EmojiEventsRounded,
  TrendingUpRounded,
  ImageRounded,
  CodeRounded,
  PhotoSizeSelectActualRounded,
  Circle,
} from "@mui/icons-material";
import { API_URL } from "../config/api";
import QRCode from "react-qr-code";

export default function CampaignDetail() {
  const theme = useTheme();
  const { id } = useParams();

  // State
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Download Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const openDownloadMenu = Boolean(anchorEl);

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

  const publicURL = `https://reviu.store/campaign/${id}`;

  // --- Handlers ---

  const handleCopy = () => {
    navigator.clipboard.writeText(publicURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Downloads the QR Code in the specified format.
   * Uses HTML Canvas for rasterization (PNG/JPG).
   */
  const downloadQR = (format) => {
    handleMenuClose();
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const fileName = `campaign_${campaign?.name?.replace(/\s+/g, "_")}_qr`;

    if (format === "svg") {
      // Direct SVG Download
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${fileName}.svg`);
    } else {
      // Canvas conversion for PNG/JPEG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      // Add padding (white space) around the QR code
      const padding = 40;
      const size = 256; // Base resolution

      // Serialize SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = size + padding * 2;
        canvas.height = size + padding * 2;

        // Fill white background (for JPEGs transparent becomes black otherwise)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw SVG onto canvas
        ctx.drawImage(img, padding, padding, size, size);

        // Convert to data URL
        const imgUrl = canvas.toDataURL(`image/${format}`);
        triggerDownload(imgUrl, `${fileName}.${format}`);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const triggerDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Render Components ---

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: 3, mb: 3 }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!campaign) return null;

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" sx={{ mb: 3, color: "text.secondary" }}>
          <Link
            component={RouterLink}
            to="/campaigns"
            underline="hover"
            color="inherit"
          >
            Campaigns
          </Link>
          <Typography color="text.primary" fontWeight={500}>
            {campaign.name}
          </Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={700} letterSpacing="-0.5px">
              {campaign.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<Circle sx={{ fontSize: "10px !important" }} />}
                label={campaign.status.toUpperCase()}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor:
                    campaign.status === "active"
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.grey[500], 0.1),
                  color:
                    campaign.status === "active"
                      ? "success.main"
                      : "text.secondary",
                  border: "1px solid",
                  borderColor:
                    campaign.status === "active"
                      ? alpha(theme.palette.success.main, 0.2)
                      : "transparent",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Created on {new Date(campaign.createdAt).toLocaleDateString()}
              </Typography>
            </Stack>
          </Stack>

          <Button
            icon={<ArrowBackRounded />}
            to="/campaigns"
            variant="secondary"
            className="rounded-lg normal-case font-semibold"
          >
            Back to List
          </Button>
        </Stack>

        {/* Analytics Grid */}
        <Grid container spacing={3} mb={4}>
          <StatsCard
            title="Total Scans"
            value={campaign.analytics?.totalScans || 0}
            icon={<QrCodeScannerRounded />}
            color={theme.palette.primary.main}
          />
          <StatsCard
            title="Completions"
            value={campaign.analytics?.totalCompletions || 0}
            icon={<TaskAltRounded />}
            color={theme.palette.info.main}
          />
          {/* <StatsCard
            title="Redemptions"
            value={campaign.analytics?.totalRedemptions || 0}
            icon={<EmojiEventsRounded />}
            color={theme.palette.warning.main}
          /> */}
          <StatsCard
            title="Conversion Rate"
            value={
              (campaign.analytics?.conversionRate?.toFixed?.(1) || 0) + "%"
            }
            icon={<TrendingUpRounded />}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid container spacing={4}>
          {/* Left Column: Campaign Info */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Campaign Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>
                  <DetailRow
                    label="Campaign ID"
                    value={campaign._id}
                    copyable
                  />
                  <DetailRow label="Public Link" value={publicURL} copyable />
                  {/* Add more campaign details here if available in your schema, e.g. Products linked */}
                  {campaign.products && campaign.products.length > 0 && (
                    <Box mt={2}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Linked Products
                      </Typography>
                      {/* <Stack direction="row" spacing={1} flexWrap="wrap">
                        {campaign.products.map((p, i) => (
                          <Chip key={i} label={p.name} size="small" />
                        ))}
                      </Stack> */}
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: QR Code Action Center */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "white",
                overflow: "visible", // For shadow effects
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  QR Code Asset
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Scan to view the public campaign page.
                </Typography>

                {/* QR Display */}
                <Box
                  sx={{
                    display: "inline-block",
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    mb: 4,
                  }}
                >
                  {/* 

[Image of QR code generation process]
 */}
                  <QRCode
                    id="qr-code-svg"
                    value={publicURL}
                    size={200}
                    level="H" // High error correction for better printing
                  />
                </Box>

                {/* Actions */}
                <Stack direction="column" spacing={2}>
                  <Button
                    fullWidth
                    variant="primary"
                    size="lg"
                    icon={<DownloadRounded />}
                    onClick={handleMenuClick}
                    className="py-3 rounded-lg font-semibold shadow-lg"
                  >
                    Download QR Code
                  </Button>

                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="secondary"
                      icon={<ContentCopyRounded />}
                      onClick={handleCopy}
                      className="rounded-lg"
                    >
                      Copy Link
                    </Button>
                    <Button
                      fullWidth
                      variant="secondary"
                      icon={<OpenInNewRounded />}
                      onClick={() => window.open(publicURL, "_blank")}
                      className="rounded-lg"
                    >
                      Test Link
                    </Button>
                  </Stack>
                </Stack>

                {/* Download Menu Dropdown */}
                <Menu
                  anchorEl={anchorEl}
                  open={openDownloadMenu}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 4,
                    sx: { borderRadius: 2, mt: 1, minWidth: 200 },
                  }}
                >
                  <MenuItem onClick={() => downloadQR("png")}>
                    <ListItemIcon>
                      <ImageRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Download PNG"
                      secondary="High Quality Image"
                    />
                  </MenuItem>
                  <MenuItem onClick={() => downloadQR("jpeg")}>
                    <ListItemIcon>
                      <PhotoSizeSelectActualRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Download JPEG"
                      secondary="Standard Image"
                    />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => downloadQR("svg")}>
                    <ListItemIcon>
                      <CodeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Download SVG"
                      secondary="Vector (Scalable)"
                    />
                  </MenuItem>
                </Menu>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notifications */}
        <Snackbar
          open={copied}
          message="Link copied to clipboard!"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={3000}
          onClose={() => setCopied(false)}
        />
      </Container>
    </Box>
  );
}

// --- Sub-components for cleaner code ---

function StatsCard({ title, value, icon, color }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              bgcolor: alpha(color, 0.1),
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

function DetailRow({ label, value, copyable }) {
  // const [showCopy, setShowCopy] = useState(false);

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(value);
  //   setShowCopy(true);
  //   setTimeout(() => setShowCopy(false), 2000);
  // };

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography
          variant="body1"
          sx={{
            wordBreak: "break-all",
            fontFamily: copyable ? "monospace" : "inherit",
          }}
        >
          {value}
        </Typography>
        {/* {copyable && (
          <Tooltip title={showCopy ? "Copied!" : "Copy"}>
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyRounded fontSize="small" sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )} */}
      </Stack>
    </Box>
  );
}
