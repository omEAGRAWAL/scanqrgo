import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormLabel,
  // RadioGroup, // Not used anymore
  // Radio,      // Not used anymore
  Rating,
  Alert,
  CircularProgress,
  Avatar,
  // Chip,       // Not used anymore
  Divider,
  Stack,
  Skeleton,
  Snackbar,
  Fade,
  Paper,
  // Container, // Not used anymore
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  stepConnectorClasses,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ShoppingCart,
  Person,
  RateReview,
  // Celebration, // Not used
  Error as ErrorIcon,
  Star,
  StarBorder,
  Store,
  ContentCopy,
  EmailOutlined,
  PhoneOutlined,
  BadgeOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { API_URL } from "../config/api";
import { SiFlipkart } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Button from "../components/base/Button";

// --- Styled Components ---

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#f4f6f8",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 550,
  borderRadius: "8px",
  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    minHeight: "85vh",
  },
  [theme.breakpoints.up("sm")]: {
    minHeight: 650,
  },
}));

const GradientHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "primaryColor",
})(({ theme, primaryColor }) => ({
  background: primaryColor
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${alpha(
      primaryColor,
      0.8
    )} 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "white",
  padding: theme.spacing(3, 3, 5, 3),
  textAlign: "center",
  position: "relative",
  marginBottom: theme.spacing(-3),
  flexShrink: 0,
}));

const ScrollableContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": { width: 0, height: 0 },
}));

// Custom Stepper Connector
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[200],
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const MarketplaceButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "brandColor",
})(({ theme, selected, brandColor }) => ({
  border: `2px solid ${selected ? brandColor : theme.palette.grey[300]}`,
  backgroundColor: selected ? alpha(brandColor, 0.05) : "transparent",
  color: selected ? brandColor : theme.palette.text.secondary,
  justifyContent: "flex-start",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  "&:hover": {
    border: `2px solid ${brandColor}`,
    backgroundColor: alpha(brandColor, 0.05),
  },
}));

const steps = [
  { label: "Product", icon: <ShoppingCart fontSize="small" /> },
  { label: "Details", icon: <Person fontSize="small" /> },
  { label: "Review", icon: <RateReview fontSize="small" /> },
];

function mapRatingToSatisfaction(rating) {
  if (!rating) return "";
  if (rating >= 4) return "Very satisfied";
  if (rating === 3) return "Somewhat satisfied";
  return "Not satisfied";
}

