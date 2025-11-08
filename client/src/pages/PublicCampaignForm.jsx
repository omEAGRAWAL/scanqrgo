import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Stack,
  // useTheme,
  // useMediaQuery,
  Skeleton,
  Snackbar,
  Fade,
  Paper,
  Container,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Error as ErrorIcon,
  Star,
  StarBorder,
  ShoppingCart,
  Person,
  RateReview,
  Celebration,
  Email,
  Phone,
  Store,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { API_URL } from "../config/api";
import { SiFlipkart } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // You can use 'atom-one-dark.css' for dark mode

// import rev from "../assets/Reviu_Logo.png";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  margin: "0 auto",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  overflow: "hidden",
}));

const GradientHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "primaryColor",
})(({ theme, primaryColor }) => ({
  background: primaryColor
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "white",
  padding: theme.spacing(3),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
  },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  "& .MuiStepIcon-root": {
    fontSize: "1.5rem",
  },
  "& .MuiStepIcon-text": {
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
}));

const MarketplaceChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "marketplace",
})(({ marketplace }) => ({
  fontWeight: "bold",
  "& .MuiChip-label": {
    paddingLeft: 8,
    paddingRight: 8,
  },
  ...(String(marketplace).toLowerCase().includes("amazon") &&
    {
      // backgroundColor: "#FF9500",
      // color: "white",
    }),
  ...(String(marketplace).toLowerCase().includes("flipkart") &&
    {
      // backgroundColor: "#2874F0",
      // color: "white",
    }),
}));

const steps = [
  { label: "Product Details", icon: <ShoppingCart /> },
  { label: "Personal Info", icon: <Person /> },
  { label: "Review", icon: <RateReview /> },
  { label: "Complete", icon: <Celebration /> },
];

// Map numeric rating (1–5) to satisfaction text
function mapRatingToSatisfaction(rating) {
  if (!rating) return "";
  if (rating >= 4) return "Very satisfied";
  if (rating === 3) return "Somewhat satisfied";
  return "Not satisfied";
}

