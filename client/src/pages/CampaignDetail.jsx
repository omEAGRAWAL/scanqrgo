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
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  ArrowBackRounded,
  EditRounded,
  ContentCopyRounded,
  OpenInNewRounded,
  DownloadRounded,
  RedeemRounded,
  StarRounded,
  LaunchRounded,
} from "@mui/icons-material";
import { API_URL } from "../config/api";
import QRCode from "react-qr-code";

export default function CampaignDetail() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
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

  const publicURL = `https://reviu.store/campaign/${id}`;

  function copyToClipboardOnce(text) {
    if (copied) return; // Prevent multiple copies
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset after 3s
  }

  function downloadQR() {
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!campaign) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb + Header */}
      <Stack spacing={2} mb={3}>
        <Breadcrumbs separator="›" sx={{ color: "text.secondary" }}>
          <Link component={RouterLink} to="/campaigns" underline="hover">
            Campaigns
          </Link>
          <Typography color="text.primary">{campaign.name}</Typography>
        </Breadcrumbs>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={600}>
              {campaign.name}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {/* <Chip
                icon={
                  campaign.category === "promotion" ? (
                    <RedeemRounded />
                  ) : (
                    <StarRounded />
                  )
                }
                label={`${campaign.category} Campaign`}
                color="primary"
                variant="outlined"
              /> */}
              <Chip
                label={campaign.status.toUpperCase()}
                color={campaign.status === "active" ? "success" : "default"}
              />
              <Chip
                icon={<LaunchRounded />}
                label={new Date(campaign.createdAt).toLocaleDateString()}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackRounded />}
              component={RouterLink}
              to="/campaigns"
              variant="outlined"
            >
              Back
            </Button>
            {/* <Button
              startIcon={<EditRounded />}
              component={RouterLink}
              to={`/campaigns/${campaign._id}/edit`}
              variant="contained"
            >
              Edit
            </Button> */}
          </Stack>
        </Stack>
      </Stack>

      {/* Analytics */}
      <Grid container spacing={2} mb={4}>
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
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Stack spacing={3}>
        {/* <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Associated Products
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {(campaign.products || []).length > 0 ? (
              <Grid container spacing={2}>
                {campaign.products.map((p) => (
                  <Grid item xs={12} sm={6} md={4} key={p._id}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        transition: "0.3s",
                        "&:hover": { boxShadow: 4 },
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={500}>
                        {p.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.marketplace || "N/A"}
                      </Typography>
                      {p.marketplaceProductId && (
                        <Typography variant="caption" color="text.secondary">
                          ID: {p.marketplaceProductId}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">
                No products linked to this campaign.
              </Typography>
            )}
          </CardContent>
        </Card> */}

        {/* QR Code */}
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              QR Code
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              spacing={3}
            >
              <Box
                sx={{
                  p: 2,
                  background: "#fff",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <QRCode
                  id="qr-code-svg"
                  value={publicURL}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewRounded />}
                  onClick={() => window.open(publicURL, "_blank")}
                >
                  Open
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyRounded />}
                  onClick={() => copyToClipboardOnce(publicURL)}
                >
                  Copy Link
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadRounded />}
                  onClick={downloadQR}
                >
                  Download QR
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Snackbar for Copy */}
      <Snackbar
        open={copied}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
      />
    </Container>
  );
}