export default function PublicCampaignForm({ previewMode = false, previewData = null }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [campaign, setCampaign] = useState(previewMode ? previewData : null);
  const [loading, setLoading] = useState(previewMode ? false : true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [response, setResponse] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  const [form, setForm] = useState({
    selectedProduct: "",
    orderNumber: "",
    satisfaction: 0,
    usedMoreDays: "",
    customerName: "",
    email: "",
    phoneNumber: "",
    review: "",
    clickedMarketplaceButton: false,
    marketplace: "",
    customFields: {},
  });

  // --- Hooks ---
  const selectedProduct = useMemo(
    () => campaign?.products?.find((p) => p._id === form.selectedProduct),
    [campaign?.products, form.selectedProduct]
  );

  const marketplaces = useMemo(() => {
    if (!selectedProduct) return [];
    const arr = [];
    const addedNames = new Set();

    // Legacy marketplace fields
    if (selectedProduct.amazonAsin) {
      arr.push({
        name: "Amazon",
        color: "#FF9500",
        icon: <FaAmazon style={{ fontSize: 20 }} />,
        url: `https://www.amazon.in/review/review-your-purchases/?asin=${encodeURIComponent(
          selectedProduct.amazonAsin
        )}`,
      });
      addedNames.add("Amazon");
    }
    if (selectedProduct.flipkartFsn) {
      arr.push({
        name: "Flipkart",
        color: "#2874F0",
        icon: <SiFlipkart style={{ fontSize: 20 }} />,
        url: "https://www.flipkart.com/",
      });
      addedNames.add("Flipkart");
    }

    // New flexible marketplaceSources
    if (selectedProduct.marketplaceSources?.length) {
      selectedProduct.marketplaceSources.forEach((source) => {
        const mpName = source.marketplace;
        if (addedNames.has(mpName)) return; // skip duplicates
        addedNames.add(mpName);

        // Determine color and icon based on known marketplace names
        let color = "#666";
        let icon = <Store style={{ fontSize: 20 }} />;
        let url = "";

        const nameLower = mpName.toLowerCase();
        if (nameLower.includes("amazon")) {
          color = "#FF9500";
          icon = <FaAmazon style={{ fontSize: 20 }} />;
          url = `https://www.amazon.in/review/review-your-purchases/?asin=${encodeURIComponent(source.productId)}`;
        } else if (nameLower.includes("flipkart")) {
          color = "#2874F0";
          icon = <SiFlipkart style={{ fontSize: 20 }} />;
          url = "https://www.flipkart.com/";
        }

        arr.push({ name: mpName, color, icon, url });
      });
    }

    return arr;
  }, [selectedProduct]);

  const selectedMarketplaceConfig = useMemo(() => {
    if (!selectedProduct) return null;
    const chosen = marketplaces.find((m) => m.name === form.marketplace);
    if (chosen) return chosen;
    if (marketplaces.length === 1) return marketplaces[0];
    return null;
  }, [selectedProduct, marketplaces, form.marketplace]);

  useEffect(() => {
    if (previewMode) {
      setCampaign(previewData);
      setLoading(false);
    } else if (id) {
      fetchCampaign();
    }
  }, [id, previewMode, previewData]);

  useEffect(() => {
    if (campaign?.products?.length === 1 && !form.selectedProduct) {
      setForm((prev) => ({
        ...prev,
        selectedProduct: campaign.products[0]._id,
      }));
    }
  }, [campaign?.products, form.selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      if (form.marketplace) {
        setForm((prev) => ({ ...prev, marketplace: "" }));
      }
      return;
    }

    if (marketplaces.length === 1 && form.marketplace !== marketplaces[0].name) {
      // Auto-select if only one marketplace
      setForm((prev) => ({ ...prev, marketplace: marketplaces[0].name }));
    } else if (marketplaces.length > 1) {
      // Multiple marketplaces — keep selection if valid, otherwise clear
      const validNames = marketplaces.map((m) => m.name);
      if (form.marketplace && !validNames.includes(form.marketplace)) {
        setForm((prev) => ({ ...prev, marketplace: "" }));
      }
    } else if (marketplaces.length === 0 && form.marketplace) {
      setForm((prev) => ({ ...prev, marketplace: "" }));
    }
  }, [selectedProduct, marketplaces, form.marketplace]);

  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/public/campaign/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Campaign not found");
      setCampaign(data.campaign);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [formErrors]
  );

  const handleRatingChange = useCallback((event, newValue) => {
    setForm((prev) => ({ ...prev, satisfaction: newValue || 0 }));
  }, []);

  const handleToggleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setForm((prev) => ({ ...prev, usedMoreDays: newAlignment }));
      if (formErrors.usedMoreDays)
        setFormErrors((prev) => ({ ...prev, usedMoreDays: "" }));
    }
  };

  const handleMarketplaceSelect = (marketplaceName) => {
    setForm((prev) => ({ ...prev, marketplace: marketplaceName }));
    if (formErrors.marketplace)
      setFormErrors((prev) => ({ ...prev, marketplace: "" }));
  };

  const handleShareReview = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(form.review || "");
        setCopied(true);
      }
    } catch {
      // Ignore clipboard errors
    } finally {
      if (selectedMarketplaceConfig?.url) {
        setForm((prev) => ({ ...prev, clickedMarketplaceButton: true }));
        window.open(
          selectedMarketplaceConfig.url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }
  }, [form.review, selectedMarketplaceConfig]);

  // --- Amazon auto-redirect after submission ---
  useEffect(() => {
    if (
      currentStep !== 3 ||
      !form.marketplace.toLowerCase().includes("amazon") ||
      form.satisfaction < 4 ||
      !selectedMarketplaceConfig?.url
    ) {
      return;
    }

    // Copy review text to clipboard
    if (navigator?.clipboard?.writeText && form.review) {
      navigator.clipboard.writeText(form.review).then(() => {
        setCopied(true);
      }).catch(() => { });
    }

    // Start 5-second countdown
    let count = 5;
    setRedirectCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setRedirectCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setForm((prev) => ({ ...prev, clickedMarketplaceButton: true }));
        window.open(selectedMarketplaceConfig.url, "_blank", "noopener,noreferrer");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, form.marketplace, form.satisfaction, form.review, selectedMarketplaceConfig]);

  const handleSubmit = useCallback(async () => {
    // In preview mode, just show thank you page
    if (previewMode) {
      setCurrentStep(3);
      setSuccess("Preview: Form submitted successfully!");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const satisfactionText = mapRatingToSatisfaction(form.satisfaction);
      const submission = {
        ...form,
        satisfaction: satisfactionText,
        rating: form.satisfaction,
        marketplace: form.marketplace || selectedMarketplaceConfig?.name || "",
        customFields: form.customFields || {},
      };

      const res = await fetch(`${API_URL}/public/campaign/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit form");
      setResponse(data);
      console.log("Submission response:", response);
      setSuccess("Form submitted successfully!");
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [id, form, selectedMarketplaceConfig, previewMode]);

  // --- Dynamic Form Fields Helpers ---
  const hasCustomFormFields = campaign?.formFields?.length > 0;

  const getStepFields = useCallback(
    (step) => {
      if (!hasCustomFormFields) return null; // fallback to hardcoded
      return campaign.formFields
        .filter((f) => f.step === step)
        .sort((a, b) => a.order - b.order);
    },
    [campaign?.formFields, hasCustomFormFields]
  );

  const handleCustomFieldChange = useCallback(
    (fieldId, value) => {
      setForm((prev) => ({
        ...prev,
        customFields: { ...prev.customFields, [fieldId]: value },
      }));
      if (formErrors[fieldId]) setFormErrors((prev) => ({ ...prev, [fieldId]: "" }));
    },
    [formErrors]
  );

  // Get current value for a field (checks both regular form state and customFields)
  const getFieldValue = useCallback(
    (field) => {
      // System/known fields are in the main form state
      const knownKeys = [
        "selectedProduct", "orderNumber", "satisfaction", "usedMoreDays",
        "customerName", "email", "phoneNumber", "review", "marketplace",
      ];
      if (knownKeys.includes(field.id)) return form[field.id];
      return form.customFields?.[field.id] || "";
    },
    [form]
  );

  const setFieldValue = useCallback(
    (field, value) => {
      const knownKeys = [
        "selectedProduct", "orderNumber", "satisfaction", "usedMoreDays",
        "customerName", "email", "phoneNumber", "review", "marketplace",
      ];
      if (knownKeys.includes(field.id)) {
        setForm((prev) => ({ ...prev, [field.id]: value }));
        if (formErrors[field.id]) setFormErrors((prev) => ({ ...prev, [field.id]: "" }));
      } else {
        handleCustomFieldChange(field.id, value);
      }
    },
    [formErrors, handleCustomFieldChange]
  );

  // Render a single dynamic field
  const renderDynamicField = useCallback(
    (field) => {
      const value = getFieldValue(field);
      const error = formErrors[field.id];

      switch (field.type) {
        case "product_select":
          // Use the existing product select UI
          return (
            <FormControl key={field.id} fullWidth error={!!error} variant="outlined">
              <InputLabel>{field.label}</InputLabel>
              <Select
                name="selectedProduct"
                value={form.selectedProduct}
                onChange={handleChange}
                label={field.label}
                renderValue={(selected) => {
                  const p = campaign?.products?.find((prod) => prod._id === selected);
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <Typography noWrap sx={{ maxWidth: "100%" }}>{p?.name}</Typography>
                    </Box>
                  );
                }}
              >
                {campaign?.products?.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%", overflow: "hidden" }}>
                      <Avatar src={product.imageurl} alt={product.name} variant="rounded" sx={{ width: 40, height: 40, bgcolor: "grey.100", flexShrink: 0 }}>
                        <ShoppingCart fontSize="small" />
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">{product.brand}</Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              {error && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{error}</Typography>}
            </FormControl>
          );

        case "marketplace_select": {
          if (!selectedProduct || marketplaces.length <= 1) return null;
          return (
            <Box key={field.id}>
              <FormLabel component="legend" sx={{ mb: 1.5, fontSize: "0.9rem" }}>{field.label}</FormLabel>
              <Stack direction="row" spacing={2}>
                {marketplaces.map((mp) => (
                  <MarketplaceButton key={mp.name} fullWidth selected={form.marketplace === mp.name} brandColor={mp.color} onClick={() => handleMarketplaceSelect(mp.name)} startIcon={mp.icon}>{mp.name}</MarketplaceButton>
                ))}
              </Stack>
              {error && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{error}</Typography>}
            </Box>
          );
        }

        case "rating":
          return (
            <Box key={field.id} sx={{ textAlign: "center", py: 1 }}>
              <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>{field.label}</Typography>
              <Rating
                name="satisfaction"
                value={Number(form.satisfaction)}
                onChange={handleRatingChange}
                size="large"
                icon={<Star fontSize="inherit" color="primary" />}
                emptyIcon={<StarBorder fontSize="inherit" />}
                sx={{ fontSize: "3rem" }}
              />
              {error && <Typography variant="caption" color="error" display="block">{error}</Typography>}
            </Box>
          );

        case "toggle":
          return (
            <Box key={field.id}>
              <Typography component="legend" gutterBottom sx={{ fontSize: "0.9rem", color: "text.secondary" }}>{field.label}</Typography>
              <ToggleButtonGroup
                value={value}
                exclusive
                onChange={(e, newVal) => { if (newVal !== null) setFieldValue(field, newVal); }}
                fullWidth
                color="primary"
                size="small"
              >
                {(field.options?.length ? field.options : ["Yes", "No"]).map((opt) => (
                  <ToggleButton key={opt} value={opt}>{opt}</ToggleButton>
                ))}
              </ToggleButtonGroup>
              {error && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{error}</Typography>}
            </Box>
          );

        case "textarea":
          return (
            <TextField
              key={field.id}
              fullWidth
              name={field.id}
              label={field.label}
              multiline
              minRows={4}
              value={value}
              onChange={(e) => setFieldValue(field, e.target.value)}
              error={!!error}
              helperText={error || (field.id === "review" ? `${(value || "").length} characters` : "")}
              placeholder={field.placeholder || ""}
            />
          );

        case "select":
          return (
            <FormControl key={field.id} fullWidth error={!!error} variant="outlined">
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={value}
                onChange={(e) => setFieldValue(field, e.target.value)}
                label={field.label}
              >
                {(field.options || []).map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
              {error && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{error}</Typography>}
            </FormControl>
          );

        case "email":
          return (
            <TextField
              key={field.id}
              fullWidth
              name={field.id}
              label={field.label}
              type="email"
              value={value}
              onChange={(e) => setFieldValue(field, e.target.value)}
              error={!!error}
              helperText={error}
              placeholder={field.placeholder || ""}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlined color="action" /></InputAdornment>,
              }}
            />
          );

        case "tel":
          return (
            <TextField
              key={field.id}
              fullWidth
              name={field.id}
              label={field.label}
              type="tel"
              value={value}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFieldValue(field, val);
              }}
              error={!!error}
              helperText={error}
              placeholder={field.placeholder || "9876543210"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlined color="action" />
                  </InputAdornment>
                ),
              }}
            />
          );

        case "number":
          return (
            <TextField
              key={field.id}
              fullWidth
              name={field.id}
              label={field.label}
              type="number"
              value={value}
              onChange={(e) => setFieldValue(field, e.target.value)}
              error={!!error}
              helperText={error}
              placeholder={field.placeholder || ""}
            />
          );

        case "text":
        default:
          return (
            <TextField
              key={field.id}
              fullWidth
              name={field.id}
              label={field.label}
              value={value}
              onChange={(e) => setFieldValue(field, e.target.value)}
              error={!!error}
              helperText={error || (field.placeholder ? field.placeholder : "")}
              placeholder={field.placeholder || ""}
              InputProps={{
                startAdornment: field.id === "orderNumber" ? (
                  <InputAdornment position="start"><BadgeOutlined color="action" /></InputAdornment>
                ) : field.id === "customerName" ? (
                  <InputAdornment position="start"><Person color="action" /></InputAdornment>
                ) : undefined,
              }}
            />
          );
      }
    },
    [form, formErrors, campaign, selectedProduct, handleChange, handleRatingChange, handleMarketplaceSelect, getFieldValue, setFieldValue]
  );

  const validateStep = useCallback(
    (step) => {
      const errors = {};

      if (hasCustomFormFields) {
        // Dynamic validation based on formFields config
        const stepFields = getStepFields(step);
        if (stepFields) {
          stepFields.forEach((field) => {
            const value = getFieldValue(field);
            if (field.required) {
              if (field.type === "rating") {
                if (!form.satisfaction) errors[field.id] = "Please rate your satisfaction";
              } else if (field.type === "product_select") {
                if (!form.selectedProduct) errors[field.id] = "Please select a product";
              } else if (field.type === "marketplace_select") {
                if (marketplaces.length > 1 && !form.marketplace) errors[field.id] = "Please select a marketplace";
              } else if (field.type === "toggle") {
                if (!value) errors[field.id] = "Please select an option";
              } else if (typeof value === "string" && !value.trim()) {
                errors[field.id] = `${field.label} is required`;
              }
            }
            // Type-specific validation
            if (value && field.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
              errors[field.id] = "Please enter a valid email";
            }
            if (value && field.type === "tel" && !/^\d{10}$/.test(value)) {
              errors[field.id] = "Please enter a valid 10-digit phone number";
            }
            if (field.id === "review" && field.required) {
              const minLen = campaign?.reviewMinimumLength || 0;
              if (value && campaign?.category === "review" && minLen > 0 && value.length < minLen) {
                errors[field.id] = `Review must be at least ${minLen} characters`;
              }
            }
          });
        }
      } else {
        // Legacy hardcoded validation
        switch (step) {
          case 0: {
            if (!form.selectedProduct) errors.selectedProduct = "Please select a product";
            if (!form.orderNumber.trim()) errors.orderNumber = "Order number is required";
            if (!form.satisfaction) errors.satisfaction = "Please rate your satisfaction";
            if (!form.usedMoreDays) errors.usedMoreDays = "Please select an option";
            if (marketplaces.length > 1 && !form.marketplace) errors.marketplace = "Please select a marketplace";
            break;
          }
          case 1:
            if (!form.customerName.trim()) errors.customerName = "Name is required";
            if (!form.email.trim()) { errors.email = "Email is required"; } else if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = "Please enter a valid email"; }
            if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) { errors.phoneNumber = "Please enter a valid 10-digit phone number"; }
            break;
          case 2: {
            const minLen = campaign?.reviewMinimumLength || 0;
            if (!form.review.trim()) { errors.review = "Review is required"; } else if (campaign?.category === "review" && minLen > 0 && form.review.length < minLen) { errors.review = `Review must be at least ${minLen} characters`; }
            break;
          }
          default: break;
        }
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [form, campaign, selectedProduct, marketplaces, hasCustomFormFields, getStepFields, getFieldValue]
  );

  const handleNext = useCallback(() => {
    if (!validateStep(currentStep)) {
      setError("Please fix the errors highlighted above");
      return;
    }
    setError("");
    if (currentStep === 2) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, validateStep, handleSubmit]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setError("");
  }, []);

  // --- Rendering Steps ---

  const renderStep0 = () => {
    // DYNAMIC: if formFields are configured, render from config
    const stepFields = getStepFields(0);
    if (stepFields) {
      return (
        <Stack spacing={3}>
          {stepFields.map((field) => renderDynamicField(field))}
        </Stack>
      );
    }

    // LEGACY: hardcoded fallback
    const multipleMarketplaces = marketplaces.length > 1;

    return (
      <Stack spacing={3}>
        <FormControl fullWidth error={!!formErrors.selectedProduct} variant="outlined">
          <InputLabel>Select Product</InputLabel>
          <Select
            name="selectedProduct"
            value={form.selectedProduct}
            onChange={handleChange}
            label="Select Product"
            renderValue={(selected) => {
              const p = campaign?.products?.find((prod) => prod._id === selected);
              return (
                <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                  <Typography noWrap sx={{ maxWidth: "100%" }}>{p?.name}</Typography>
                </Box>
              );
            }}
          >
            {campaign?.products?.map((product) => (
              <MenuItem key={product._id} value={product._id}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%", overflow: "hidden" }}>
                  <Avatar src={product.imageurl} alt={product.name} variant="rounded" sx={{ width: 40, height: 40, bgcolor: "grey.100", flexShrink: 0 }}>
                    <ShoppingCart fontSize="small" />
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{product.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">{product.brand}</Typography>
                  </Box>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          {formErrors.selectedProduct && (<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{formErrors.selectedProduct}</Typography>)}
        </FormControl>

        {selectedProduct && multipleMarketplaces && (
          <Box>
            <FormLabel component="legend" sx={{ mb: 1.5, fontSize: "0.9rem" }}>Where did you purchase this item?</FormLabel>
            <Stack direction="row" spacing={2}>
              {marketplaces.map((mp) => (
                <MarketplaceButton key={mp.name} fullWidth selected={form.marketplace === mp.name} brandColor={mp.color} onClick={() => handleMarketplaceSelect(mp.name)} startIcon={mp.icon}>{mp.name}</MarketplaceButton>
              ))}
            </Stack>
          </Box>
        )}

        <TextField fullWidth name="orderNumber" label="Order ID" value={form.orderNumber} onChange={handleChange} error={!!formErrors.orderNumber} helperText={formErrors.orderNumber || "Found in your order history"} InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeOutlined color="action" /></InputAdornment>) }} />

        <Box sx={{ textAlign: "center", py: 1 }}>
          <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>How would you rate your experience?</Typography>
          <Rating name="satisfaction" value={Number(form.satisfaction)} onChange={handleRatingChange} size="large" icon={<Star fontSize="inherit" color="primary" />} emptyIcon={<StarBorder fontSize="inherit" />} sx={{ fontSize: "3rem" }} />
          {formErrors.satisfaction && (<Typography variant="caption" color="error" display="block">{formErrors.satisfaction}</Typography>)}
        </Box>

        <Box>
          <Typography component="legend" gutterBottom sx={{ fontSize: "0.9rem", color: "text.secondary" }}>Have you used this product for more than 7 days?</Typography>
          <ToggleButtonGroup value={form.usedMoreDays} exclusive onChange={handleToggleChange} fullWidth color="primary" size="small">
            <ToggleButton value="Yes">Yes</ToggleButton>
            <ToggleButton value="No">No</ToggleButton>
          </ToggleButtonGroup>
          {formErrors.usedMoreDays && (<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{formErrors.usedMoreDays}</Typography>)}
        </Box>
      </Stack>
    );
  };

  const renderStep1 = () => {
    // DYNAMIC: render from formFields if configured
    const stepFields = getStepFields(1);
    if (stepFields) {
      return (
        <Stack spacing={3} sx={{ py: 1 }}>

          {stepFields.map((field) => renderDynamicField(field))}
        </Stack>
      );
    }

    // LEGACY: hardcoded fallback
    return (
      <Stack spacing={3} sx={{ py: 1 }}>

        <TextField fullWidth name="customerName" label="Full Name" value={form.customerName} onChange={handleChange} error={!!formErrors.customerName} helperText={formErrors.customerName || ""} InputProps={{ startAdornment: (<InputAdornment position="start"><Person color="action" /></InputAdornment>) }} />
        <TextField fullWidth name="email" label="Email Address" type="email" value={form.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlined color="action" /></InputAdornment>) }} />
        <TextField
          fullWidth
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          value={form.phoneNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            setForm((prev) => ({ ...prev, phoneNumber: val }));
            if (formErrors.phoneNumber) setFormErrors((prev) => ({ ...prev, phoneNumber: "" }));
          }}
          error={!!formErrors.phoneNumber}
          helperText={formErrors.phoneNumber}
          placeholder="9876543210"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneOutlined color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    );
  };

  const renderStep2 = () => {
    // DYNAMIC: render from formFields if configured
    const stepFields = getStepFields(2);
    if (stepFields) {
      return (
        <Stack spacing={3} alignItems="center" sx={{ py: 1 }}>
          {selectedProduct && (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
              <Avatar src={selectedProduct.imageurl} variant="rounded" sx={{ width: 80, height: 80, flexShrink: 0 }}><ShoppingCart /></Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap title={selectedProduct.name}>{selectedProduct.name}</Typography>
                <Typography variant="body2" color="text.secondary">Tell us what you think</Typography>
              </Box>
            </Stack>
          )}
          {stepFields.map((field) => renderDynamicField(field))}
          {selectedMarketplaceConfig && form.satisfaction >= 4 && (
            <Paper variant="outlined" sx={{ p: 2, width: "100%", bgcolor: alpha(selectedMarketplaceConfig.color, 0.05), borderColor: alpha(selectedMarketplaceConfig.color, 0.2) }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Store sx={{ color: selectedMarketplaceConfig.color }} />
                  <Typography variant="subtitle2" sx={{ color: selectedMarketplaceConfig.color, fontWeight: "bold" }}>Share your experience on  {selectedMarketplaceConfig.name}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">If you’d like, post your review on Amazon to help other buyers.</Typography>
                {/* <MuiButton fullWidth variant="contained" onClick={handleShareReview} startIcon={<ContentCopy />} sx={{ bgcolor: selectedMarketplaceConfig.color, "&:hover": { bgcolor: alpha(selectedMarketplaceConfig.color, 0.9) } }}>Copy Text & Open {selectedMarketplaceConfig.name}</MuiButton> */}
              </Stack>
            </Paper>
          )}
        </Stack>
      );
    }

    // LEGACY: hardcoded fallback
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 1 }}>
        {selectedProduct && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%", p: 2, bgcolor: "grey.50", borderRadius: "8px", overflow: "hidden" }}>
            <Avatar src={selectedProduct.imageurl} variant="rounded" sx={{ width: 60, height: 60, flexShrink: 0 }}><ShoppingCart /></Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap title={selectedProduct.name}>{selectedProduct.name}</Typography>
              <Typography variant="body2" color="text.secondary">Tell us what you think</Typography>
            </Box>
          </Stack>
        )}
        <TextField fullWidth name="review" label="Write your review" multiline minRows={4} value={form.review} onChange={handleChange} error={!!formErrors.review} helperText={formErrors.review || `${form.review.length} characters`} placeholder="What did you like? What could be improved?" />
        {selectedMarketplaceConfig && form.satisfaction >= 4 && (
          <Paper variant="outlined" sx={{ p: 2, width: "100%", bgcolor: alpha(selectedMarketplaceConfig.color, 0.05), borderColor: alpha(selectedMarketplaceConfig.color, 0.2) }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Store sx={{ color: selectedMarketplaceConfig.color }} />
                <Typography variant="subtitle2" sx={{ color: selectedMarketplaceConfig.color, fontWeight: "bold" }}>Share on {selectedMarketplaceConfig.name}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">Copy your review and paste it on {selectedMarketplaceConfig.name} to help others.</Typography>
              <MuiButton fullWidth variant="contained" onClick={handleShareReview} startIcon={<ContentCopy />} sx={{ bgcolor: selectedMarketplaceConfig.color, "&:hover": { bgcolor: alpha(selectedMarketplaceConfig.color, 0.9) } }}>Copy Text & Open {selectedMarketplaceConfig.name}</MuiButton>
            </Stack>
          </Paper>
        )}
      </Stack>
    );
  };

  const renderStep3 = () => {
    // Support both inlinePromotion and promotion
    const promotion = campaign?.inlinePromotion || campaign?.promotion;
    const promoType = promotion?.type;

    let successMessage = "";
    let emailMessage = "";

    if (promoType === "extended warranty") {
      const period = promotion?.warrantyPeriod || "Extended Warranty";
      successMessage = `You have successfully registered for the ${period} for ${selectedProduct?.name || "your product"}.`;
    } else if (promoType === "discount code") {
      successMessage = `You have unlocked your coupon code!`;
      emailMessage = `Details have been sent to ${form.email}.`;
    } else if (promoType === "custom") {
      const offering = promotion?.offering || "special offer";
      successMessage = `You have successfully claimed: ${offering}!`;
      emailMessage = `Details have been sent to ${form.email}.`;
    } else {
      successMessage = `Thank you for your submission!`;
      emailMessage = `Details have been sent to ${form.email}.`;
    }

    return (
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: 4 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: "success.light", mb: 2 }}>
          <CheckCircleOutline sx={{ fontSize: 50, color: "white" }} />
        </Avatar>

        <Typography variant="h4" fontWeight="800" color="success.main">
          Success!
        </Typography>

        {/* Amazon auto-redirect countdown banner */}
        {form.marketplace?.toLowerCase().includes("amazon") && form.satisfaction >= 4 && redirectCountdown !== null && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              width: "100%",
              bgcolor: alpha("#FF9500", 0.08),
              border: "1px solid",
              borderColor: alpha("#FF9500", 0.3),
              borderRadius: "8px",
            }}
          >
            <Stack spacing={1} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <FaAmazon style={{ fontSize: 20, color: "#FF9500" }} />
                <Typography variant="subtitle2" sx={{ color: "#FF9500", fontWeight: "bold" }}>
                  {redirectCountdown > 0
                    ? `Your review has been copied! Redirecting to Amazon in ${redirectCountdown}s...`
                    : "Opening Amazon review page..."}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Paste your review on Amazon to help other buyers
              </Typography>
            </Stack>
          </Paper>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          {successMessage}
        </Typography>
        {emailMessage && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mt: 1 }}>
            {emailMessage}
          </Typography>
        )}

        {/* Display promotion details */}
        {/* {promotion && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "grey.50",
              borderRadius: "8px",
              width: "100%",
              textAlign: "left",
              border: "1px solid #e0e0e0",
            }}
          >

            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Offer Title
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {promotion.offerTitle}
                </Typography>
              </Box>

              {promoType === "extended warranty" && promotion.warrantyPeriod && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Warranty Period
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {promotion.warrantyPeriod}
                  </Typography>
                </Box>
              )}

              {promoType === "discount code" && promotion.couponCode && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Discount Code
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "monospace", bgcolor: "white", p: 1, borderRadius: "8px", display: "inline-block" }}>
                    {promotion.couponCode}
                  </Typography>
                </Box>
              )}

              {promoType === "custom" && promotion.offering && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Your Offering
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {promotion.offering}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        )} */}

        {/* Terms & Conditions */}
        {promotion?.termsAndConditions && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "grey.50",
              borderRadius: "8px",
              width: "100%",
              textAlign: "left",
              border: "1px dashed #ccc",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Terms & Conditions
            </Typography>
            <div className="prose prose-sm max-w-none text-gray-600">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {promotion.termsAndConditions}
              </ReactMarkdown>
            </div>
          </Paper>
        )}
      </Stack>
    );
  };

  // --- Main Render ---

  if (error && !campaign) {
    return (
      <PageWrapper>
        <StyledCard>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <ErrorIcon
              color="error"
              sx={{ fontSize: 60, mb: 2, opacity: 0.8 }}
            />
            <Typography variant="h6" gutterBottom>
              Campaign Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {error}
            </Typography>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </CardContent>
        </StyledCard>
      </PageWrapper>
    );
  }

  if (loading) {
    return (
      <PageWrapper>
        <StyledCard>
          <Skeleton variant="rectangular" height={140} />
          <CardContent>
            <Skeleton height={40} width="60%" sx={{ mb: 2, mx: "auto" }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={100} />
          </CardContent>
        </StyledCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <StyledCard>
        {/* Header */}
        <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
          {campaign?.seller?.logoUrl && (
            <Box
              component="img"
              src={campaign.seller.logoUrl}
              alt="Logo"
              sx={{ height: 80, width: 80, mt: 2, mb: 2, mx: "auto", objectFit: "contain" }}
            />
          )}
          {/* <Typography
            variant="overline"
            sx={{ opacity: 0.9, display: "block", mb: 0.5 }}
          >
            {campaign?.name || "Campaign"}
          </Typography> */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ letterSpacing: 0.5 }}
          >
            {campaign?.inlinePromotion?.offerTitle || campaign?.promotion?.offerTitle || "Claim Your Offer"}
          </Typography>
        </GradientHeader>

        {/* Stepper */}
        {currentStep < 3 && (
          <Box sx={{ px: 3, mt: 6, flexShrink: 0 }}>
            <Stepper
              alternativeLabel
              activeStep={currentStep}
              connector={<QontoConnector />}
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "&.Mui-active": {
                          color: campaign?.customization?.primaryColor,
                        },
                        "&.Mui-completed": {
                          color: campaign?.customization?.primaryColor,
                        },
                      },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Content Area - ScrollableContent handles overflow internally while Card maintains height */}
        <ScrollableContent>
          <Fade in timeout={400} key={currentStep}>
            <Box sx={{ pt: 2 }}>
              {currentStep === 0 && renderStep0()}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </Box>
          </Fade>

          {error && currentStep < 3 && (
            <Fade in>
              <Alert
                severity="error"
                variant="filled"
                sx={{ mt: 2, borderRadius: "8px" }}
              >
                {error}
              </Alert>
            </Fade>
          )}
        </ScrollableContent>

        {/* Navigation Footer */}
        {currentStep < 3 && (
          <Box
            sx={{
              px: 4,
              pb: 3,
              pt: 2,
              flexShrink: 0,
              bgcolor: "white",
              zIndex: 10,
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Button
                onClick={handleBack}
                disabled={currentStep === 0 || submitting}
                variant="ghost"
                className="text-gray-500"
                icon={<ArrowBack className="w-4 h-4" />}
              >
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={submitting}
                loading={submitting}
                variant="primary"
                className="px-8 rounded-full"
                style={{
                  backgroundColor: currentStep === 2 ? "#F5A623" : campaign?.customization?.primaryColor,
                  borderColor: currentStep === 2 ? "#F5A623" : campaign?.customization?.primaryColor,
                }}
              >
                {currentStep === 2 ? "Submit & Share" : "Next"}
                {!submitting && <ArrowForward className="w-4 h-4 ml-2" />}
              </Button>
            </Stack>
          </Box>
        )}

        {/* Footer Branding */}
        <Box
          sx={{
            bgcolor: "grey.50",
            py: 1.5,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            Powered by <strong>Reviu</strong>
          </Typography>
        </Box>
      </StyledCard>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Review copied to clipboard!
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
}