export default function PublicCampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State management
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [response, setResponse] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    selectedProduct: "",
    orderNumber: "",
    satisfaction: 0, // numeric 1–5
    usedMoreDays: "",
    customerName: "",
    email: "",
    phoneNumber: "",
    review: "",
    clickedMarketplaceButton: false,
    marketplace: "", // NEW: user-selected marketplace
  });

  // Selected product memo
  const selectedProduct = useMemo(
    () => campaign?.products?.find((p) => p._id === form.selectedProduct),
    [campaign?.products, form.selectedProduct]
  );

  // Available marketplaces for the selected product
  const marketplaces = useMemo(() => {
    console.log("selectedProduct", response, selectedProduct);
    if (!selectedProduct) return [];
    const arr = [];
    if (selectedProduct.amazonAsin) {
      arr.push({
        name: "Amazon",
        color: "#FF9500",
        icon: <FaAmazon style={{ color: "white", fontSize: 20 }} />,
        url: `https://www.amazon.in/review/create-review/?asin=${encodeURIComponent(
          selectedProduct.amazonAsin
        )}`,
      });
    }
    if (selectedProduct.flipkartFsn) {
      arr.push({
        name: "Flipkart",
        color: "#2874F0",
        icon: <SiFlipkart style={{ color: "white", fontSize: 20 }} />,
        url: "https://www.flipkart.com/",
      });
    }
    return arr;
  }, [selectedProduct]);

  // The chosen marketplace configuration (if chosen or only one available)
  const selectedMarketplaceConfig = useMemo(() => {
    if (!selectedProduct) return null;
    // If user has selected explicitly
    const chosen = marketplaces.find((m) => m.name === form.marketplace);
    if (chosen) return chosen;
    // If only one available, auto-use it
    if (marketplaces.length === 1) return marketplaces;
    return null;
  }, [selectedProduct, marketplaces, form.marketplace]);

  // Effects
  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  // Auto-select single product; reset marketplace when product changes
  useEffect(() => {
    if (campaign?.products?.length === 1 && !form.selectedProduct) {
      setForm((prev) => ({
        ...prev,
        selectedProduct: campaign.products._id,
      }));
    }
  }, [campaign?.products, form.selectedProduct]);

  // Keep marketplace in sync with available options of the selected product
  useEffect(() => {
    if (!selectedProduct) {
      if (form.marketplace) {
        setForm((prev) => ({ ...prev, marketplace: "" }));
      }
      return;
    }
    const hasAmazon = !!selectedProduct.amazonAsin;
    const hasFlipkart = !!selectedProduct.flipkartFsn;

    // If only one option, set it automatically
    if (hasAmazon && !hasFlipkart && form.marketplace !== "Amazon") {
      setForm((prev) => ({ ...prev, marketplace: "Amazon" }));
    } else if (!hasAmazon && hasFlipkart && form.marketplace !== "Flipkart") {
      setForm((prev) => ({ ...prev, marketplace: "Flipkart" }));
    } else if (hasAmazon && hasFlipkart) {
      // Both present; clear if previously set to an invalid one
      if (
        form.marketplace &&
        !["Amazon", "Flipkart"].includes(form.marketplace)
      ) {
        setForm((prev) => ({ ...prev, marketplace: "" }));
      }
      // Otherwise, keep user's choice or leave empty for selection
    } else if (!hasAmazon && !hasFlipkart && form.marketplace) {
      setForm((prev) => ({ ...prev, marketplace: "" }));
    }
  }, [selectedProduct, form.marketplace]);

  // API functions
  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/public/campaign/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Campaign not found");
      }
      setCampaign(data.campaign);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Form handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [formErrors]
  );

  const handleRatingChange = useCallback((event, newValue) => {
    setForm((prev) => ({ ...prev, satisfaction: newValue || 0 }));
  }, []);

  const handleShareReview = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(form.review || "");
        setCopied(true);
      }
    } catch {
      // ignore clipboard errors
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

  const handleSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      setError("");

      // Map numeric to satisfaction string and include user-selected marketplace
      const satisfactionText = mapRatingToSatisfaction(form.satisfaction);
      const submission = {
        ...form,
        satisfaction: satisfactionText, // textual version
        rating: form.satisfaction, // numeric version
        marketplace: form.marketplace || selectedMarketplaceConfig?.name || "",
      };

      const res = await fetch(`${API_URL}/public/campaign/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit form");
      setResponse(data);
      setSuccess("Form submitted successfully!");
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [id, form, selectedMarketplaceConfig]);

  // Validation
  const validateStep = useCallback(
    (step) => {
      const errors = {};
      switch (step) {
        case 0: {
          if (!form.selectedProduct)
            errors.selectedProduct = "Please select a product";
          if (!form.orderNumber.trim())
            errors.orderNumber = "Order number is required";
          if (!form.satisfaction)
            errors.satisfaction = "Please rate your satisfaction";
          if (!form.usedMoreDays)
            errors.usedMoreDays = "Please select an option";
          // Require marketplace choice only if both are available
          const bothAvailable =
            !!selectedProduct?.amazonAsin && !!selectedProduct?.flipkartFsn;
          if (bothAvailable && !form.marketplace) {
            errors.marketplace = "Please select a marketplace";
          }
          break;
        }
        case 1:
          if (!form.customerName.trim())
            errors.customerName = "Name is required";
          if (!form.email.trim()) {
            errors.email = "Email is required";
          } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = "Please enter a valid email";
          }
          if (form.phoneNumber && !/^\+?[\d\s-()]+$/.test(form.phoneNumber)) {
            errors.phoneNumber = "Please enter a valid phone number";
          }
          break;
        case 2: {
          // Backend requires review always; min length only enforced for review category
          const minLen = campaign?.reviewMinimumLength || 0;
          if (!form.review.trim()) {
            errors.review = "Review is required";
          } else if (
            campaign?.category === "review" &&
            minLen > 0 &&
            form.review.length < minLen
          ) {
            errors.review = `Review must be at least ${minLen} characters`;
          }
          break;
        }
        default:
          break;
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [form, campaign, selectedProduct]
  );

  // Navigation
  const handleNext = useCallback(() => {
    if (!validateStep(currentStep)) {
      setError("Please fix the errors before continuing");
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

  const renderStep0 = () => {
    const bothAvailable =
      !!selectedProduct?.amazonAsin && !!selectedProduct?.flipkartFsn;

    return (
      <Stack spacing={3}>
        <FormControl fullWidth error={!!formErrors.selectedProduct}>
          <InputLabel>Select Product *</InputLabel>
          <Select
            name="selectedProduct"
            value={form.selectedProduct}
            onChange={handleChange}
            label="Select Product *"
          >
            {campaign?.products?.map((product) => {
              const badges = [];
              if (product.amazonAsin) badges.push("Amazon");
              if (product.flipkartFsn) badges.push("Flipkart");
              return (
                <MenuItem key={product._id} value={product._id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{product.name}</Typography>
                  </Stack>
                </MenuItem>
              );
            })}
          </Select>
          {formErrors.selectedProduct && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {formErrors.selectedProduct}
            </Typography>
          )}
        </FormControl>

        {/* --- Marketplace Selection Logic --- */}
        {selectedProduct && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #ddd",
              ":hover": { border: "1px solid #aaa" },
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Store color="action" />
                <Typography variant="body2" color="text.secondary">
                  Available on:
                </Typography>
                {selectedProduct.amazonAsin && (
                  <MarketplaceChip
                    marketplace="Amazon"
                    label="Amazon"
                    size="small"
                  />
                )}
                {selectedProduct.flipkartFsn && (
                  <MarketplaceChip
                    marketplace="Flipkart"
                    label="Flipkart"
                    size="small"
                  />
                )}
              </Stack>

              {/* Only show radio buttons if BOTH are available */}
              {bothAvailable && (
                <FormControl error={!!formErrors.marketplace}>
                  <FormLabel>Choose where you purchased from *</FormLabel>
                  <RadioGroup
                    row
                    name="marketplace"
                    value={form.marketplace}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Amazon"
                      control={<Radio />}
                      label="Amazon"
                    />
                    <FormControlLabel
                      value="Flipkart"
                      control={<Radio />}
                      label="Flipkart"
                    />
                  </RadioGroup>
                  {formErrors.marketplace && (
                    <Typography variant="caption" color="error">
                      {formErrors.marketplace}
                    </Typography>
                  )}
                </FormControl>
              )}
            </Stack>
          </Paper>
        )}
        {/* --- End of Marketplace Logic --- */}

        <TextField
          fullWidth
          name="orderNumber"
          label="Enter your order id *"
          value={form.orderNumber}
          onChange={handleChange}
          error={!!formErrors.orderNumber}
          helperText={formErrors.orderNumber}
          placeholder="Enter the order id from your purchase"
        />

        <Box>
          <FormLabel component="legend" error={!!formErrors.satisfaction}>
            How satisfied are you with the product? *
          </FormLabel>
          <Box sx={{ mt: 1 }}>
            <Rating
              name="satisfaction"
              value={form.satisfaction}
              onChange={handleRatingChange}
              size="large"
              icon={<Star fontSize="large" />}
              emptyIcon={<StarBorder fontSize="large" />}
            />
          </Box>
          {formErrors.satisfaction && (
            <Typography variant="caption" color="error">
              {formErrors.satisfaction}
            </Typography>
          )}
        </Box>

        <FormControl error={!!formErrors.usedMoreDays}>
          <FormLabel>
            Have you used this product for more than 7 days? *
          </FormLabel>
          <RadioGroup
            name="usedMoreDays"
            value={form.usedMoreDays}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
          {formErrors.usedMoreDays && (
            <Typography variant="caption" color="error">
              {formErrors.usedMoreDays}
            </Typography>
          )}
        </FormControl>
      </Stack>
    );
  };
  const renderStep1 = () => (
    <Stack spacing={3}>
      <TextField
        fullWidth
        name="customerName"
        label="Enter Full Name"
        value={form.customerName}
        onChange={handleChange}
        error={!!formErrors.customerName}
        helperText={formErrors.customerName}
        placeholder="Enter your full name"
      />

      <TextField
        fullWidth
        name="email"
        label="Enter Email ID"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={
          formErrors.email || "Your offer will be received on this email"
        }
        placeholder="Enter your email address"
      />

      <TextField
        fullWidth
        name="phoneNumber"
        label="Enter Phone Number"
        type="tel"
        value={form.phoneNumber}
        onChange={handleChange}
        error={!!formErrors.phoneNumber}
        helperText={formErrors.phoneNumber}
        placeholder="+91 - XXXXXXXXXX"
      />
    </Stack>
  );
  const renderStep2 = () => (
    <Stack spacing={2.5} alignItems="center">
      {selectedProduct && (
        <>
          {/* <img src={selectedProduct.imageurl} alt={selectedProduct.name} /> */}
          <Typography variant="h6" fontWeight="bold">
            {selectedProduct.name}
          </Typography>

          {selectedProduct.imageurl && (
            <Box
              component="img"
              src={selectedProduct.imageurl}
              alt={selectedProduct.name}
              sx={{
                width: 120,
                height: 120,
                objectFit: "contain",
                borderRadius: 2,
                mb: 1,
              }}
            />
          )}
        </>
      )}

      <TextField
        fullWidth
        name="review"
        label={`How do you like our ${selectedProduct?.name || "product"}?`}
        multiline
        rows={4}
        value={form.review}
        onChange={handleChange}
        error={!!formErrors.review}
        helperText={
          formErrors.review ||
          `${form.review.length}${
            campaign?.reviewMinimumLength
              ? `/${campaign.reviewMinimumLength}`
              : ""
          } characters`
        }
        placeholder="Enter Feedback"
      />

      {/* Logic to show button only for high ratings remains */}
      {selectedMarketplaceConfig && form.satisfaction >= 4 && (
        <Stack spacing={1} sx={{ width: "100%", pt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleShareReview}
            sx={{
              bgcolor: selectedMarketplaceConfig.color,
              color: "white",
              fontWeight: "bold",
              py: 1.5,
              "&:hover": {
                bgcolor: selectedMarketplaceConfig.color,
                opacity: 0.9,
              },
            }}
            startIcon={selectedMarketplaceConfig.icon}
          >
            Copy and share on {selectedMarketplaceConfig.name}
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Click button to copy your written feedback and share it on{" "}
            {selectedMarketplaceConfig.name}
          </Typography>
        </Stack>
      )}
    </Stack>
  );

  const renderStep3 = () => (
    <Stack
      spacing={3}
      alignItems="center"
      textAlign="center"
      sx={{ pt: 4, pb: 4 }}
    >
      <Typography variant="h4" component="h1" fontWeight="bold">
        Congratulations! 🎉
      </Typography>

      {/* Dynamic message based on promotion type */}
      {campaign?.promotion?.type === "extended warranty" ? (
        <Typography variant="body1" color="text.secondary">
          You’ve successfully registered for the <strong></strong> Month
          Extended Warranty for
          <strong> {selectedProduct?.name || "<Product Name>"} </strong>
          {/* on {new Date().toLocaleDateString()}. */}
        </Typography>
      ) : (
        <Typography variant="body1" color="text.secondary">
          You've successfully unlocked a coupon code for your next purchase of
          <strong> {selectedProduct?.name || "<Product Name>"} </strong>.
          Details have been sent to your email.
        </Typography>
      )}

      {/* <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: "italic" }}
      >
        {campaign?.promotion?.termsAndConditions
          ? campaign.promotion.termsAndConditions
          : "<Extended Warranty Terms & Conditions>"}
      </Typography> */}

      <div className="prose prose-indigo max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {campaign?.promotion?.termsAndConditions
            ? campaign.promotion.termsAndConditions
            : "warrenty is extended"}
        </ReactMarkdown>
      </div>

      <Box sx={{ pt: 2 }}>
        <Typography variant="h6" component="p" color="text.primary">
          We value your feedback.
        </Typography>
        <Typography variant="h6" component="p" color="text.primary">
          Thanks for sharing.
        </Typography>
      </Box>
      {loading && (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <StyledCard>
            <Skeleton variant="rectangular" height={120} />
            <CardContent>
              <Stack spacing={2}>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="rectangular" height={56} />
                <Skeleton variant="rectangular" height={56} />
                <Skeleton variant="rectangular" height={100} />
              </Stack>
            </CardContent>
          </StyledCard>
        </Container>
      )}
    </Stack>

    // Loading state
  );
  // Error state
  if (error && !campaign) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <StyledCard>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Campaign Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error}
            </Typography>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </CardContent>
        </StyledCard>
      </Container>
    );
  }

  //   return (
  //     <Container maxWidth="sm" sx={{ py: 2 }}>
  //       <StyledCard>
  //         {/* Header */}
  //         <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
  //           {campaign?.seller?.logoUrl && (
  //             <img
  //               src={campaign.seller.logoUrl}
  //               alt="Seller Logo"
  //               style={{ maxHeight: 30, marginBottom: 8 }}
  //             />
  //           )}
  //           <Typography variant="h5" fontWeight="bold" gutterBottom>
  //             {campaign?.promotion?.name || "<Offer Title>"}
  //           </Typography>
  //         </GradientHeader>

  //         {/* Content */}
  //         <CardContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
  //           <Fade in timeout={300}>
  //             <Box>
  //               {/* This Box will render the correct step based on the currentStep state */}
  //               {currentStep === 0 && renderStep0()}
  //               {currentStep === 1 && renderStep1()}
  //               {currentStep === 2 && renderStep2()}
  //               {currentStep === 3 && renderStep3()}
  //             </Box>
  //           </Fade>
  //           {/* Error Alert */}
  //           {error && currentStep < 3 && (
  //             <Alert severity="error" sx={{ mt: 2 }}>
  //               {error}
  //             </Alert>
  //           )}
  //         </CardContent>

  //         {/* Footer Navigation */}
  //         {currentStep < 4 && (
  //           <>
  //             <Divider />
  //             <Box sx={{ p: 2, position: "relative", textAlign: "center" }}>
  //               <Box
  //                 sx={{
  //                   display: "flex",
  //                   justifyContent: "space-between",
  //                   alignItems: "center",
  //                 }}
  //               >
  //                 <Button
  //                   onClick={handleBack}
  //                   disabled={currentStep === 0 || submitting}
  //                   startIcon={<ArrowBack />}
  //                 >
  //                   Back
  //                 </Button>

  //                 <Typography variant="body2" color="text.secondary">
  //                   Step {currentStep + 1} of {steps.length - 1}
  //                 </Typography>

  //                 <Button
  //                   onClick={handleNext}
  //                   disabled={submitting}
  //                   endIcon={
  //                     submitting ? (
  //                       <CircularProgress size={20} />
  //                     ) : (
  //                       <ArrowForward />
  //                     )
  //                   }
  //                   variant="contained"
  //                 >
  //                   {currentStep === 2 ? "Submit" : "Next"}
  //                 </Button>
  //               </Box>
  //               <Typography
  //                 variant="caption"
  //                 color="text.secondary"
  //                 sx={{ mt: 2, display: "block" }}
  //               >
  //                 Powered by Reviu
  //               </Typography>
  //             </Box>
  //           </>
  //         )}
  //       </StyledCard>

  //       {/* Snackbars for user feedback */}
  //       <Snackbar
  //         open={!!success}
  //         autoHideDuration={6000}
  //         onClose={() => setSuccess("")}
  //         anchorOrigin={{ vertical: "top", horizontal: "center" }}
  //       >
  //         <Alert onClose={() => setSuccess("")} severity="success">
  //           {success}
  //         </Alert>
  //       </Snackbar>
  //       <Snackbar
  //         open={copied}
  //         autoHideDuration={2500}
  //         onClose={() => setCopied(false)}
  //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  //       >
  //         <Alert onClose={() => setCopied(false)} severity="info">
  //           Review copied to clipboard!
  //         </Alert>
  //       </Snackbar>
  //     </Container>
  //   );
  // }
  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <StyledCard>
        {/* Header */}
        {/* Shift to center */}
        <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            {campaign?.seller?.logoUrl && (
              <img
                src={campaign.seller.logoUrl}
                alt="Seller Logo"
                style={{
                  maxHeight: 30,
                  marginBottom: 8,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )}
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {campaign?.promotion?.offerTitle || "<Offer Title>"}
          </Typography>
        </GradientHeader>

        {/* Content */}
        <CardContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
          <Fade in timeout={300}>
            {/* MODIFICATION: 
              - Added a min-height to prevent the card from resizing between steps.
              - Used flexbox to align content consistently within the fixed space.
            */}
            <Box
              sx={{
                minHeight: { xs: 420, sm: 450 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* This Box will render the correct step based on the currentStep state */}
              {currentStep === 0 && renderStep0()}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </Box>
          </Fade>
          {/* Error Alert */}
          {error && currentStep < 3 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>

        {/* Footer Navigation 
          MODIFICATION: Changed condition to currentStep < 3 to hide on the final step.
        */}
        {currentStep < 3 && (
          <>
            <Divider />
            <Box sx={{ p: 2, position: "relative", textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 0 || submitting}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Step {currentStep + 1} of {steps.length - 1}
                </Typography>

                <Button
                  onClick={handleNext}
                  disabled={submitting}
                  endIcon={
                    submitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ArrowForward />
                    )
                  }
                  variant="contained"
                >
                  {currentStep === 2 ? "Submit" : "Next"}
                </Button>
              </Box>
            </Box>
          </>
        )}
        <Box sx={{ p: 2, position: "relative", textAlign: "center" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Powered by Reviu
          </Typography>
        </Box>
      </StyledCard>

      {/* Snackbars for user feedback */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess("")} severity="success">
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setCopied(false)} severity="info">
          Review copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
}
