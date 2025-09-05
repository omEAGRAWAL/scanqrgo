// // // import React, { useState, useEffect, useCallback, useMemo } from "react";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import {
// // //   Box,
// // //   Card,
// // //   CardContent,
// // //   Stepper,
// // //   Step,
// // //   StepLabel,
// // //   Typography,
// // //   Button,
// // //   FormControl,
// // //   InputLabel,
// // //   Select,
// // //   MenuItem,
// // //   TextField,
// // //   FormLabel,
// // //   RadioGroup,
// // //   FormControlLabel,
// // //   Radio,
// // //   Rating,
// // //   Alert,
// // //   CircularProgress,
// // //   Avatar,
// // //   Chip,
// // //   IconButton,
// // //   Divider,
// // //   Stack,
// // //   useTheme,
// // //   useMediaQuery,
// // //   Skeleton,
// // //   Snackbar,
// // //   Fade,
// // //   Paper,
// // //   Container,
// // // } from "@mui/material";
// // // import {
// // //   ArrowBack,
// // //   ArrowForward,
// // //   CheckCircle,
// // //   Error,
// // //   Star,
// // //   StarBorder,
// // //   ShoppingCart,
// // //   Person,
// // //   RateReview,
// // //   Celebration,
// // //   Email,
// // //   Phone,
// // //   Store,
// // // } from "@mui/icons-material";
// // // import { styled } from "@mui/material/styles";
// // // import { API_URL } from "../config/api";

// // // // Styled components
// // // const StyledCard = styled(Card)(({ theme }) => ({
// // //   maxWidth: 480,
// // //   margin: "0 auto",
// // //   borderRadius: theme.spacing(2),
// // //   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
// // //   overflow: "hidden",
// // // }));

// // // const GradientHeader = styled(Box)(({ theme, primaryColor }) => ({
// // //   background: primaryColor
// // //     ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
// // //     : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
// // //   color: "white",
// // //   padding: theme.spacing(3),
// // //   textAlign: "center",
// // //   position: "relative",
// // //   overflow: "hidden",
// // //   "&::before": {
// // //     content: '""',
// // //     position: "absolute",
// // //     top: -50,
// // //     right: -50,
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: "50%",
// // //     background: "rgba(255,255,255,0.1)",
// // //   },
// // //   "&::after": {
// // //     content: '""',
// // //     position: "absolute",
// // //     bottom: -30,
// // //     left: -30,
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: "50%",
// // //     background: "rgba(255,255,255,0.1)",
// // //   },
// // // }));

// // // const StyledStepper = styled(Stepper)(({ theme }) => ({
// // //   padding: theme.spacing(2, 0),
// // //   "& .MuiStepIcon-root": {
// // //     fontSize: "1.5rem",
// // //   },
// // //   "& .MuiStepIcon-text": {
// // //     fontSize: "0.875rem",
// // //     fontWeight: "bold",
// // //   },
// // // }));

// // // const MarketplaceChip = styled(Chip)(({ marketplace }) => ({
// // //   fontWeight: "bold",
// // //   "& .MuiChip-label": {
// // //     paddingLeft: 8,
// // //     paddingRight: 8,
// // //   },
// // //   ...(marketplace === "Amazon" && {
// // //     backgroundColor: "#FF9500",
// // //     color: "white",
// // //   }),
// // //   ...(marketplace === "Flipkart" && {
// // //     backgroundColor: "#2874F0",
// // //     color: "white",
// // //   }),
// // // }));

// // // const steps = [
// // //   { label: "Product Details", icon: <ShoppingCart /> },
// // //   { label: "Personal Info", icon: <Person /> },
// // //   { label: "Review", icon: <RateReview /> },
// // //   { label: "Complete", icon: <Celebration /> },
// // // ];

// // // export default function PublicCampaignForm() {
// // //   const { id } = useParams();
// // //   const navigate = useNavigate();
// // //   const theme = useTheme();
// // //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

// // //   // State management
// // //   const [campaign, setCampaign] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const [response, setResponse] = useState(null);
// // //   const [currentStep, setCurrentStep] = useState(0);
// // //   const [formErrors, setFormErrors] = useState({});

// // //   const [form, setForm] = useState({
// // //     selectedProduct: "",
// // //     orderNumber: "",
// // //     satisfaction: 0,
// // //     usedMoreThan7Days: "",
// // //     customerName: "",
// // //     email: "",
// // //     phoneNumber: "",
// // //     review: "",
// // //   });

// // //   // Memoized values
// // //   const selectedProduct = useMemo(
// // //     () => campaign?.products?.find((p) => p._id === form.selectedProduct),
// // //     [campaign?.products, form.selectedProduct]
// // //   );

// // //   const marketplaceConfig = useMemo(() => {
// // //     if (!selectedProduct) return null;

// // //     const marketplace = selectedProduct.marketplace?.toLowerCase();
// // //     if (marketplace === "amazon") {
// // //       return {
// // //         name: "Amazon",
// // //         color: "#FF9500",
// // //         icon: <Store />,
// // //         url: `https://www.amazon.in/review/create-review/?asin=${
// // //           selectedProduct.marketplaceProductId || "PRODUCT_ID_NOT_FOUND"
// // //         }`,
// // //       };
// // //     } else if (marketplace === "flipkart") {
// // //       return {
// // //         name: "Flipkart",
// // //         color: "#2874F0",
// // //         icon: <Store />,
// // //         url: "https://www.flipkart.com/",
// // //       };
// // //     }
// // //     return null;
// // //   }, [selectedProduct]);

// // //   // Effects
// // //   useEffect(() => {
// // //     if (id) fetchCampaign();
// // //   }, [id]);

// // //   // Auto-select single product
// // //   useEffect(() => {
// // //     if (campaign?.products?.length === 1 && !form.selectedProduct) {
// // //       setForm((prev) => ({
// // //         ...prev,
// // //         selectedProduct: campaign.products[0]._id,
// // //       }));
// // //     }
// // //   }, [campaign?.products, form.selectedProduct]);

// // //   // API functions
// // //   const fetchCampaign = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       const res = await fetch(`${API_URL}/public/campaign/${id}`);
// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         throw new Error(data.message || "Campaign not found");
// // //       }

// // //       setCampaign(data.campaign);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [id]);

// // //   // Form handlers
// // //   const handleChange = useCallback(
// // //     (e) => {
// // //       const { name, value } = e.target;
// // //       setForm((prev) => ({ ...prev, [name]: value }));

// // //       // Clear field error when user starts typing
// // //       if (formErrors[name]) {
// // //         setFormErrors((prev) => ({ ...prev, [name]: "" }));
// // //       }
// // //     },
// // //     [formErrors]
// // //   );

// // //   const handleRatingChange = useCallback((event, newValue) => {
// // //     setForm((prev) => ({ ...prev, satisfaction: newValue || 0 }));
// // //   }, []);

// // //   const handleSubmit = useCallback(async () => {
// // //     try {
// // //       setSubmitting(true);
// // //       setError("");

// // //       const res = await fetch(`${API_URL}/public/campaign/${id}/submit`, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(form),
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         throw new Error(data.message || "Failed to submit form");
// // //       }

// // //       setResponse(data);
// // //       setSuccess("Form submitted successfully!");
// // //       setCurrentStep(3);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   }, [id, form]);

// // //   // Validation functions
// // //   const validateStep = useCallback(
// // //     (step) => {
// // //       const errors = {};

// // //       switch (step) {
// // //         case 0:
// // //           if (!form.selectedProduct)
// // //             errors.selectedProduct = "Please select a product";
// // //           if (!form.orderNumber.trim())
// // //             errors.orderNumber = "Order number is required";
// // //           if (!form.satisfaction)
// // //             errors.satisfaction = "Please rate your satisfaction";
// // //           if (!form.usedMoreThan7Days)
// // //             errors.usedMoreThan7Days = "Please select an option";
// // //           break;
// // //         case 1:
// // //           if (!form.customerName.trim())
// // //             errors.customerName = "Name is required";
// // //           if (!form.email.trim()) {
// // //             errors.email = "Email is required";
// // //           } else if (!/\S+@\S+\.\S+/.test(form.email)) {
// // //             errors.email = "Please enter a valid email";
// // //           }
// // //           if (form.phoneNumber && !/^\+?[\d\s-()]+$/.test(form.phoneNumber)) {
// // //             errors.phoneNumber = "Please enter a valid phone number";
// // //           }
// // //           break;
// // //         case 2:
// // //           if (campaign?.category === "review" && !form.review.trim()) {
// // //             errors.review = "Review is required";
// // //           }
// // //           if (
// // //             campaign?.reviewMinimumLength &&
// // //             form.review.length < campaign.reviewMinimumLength
// // //           ) {
// // //             errors.review = `Review must be at least ${campaign.reviewMinimumLength} characters`;
// // //           }
// // //           break;
// // //       }

// // //       setFormErrors(errors);
// // //       return Object.keys(errors).length === 0;
// // //     },
// // //     [form, campaign]
// // //   );

// // //   // Navigation functions
// // //   const handleNext = useCallback(() => {
// // //     if (!validateStep(currentStep)) {
// // //       setError("Please fix the errors before continuing");
// // //       return;
// // //     }

// // //     setError("");
// // //     if (currentStep === 2) {
// // //       handleSubmit();
// // //     } else {
// // //       setCurrentStep((prev) => prev + 1);
// // //     }
// // //   }, [currentStep, validateStep, handleSubmit]);

// // //   const handleBack = useCallback(() => {
// // //     setCurrentStep((prev) => Math.max(0, prev - 1));
// // //     setError("");
// // //   }, []);

// // //   const openMarketplaceReview = useCallback(() => {
// // //     if (marketplaceConfig?.url) {
// // //       window.open(marketplaceConfig.url, "_blank", "noopener,noreferrer");
// // //     }
// // //   }, [marketplaceConfig]);

// // //   // Step components
// // //   const renderStep0 = () => (
// // //     <Stack spacing={3}>
// // //       <FormControl fullWidth error={!!formErrors.selectedProduct}>
// // //         <InputLabel>Select Product *</InputLabel>
// // //         <Select
// // //           name="selectedProduct"
// // //           value={form.selectedProduct}
// // //           onChange={handleChange}
// // //           label="Select Product *"
// // //         >
// // //           {campaign?.products?.map((product) => (
// // //             <MenuItem key={product._id} value={product._id}>
// // //               <Stack direction="row" spacing={1} alignItems="center">
// // //                 <Typography>{product.name}</Typography>
// // //                 {product.marketplace && (
// // //                   <MarketplaceChip
// // //                     marketplace={product.marketplace}
// // //                     label={product.marketplace}
// // //                     size="small"
// // //                   />
// // //                 )}
// // //               </Stack>
// // //             </MenuItem>
// // //           ))}
// // //         </Select>
// // //         {formErrors.selectedProduct && (
// // //           <Typography variant="caption" color="error" sx={{ mt: 1 }}>
// // //             {formErrors.selectedProduct}
// // //           </Typography>
// // //         )}
// // //       </FormControl>

// // //       {selectedProduct && (
// // //         <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
// // //           <Stack direction="row" spacing={2} alignItems="center">
// // //             <Store color="primary" />
// // //             <Typography variant="body2" color="text.secondary">
// // //               Marketplace:
// // //             </Typography>
// // //             <MarketplaceChip
// // //               marketplace={selectedProduct.marketplace}
// // //               label={selectedProduct.marketplace}
// // //               size="small"
// // //             />
// // //           </Stack>
// // //         </Paper>
// // //       )}

// // //       <TextField
// // //         fullWidth
// // //         name="orderNumber"
// // //         label="Order Number *"
// // //         value={form.orderNumber}
// // //         onChange={handleChange}
// // //         error={!!formErrors.orderNumber}
// // //         helperText={formErrors.orderNumber}
// // //         placeholder="Enter your order number"
// // //       />

// // //       <Box>
// // //         <FormLabel component="legend" error={!!formErrors.satisfaction}>
// // //           How satisfied are you with the product? *
// // //         </FormLabel>
// // //         <Box sx={{ mt: 1 }}>
// // //           <Rating
// // //             name="satisfaction"
// // //             value={form.satisfaction}
// // //             onChange={handleRatingChange}
// // //             size="large"
// // //             icon={<Star fontSize="large" />}
// // //             emptyIcon={<StarBorder fontSize="large" />}
// // //           />
// // //         </Box>
// // //         {formErrors.satisfaction && (
// // //           <Typography variant="caption" color="error">
// // //             {formErrors.satisfaction}
// // //           </Typography>
// // //         )}
// // //       </Box>

// // //       <FormControl error={!!formErrors.usedMoreThan7Days}>
// // //         <FormLabel>
// // //           Have you used this product for more than 7 days? *
// // //         </FormLabel>
// // //         <RadioGroup
// // //           name="usedMoreThan7Days"
// // //           value={form.usedMoreThan7Days}
// // //           onChange={handleChange}
// // //           row
// // //         >
// // //           <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
// // //           <FormControlLabel value="No" control={<Radio />} label="No" />
// // //         </RadioGroup>
// // //         {formErrors.usedMoreThan7Days && (
// // //           <Typography variant="caption" color="error">
// // //             {formErrors.usedMoreThan7Days}
// // //           </Typography>
// // //         )}
// // //       </FormControl>
// // //     </Stack>
// // //   );

// // //   const renderStep1 = () => (
// // //     <Stack spacing={3}>
// // //       <TextField
// // //         fullWidth
// // //         name="customerName"
// // //         label="Your Name *"
// // //         value={form.customerName}
// // //         onChange={handleChange}
// // //         error={!!formErrors.customerName}
// // //         helperText={formErrors.customerName}
// // //         placeholder="Enter your full name"
// // //         InputProps={{
// // //           startAdornment: <Person color="action" sx={{ mr: 1 }} />,
// // //         }}
// // //       />

// // //       <TextField
// // //         fullWidth
// // //         name="email"
// // //         label="Email Address *"
// // //         type="email"
// // //         value={form.email}
// // //         onChange={handleChange}
// // //         error={!!formErrors.email}
// // //         helperText={formErrors.email || "Your offer will be sent to this email"}
// // //         placeholder="Enter your email address"
// // //         InputProps={{
// // //           startAdornment: <Email color="action" sx={{ mr: 1 }} />,
// // //         }}
// // //       />

// // //       <TextField
// // //         fullWidth
// // //         name="phoneNumber"
// // //         label="Phone Number"
// // //         type="tel"
// // //         value={form.phoneNumber}
// // //         onChange={handleChange}
// // //         error={!!formErrors.phoneNumber}
// // //         helperText={formErrors.phoneNumber}
// // //         placeholder="+91 - XXXXXXXXXX"
// // //         InputProps={{
// // //           startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
// // //         }}
// // //       />
// // //     </Stack>
// // //   );

// // //   const renderStep2 = () => (
// // //     <Stack spacing={3}>
// // //       {selectedProduct && (
// // //         <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
// // //           <Typography variant="h6" gutterBottom>
// // //             {selectedProduct.name}
// // //           </Typography>
// // //           {selectedProduct.image && (
// // //             <Avatar
// // //               src={selectedProduct.image}
// // //               alt={selectedProduct.name}
// // //               sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
// // //             />
// // //           )}
// // //           <Stack direction="row" spacing={1} justifyContent="center">
// // //             <Rating value={form.satisfaction} readOnly size="small" />
// // //             <Typography variant="body2" color="text.secondary">
// // //               ({form.satisfaction}/5)
// // //             </Typography>
// // //           </Stack>
// // //         </Paper>
// // //       )}

// // //       <TextField
// // //         fullWidth
// // //         name="review"
// // //         label={`How do you like our ${selectedProduct?.name}?`}
// // //         multiline
// // //         rows={4}
// // //         value={form.review}
// // //         onChange={handleChange}
// // //         error={!!formErrors.review}
// // //         helperText={
// // //           formErrors.review ||
// // //           `${form.review.length}${
// // //             campaign?.reviewMinimumLength
// // //               ? `/${campaign.reviewMinimumLength}`
// // //               : ""
// // //           } characters`
// // //         }
// // //         placeholder="Share your experience with this product..."
// // //       />

// // //       {marketplaceConfig && form.satisfaction >= 4 && (
// // //         <Paper
// // //           elevation={1}
// // //           sx={{ p: 2, bgcolor: (theme) => theme.palette.primary.light }}
// // //         >
// // //           <Typography
// // //             variant="body2"
// // //             color="primary.main"
// // //             gutterBottom
// // //             textAlign="center"
// // //           >
// // //             ⭐ We'd love your review on {marketplaceConfig.name} too!
// // //           </Typography>
// // //           <Button
// // //             fullWidth
// // //             variant="contained"
// // //             onClick={openMarketplaceReview}
// // //             sx={{
// // //               bgcolor: marketplaceConfig.color,
// // //               "&:hover": { bgcolor: marketplaceConfig.color, opacity: 0.9 },
// // //             }}
// // //             startIcon={marketplaceConfig.icon}
// // //           >
// // //             Review on {marketplaceConfig.name}
// // //           </Button>
// // //           <Typography
// // //             variant="caption"
// // //             display="block"
// // //             textAlign="center"
// // //             sx={{ mt: 1 }}
// // //           >
// // //             Click to copy your feedback and share on {marketplaceConfig.name}
// // //           </Typography>
// // //         </Paper>
// // //       )}
// // //     </Stack>
// // //   );

// // //   const renderStep3 = () => (
// // //     <Stack spacing={3} alignItems="center" textAlign="center">
// // //       <Box sx={{ fontSize: "4rem" }}>🎉</Box>

// // //       <Typography variant="h4" color="primary">
// // //         {response?.shouldShowReward && response?.promotion
// // //           ? "Congratulations!"
// // //           : "Thank You!"}
// // //       </Typography>

// // //       {response?.shouldShowReward && response?.promotion ? (
// // //         <Paper
// // //           elevation={3}
// // //           sx={{ p: 3, bgcolor: "success.50", maxWidth: 400 }}
// // //         >
// // //           <Stack spacing={2} alignItems="center">
// // //             <Box sx={{ fontSize: "2rem" }}>🎁</Box>
// // //             <Typography variant="h6" color="success.main">
// // //               Here is your gift!
// // //             </Typography>
// // //             <Typography variant="h5" fontWeight="bold" color="primary">
// // //               {response.promotion.name}
// // //             </Typography>
// // //             <Typography variant="body1" color="text.secondary">
// // //               {response.promotion.description}
// // //             </Typography>
// // //             {response.promotion.provider && (
// // //               <Chip
// // //                 label={`Provider: ${response.promotion.provider}`}
// // //                 color="primary"
// // //                 variant="outlined"
// // //               />
// // //             )}
// // //           </Stack>
// // //         </Paper>
// // //       ) : (
// // //         <Paper elevation={2} sx={{ p: 3, bgcolor: "info.50", maxWidth: 400 }}>
// // //           <Typography variant="body1" color="info.main">
// // //             Thanks for your feedback! It helps us improve our products.
// // //           </Typography>
// // //         </Paper>
// // //       )}

// // //       <Typography variant="body2" color="text.secondary">
// // //         We appreciate you taking the time to share your experience with us!
// // //       </Typography>
// // //     </Stack>
// // //   );

// // //   // Loading state
// // //   if (loading) {
// // //     return (
// // //       <Container maxWidth="sm" sx={{ py: 4 }}>
// // //         <StyledCard>
// // //           <Skeleton variant="rectangular" height={120} />
// // //           <CardContent>
// // //             <Stack spacing={2}>
// // //               <Skeleton variant="text" height={40} />
// // //               <Skeleton variant="rectangular" height={56} />
// // //               <Skeleton variant="rectangular" height={56} />
// // //               <Skeleton variant="rectangular" height={100} />
// // //             </Stack>
// // //           </CardContent>
// // //         </StyledCard>
// // //       </Container>
// // //     );
// // //   }

// // //   // Error state
// // //   if (error && !campaign) {
// // //     return (
// // //       <Container maxWidth="sm" sx={{ py: 4 }}>
// // //         <StyledCard>
// // //           <CardContent sx={{ textAlign: "center", py: 4 }}>
// // //             <Error color="error" sx={{ fontSize: 60, mb: 2 }} />
// // //             <Typography variant="h5" gutterBottom>
// // //               Campaign Not Found
// // //             </Typography>
// // //             <Typography variant="body1" color="text.secondary" paragraph>
// // //               {error}
// // //             </Typography>
// // //             <Button variant="outlined" onClick={() => navigate("/")}>
// // //               Go Home
// // //             </Button>
// // //           </CardContent>
// // //         </StyledCard>
// // //       </Container>
// // //     );
// // //   }

// // //   return (
// // //     <Container maxWidth="sm" sx={{ py: 2 }}>
// // //       <StyledCard>
// // //         {/* Header */}
// // //         <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
// // //           <Typography variant="h5" fontWeight="bold" gutterBottom>
// // //             {campaign?.name || "$50 Amazon Gift Voucher 🎁"}
// // //           </Typography>
// // //           <Typography variant="body2" sx={{ opacity: 0.9 }}>
// // //             {campaign?.customization?.customMessage ||
// // //               "We'd love to hear about your experience!"}
// // //           </Typography>
// // //           {campaign?.seller?.name && (
// // //             <Typography
// // //               variant="caption"
// // //               sx={{ opacity: 0.8, display: "block", mt: 1 }}
// // //             >
// // //               By {campaign.seller.name}
// // //             </Typography>
// // //           )}
// // //         </GradientHeader>
// // //         {/* Stepper */}
// // //         <Box sx={{ px: 2, pt: 2 }}>
// // //           <StyledStepper activeStep={currentStep} alternativeLabel={isMobile}>
// // //             {steps.map((step, index) => (
// // //               <Step key={step.label}>
// // //                 <StepLabel
// // //                   icon={
// // //                     <Box
// // //                       sx={{
// // //                         color:
// // //                           index <= currentStep ? "primary.main" : "grey.400",
// // //                         display: "flex",
// // //                         alignItems: "center",
// // //                         justifyContent: "center",
// // //                       }}
// // //                     >
// // //                       {index < currentStep ? <CheckCircle /> : step.icon}
// // //                     </Box>
// // //                   }
// // //                 >
// // //                   {!isMobile && step.label}
// // //                 </StepLabel>
// // //               </Step>
// // //             ))}
// // //           </StyledStepper>
// // //         </Box>

// // //         {/* Content */}
// // //         <CardContent sx={{ px: 3, pb: 2 }}>
// // //           <Fade in timeout={300}>
// // //             <Box>
// // //               {currentStep === 0 && renderStep0()}
// // //               {currentStep === 1 && renderStep1()}
// // //               {currentStep === 2 && renderStep2()}
// // //               {currentStep === 3 && renderStep3()}
// // //             </Box>
// // //           </Fade>

// // //           {/* Error Alert */}
// // //           {error && currentStep < 3 && (
// // //             <Alert severity="error" sx={{ mt: 2 }}>
// // //               {error}
// // //             </Alert>
// // //           )}
// // //         </CardContent>
// // //         {/* Footer Navigation */}
// // //         {currentStep < 3 && (
// // //           <>
// // //             <Divider />
// // //             <Box
// // //               sx={{
// // //                 p: 2,
// // //                 display: "flex",
// // //                 justifyContent: "space-between",
// // //                 alignItems: "center",
// // //               }}
// // //             >
// // //               <Button
// // //                 onClick={handleBack}
// // //                 disabled={currentStep === 0}
// // //                 startIcon={<ArrowBack />}
// // //                 variant="outlined"
// // //               >
// // //                 Back
// // //               </Button>

// // //               <Typography variant="body2" color="text.secondary">
// // //                 Step {currentStep + 1} of {steps.length - 1}
// // //               </Typography>

// // //               <Button
// // //                 onClick={handleNext}
// // //                 disabled={submitting}
// // //                 endIcon={
// // //                   submitting ? <CircularProgress size={16} /> : <ArrowForward />
// // //                 }
// // //                 variant="contained"
// // //               >
// // //                 {currentStep === 2 ? "Submit" : "Next"}
// // //               </Button>
// // //             </Box>
// // //           </>
// // //         )}
// // //       </StyledCard>

// // //       {/* Success Snackbar */}
// // //       <Snackbar
// // //         open={!!success}
// // //         autoHideDuration={6000}
// // //         onClose={() => setSuccess("")}
// // //         anchorOrigin={{ vertical: "top", horizontal: "center" }}
// // //       >
// // //         <Alert onClose={() => setSuccess("")} severity="success">
// // //           {success}
// // //         </Alert>
// // //       </Snackbar>
// // //     </Container>
// // //   );
// // // }
// // import React, { useState, useEffect, useCallback, useMemo } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Typography,
// //   Button,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   TextField,
// //   FormLabel,
// //   RadioGroup,
// //   FormControlLabel,
// //   Radio,
// //   Rating,
// //   Alert,
// //   CircularProgress,
// //   Avatar,
// //   Chip,
// //   Divider,
// //   Stack,
// //   useTheme,
// //   useMediaQuery,
// //   Skeleton,
// //   Snackbar,
// //   Fade,
// //   Paper,
// //   Container,
// //   InputAdornment,
// // } from "@mui/material";
// // import {
// //   ArrowBack,
// //   ArrowForward,
// //   CheckCircle,
// //   Error as ErrorIcon,
// //   Star,
// //   StarBorder,
// //   ShoppingCart,
// //   Person,
// //   RateReview,
// //   Celebration,
// //   Email,
// //   Phone,
// //   Store,
// // } from "@mui/icons-material";
// // import { styled } from "@mui/material/styles";
// // import { API_URL } from "../config/api";

// // // Styled components
// // const StyledCard = styled(Card)(({ theme }) => ({
// //   maxWidth: 480,
// //   margin: "0 auto",
// //   borderRadius: theme.spacing(2),
// //   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
// //   overflow: "hidden",
// // }));

// // const GradientHeader = styled(Box, {
// //   shouldForwardProp: (prop) => prop !== "primaryColor",
// // })(({ theme, primaryColor }) => ({
// //   background: primaryColor
// //     ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
// //     : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
// //   color: "white",
// //   padding: theme.spacing(3),
// //   textAlign: "center",
// //   position: "relative",
// //   overflow: "hidden",
// //   "&::before": {
// //     content: '""',
// //     position: "absolute",
// //     top: -50,
// //     right: -50,
// //     width: 100,
// //     height: 100,
// //     borderRadius: "50%",
// //     background: "rgba(255,255,255,0.1)",
// //   },
// //   "&::after": {
// //     content: '""',
// //     position: "absolute",
// //     bottom: -30,
// //     left: -30,
// //     width: 60,
// //     height: 60,
// //     borderRadius: "50%",
// //     background: "rgba(255,255,255,0.1)",
// //   },
// // }));

// // const StyledStepper = styled(Stepper)(({ theme }) => ({
// //   padding: theme.spacing(2, 0),
// //   "& .MuiStepIcon-root": {
// //     fontSize: "1.5rem",
// //   },
// //   "& .MuiStepIcon-text": {
// //     fontSize: "0.875rem",
// //     fontWeight: "bold",
// //   },
// // }));

// // const MarketplaceChip = styled(Chip, {
// //   shouldForwardProp: (prop) => prop !== "marketplace",
// // })(({ marketplace }) => ({
// //   fontWeight: "bold",
// //   "& .MuiChip-label": {
// //     paddingLeft: 8,
// //     paddingRight: 8,
// //   },
// //   ...(String(marketplace).toLowerCase().includes("amazon") && {
// //     backgroundColor: "#FF9500",
// //     color: "white",
// //   }),
// //   ...(String(marketplace).toLowerCase().includes("flipkart") && {
// //     backgroundColor: "#2874F0",
// //     color: "white",
// //   }),
// // }));

// // const steps = [
// //   { label: "Product Details", icon: <ShoppingCart /> },
// //   { label: "Personal Info", icon: <Person /> },
// //   { label: "Review", icon: <RateReview /> },
// //   { label: "Complete", icon: <Celebration /> },
// // ];

// // export default function PublicCampaignForm() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

// //   // State management
// //   const [campaign, setCampaign] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [response, setResponse] = useState(null);
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [formErrors, setFormErrors] = useState({});
// //   const [copied, setCopied] = useState(false);

// //   const [form, setForm] = useState({
// //     selectedProduct: "",

// //     orderNumber: "",
// //     satisfaction: 0,
// //     usedMoreThan7Days: "",
// //     customerName: "",
// //     email: "",
// //     phoneNumber: "",
// //     review: "",
// //   });

// //   // Memoized values
// //   const selectedProduct = useMemo(
// //     () => campaign?.products?.find((p) => p._id === form.selectedProduct),
// //     [campaign?.products, form.selectedProduct]
// //   );

// //   const marketplaceConfig = useMemo(() => {
// //     if (!selectedProduct) return null;

// //     const mp = String(selectedProduct.marketplace || "")
// //       .toLowerCase()
// //       .trim();

// //     if (!mp) return null;

// //     if (mp.includes("amazon")) {
// //       const asin =
// //         selectedProduct.marketplaceProductId ||
// //         selectedProduct.asin ||
// //         selectedProduct.sku ||
// //         "";
// //       return {
// //         name: "Amazon",
// //         color: "#FF9500",
// //         icon: <Store />,
// //         url: asin
// //           ? `https://www.amazon.in/review/create-review/?asin=${encodeURIComponent(
// //               asin
// //             )}`
// //           : "https://www.amazon.in/",
// //       };
// //     }

// //     if (mp.includes("flipkart")) {
// //       return {
// //         name: "Flipkart",
// //         color: "#2874F0",
// //         icon: <Store />,
// //         url: "https://www.flipkart.com/",
// //       };
// //     }

// //     return null;
// //   }, [selectedProduct]);

// //   // Effects
// //   useEffect(() => {
// //     if (id) fetchCampaign();
// //   }, [id]);

// //   // Auto-select single product
// //   useEffect(() => {
// //     if (campaign?.products?.length === 1 && !form.selectedProduct) {
// //       setForm((prev) => ({
// //         ...prev,
// //         selectedProduct: campaign.products._id,
// //       }));
// //     }
// //   }, [campaign?.products, form.selectedProduct]);

// //   // API functions
// //   const fetchCampaign = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch(`${API_URL}/public/campaign/${id}`);
// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Campaign not found");
// //       }

// //       setCampaign(data.campaign);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [id]);

// //   // Form handlers
// //   const handleChange = useCallback(
// //     (e) => {
// //       const { name, value } = e.target;
// //       setForm((prev) => ({ ...prev, [name]: value }));

// //       if (formErrors[name]) {
// //         setFormErrors((prev) => ({ ...prev, [name]: "" }));
// //       }
// //     },
// //     [formErrors]
// //   );

// //   const handleRatingChange = useCallback((event, newValue) => {
// //     setForm((prev) => ({ ...prev, satisfaction: newValue || 0 }));
// //   }, []);

// //   const handleSubmit = useCallback(async () => {
// //     try {
// //       setSubmitting(true);
// //       setError("");

// //       const res = await fetch(`${API_URL}/public/campaign/${id}/submit`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(form),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Failed to submit form");
// //       }

// //       setResponse(data);
// //       setSuccess("Form submitted successfully!");
// //       setCurrentStep(3);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   }, [id, form]);

// //   // Validation functions
// //   const validateStep = useCallback(
// //     (step) => {
// //       const errors = {};

// //       switch (step) {
// //         case 0:
// //           if (!form.selectedProduct)
// //             errors.selectedProduct = "Please select a product";
// //           if (!form.orderNumber.trim())
// //             errors.orderNumber = "Order number is required";
// //           if (!form.satisfaction)
// //             errors.satisfaction = "Please rate your satisfaction";
// //           if (!form.usedMoreThan7Days)
// //             errors.usedMoreThan7Days = "Please select an option";
// //           break;
// //         case 1:
// //           if (!form.customerName.trim())
// //             errors.customerName = "Name is required";
// //           if (!form.email.trim()) {
// //             errors.email = "Email is required";
// //           } else if (!/\S+@\S+\.\S+/.test(form.email)) {
// //             errors.email = "Please enter a valid email";
// //           }
// //           if (form.phoneNumber && !/^\+?[\d\s-()]+$/.test(form.phoneNumber)) {
// //             errors.phoneNumber = "Please enter a valid phone number";
// //           }
// //           break;
// //         case 2: {
// //           const needsReview = campaign?.category === "review";
// //           const minLen = campaign?.reviewMinimumLength || 0;

// //           if (needsReview && !form.review.trim()) {
// //             errors.review = "Review is required";
// //           } else if (needsReview && minLen > 0 && form.review.length < minLen) {
// //             errors.review = `Review must be at least ${minLen} characters`;
// //           }
// //           break;
// //         }
// //         default:
// //           break;
// //       }

// //       setFormErrors(errors);
// //       return Object.keys(errors).length === 0;
// //     },
// //     [form, campaign]
// //   );

// //   // Navigation functions
// //   const handleNext = useCallback(() => {
// //     if (!validateStep(currentStep)) {
// //       setError("Please fix the errors before continuing");
// //       return;
// //     }

// //     setError("");
// //     if (currentStep === 2) {
// //       handleSubmit();
// //     } else {
// //       setCurrentStep((prev) => prev + 1);
// //     }
// //   }, [currentStep, validateStep, handleSubmit]);

// //   const handleBack = useCallback(() => {
// //     setCurrentStep((prev) => Math.max(0, prev - 1));
// //     setError("");
// //   }, []);

// //   const handleShareReview = useCallback(async () => {
// //     try {
// //       if (navigator?.clipboard?.writeText) {
// //         await navigator.clipboard.writeText(form.review || "");
// //         setCopied(true);
// //       }
// //     } catch {
// //       // Fallback: ignore if clipboard unavailable
// //     } finally {
// //       if (marketplaceConfig?.url) {
// //         window.open(marketplaceConfig.url, "_blank", "noopener,noreferrer");
// //       }
// //     }
// //   }, [form.review, marketplaceConfig]);

// //   // Step components
// //   const renderStep0 = () => (
// //     <Stack spacing={3}>
// //       <FormControl fullWidth error={!!formErrors.selectedProduct}>
// //         <InputLabel>Select Product *</InputLabel>
// //         <Select
// //           name="selectedProduct"
// //           value={form.selectedProduct}
// //           onChange={handleChange}
// //           label="Select Product *"
// //         >
// //           {campaign?.products?.map((product) => (
// //             <MenuItem key={product._id} value={product._id}>
// //               <Stack direction="row" spacing={1} alignItems="center">
// //                 <Typography>{product.name}</Typography>
// //                 {product.marketplace && (
// //                   <MarketplaceChip
// //                     marketplace={product.marketplace}
// //                     label={product.marketplace}
// //                     size="small"
// //                   />
// //                 )}
// //               </Stack>
// //             </MenuItem>
// //           ))}
// //         </Select>
// //         {formErrors.selectedProduct && (
// //           <Typography variant="caption" color="error" sx={{ mt: 1 }}>
// //             {formErrors.selectedProduct}
// //           </Typography>
// //         )}
// //       </FormControl>

// //       {selectedProduct && (
// //         <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
// //           <Stack direction="row" spacing={2} alignItems="center">
// //             <Store color="primary" />
// //             <Typography variant="body2" color="text.secondary">
// //               Marketplace:
// //             </Typography>
// //             <MarketplaceChip
// //               marketplace={selectedProduct.marketplace}
// //               label={selectedProduct.marketplace}
// //               size="small"
// //             />
// //           </Stack>
// //         </Paper>
// //       )}

// //       <TextField
// //         fullWidth
// //         name="orderNumber"
// //         label="Order Number *"
// //         value={form.orderNumber}
// //         onChange={handleChange}
// //         error={!!formErrors.orderNumber}
// //         helperText={formErrors.orderNumber}
// //         placeholder="Enter your order number"
// //       />

// //       <Box>
// //         <FormLabel component="legend" error={!!formErrors.satisfaction}>
// //           How satisfied are you with the product? *
// //         </FormLabel>
// //         <Box sx={{ mt: 1 }}>
// //           <Rating
// //             name="satisfaction"
// //             value={form.satisfaction}
// //             onChange={handleRatingChange}
// //             size="large"
// //             icon={<Star fontSize="large" />}
// //             emptyIcon={<StarBorder fontSize="large" />}
// //           />
// //         </Box>
// //         {formErrors.satisfaction && (
// //           <Typography variant="caption" color="error">
// //             {formErrors.satisfaction}
// //           </Typography>
// //         )}
// //       </Box>

// //       <FormControl error={!!formErrors.usedMoreThan7Days}>
// //         <FormLabel>
// //           Have you used this product for more than 7 days? *
// //         </FormLabel>
// //         <RadioGroup
// //           name="usedMoreThan7Days"
// //           value={form.usedMoreThan7Days}
// //           onChange={handleChange}
// //           row
// //         >
// //           <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
// //           <FormControlLabel value="No" control={<Radio />} label="No" />
// //         </RadioGroup>
// //         {formErrors.usedMoreThan7Days && (
// //           <Typography variant="caption" color="error">
// //             {formErrors.usedMoreThan7Days}
// //           </Typography>
// //         )}
// //       </FormControl>
// //     </Stack>
// //   );

// //   const renderStep1 = () => (
// //     <Stack spacing={3}>
// //       <TextField
// //         fullWidth
// //         name="customerName"
// //         label="Your Name *"
// //         value={form.customerName}
// //         onChange={handleChange}
// //         error={!!formErrors.customerName}
// //         helperText={formErrors.customerName}
// //         placeholder="Enter your full name"
// //         InputProps={{
// //           startAdornment: (
// //             <InputAdornment position="start">
// //               <Person color="action" />
// //             </InputAdornment>
// //           ),
// //         }}
// //       />

// //       <TextField
// //         fullWidth
// //         name="email"
// //         label="Email Address *"
// //         type="email"
// //         value={form.email}
// //         onChange={handleChange}
// //         error={!!formErrors.email}
// //         helperText={formErrors.email || "Your offer will be sent to this email"}
// //         placeholder="Enter your email address"
// //         InputProps={{
// //           startAdornment: (
// //             <InputAdornment position="start">
// //               <Email color="action" />
// //             </InputAdornment>
// //           ),
// //         }}
// //       />

// //       <TextField
// //         fullWidth
// //         name="phoneNumber"
// //         label="Phone Number"
// //         type="tel"
// //         value={form.phoneNumber}
// //         onChange={handleChange}
// //         error={!!formErrors.phoneNumber}
// //         helperText={formErrors.phoneNumber}
// //         placeholder="+91 - XXXXXXXXXX"
// //         InputProps={{
// //           startAdornment: (
// //             <InputAdornment position="start">
// //               <Phone color="action" />
// //             </InputAdornment>
// //           ),
// //         }}
// //       />
// //     </Stack>
// //   );

// //   const renderStep2 = () => (
// //     <Stack spacing={3}>
// //       {selectedProduct && (
// //         <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
// //           <Typography variant="h6" gutterBottom>
// //             {selectedProduct.name}
// //           </Typography>
// //           {selectedProduct.image && (
// //             <Avatar
// //               src={selectedProduct.image}
// //               alt={selectedProduct.name}
// //               sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
// //             />
// //           )}
// //           <Stack direction="row" spacing={1} justifyContent="center">
// //             <Rating value={form.satisfaction} readOnly size="small" />
// //             <Typography variant="body2" color="text.secondary">
// //               ({form.satisfaction}/5)
// //             </Typography>
// //           </Stack>
// //         </Paper>
// //       )}

// //       <TextField
// //         fullWidth
// //         name="review"
// //         label={`How do you like our ${selectedProduct?.name || "product"}?`}
// //         multiline
// //         rows={4}
// //         value={form.review}
// //         onChange={handleChange}
// //         error={!!formErrors.review}
// //         helperText={
// //           formErrors.review ||
// //           `${form.review.length}${
// //             campaign?.reviewMinimumLength
// //               ? `/${campaign.reviewMinimumLength}`
// //               : ""
// //           } characters`
// //         }
// //         placeholder="Share your experience with this product..."
// //       />

// //       {marketplaceConfig && form.satisfaction >= 4 && (
// //         <Paper>
// //           <Button
// //             fullWidth
// //             variant="contained"
// //             onClick={handleShareReview}
// //             sx={{
// //               bgcolor: marketplaceConfig.color,
// //               "&:hover": { bgcolor: marketplaceConfig.color, opacity: 0.9 },
// //             }}
// //             startIcon={marketplaceConfig.icon}
// //           >
// //             Review on {marketplaceConfig.name}
// //           </Button>
// //         </Paper>
// //       )}
// //     </Stack>
// //   );

// //   const renderStep3 = () => (
// //     <Stack spacing={3} alignItems="center" textAlign="center">
// //       <Box sx={{ fontSize: "4rem" }}>🎉</Box>

// //       <Typography variant="h4" color="primary">
// //         {response?.shouldShowReward && response?.promotion
// //           ? "Congratulations!"
// //           : "Thank You!"}
// //       </Typography>

// //       {response?.shouldShowReward && response?.promotion ? (
// //         <Paper
// //           elevation={3}
// //           sx={{ p: 3, bgcolor: "success.light", maxWidth: 400 }}
// //         >
// //           <Stack spacing={2} alignItems="center">
// //             <Box sx={{ fontSize: "2rem" }}>🎁</Box>
// //             <Typography variant="h6" sx={{ color: "success.main" }}>
// //               Here is your gift!
// //             </Typography>
// //             <Typography variant="h5" fontWeight="bold" color="primary">
// //               {response.promotion.name}
// //             </Typography>
// //             <Typography variant="body1" color="text.secondary">
// //               {response.promotion.description}
// //             </Typography>
// //             {response.promotion.provider && (
// //               <Chip
// //                 label={`Provider: ${response.promotion.provider}`}
// //                 color="primary"
// //                 variant="outlined"
// //               />
// //             )}
// //           </Stack>
// //         </Paper>
// //       ) : (
// //         <Paper
// //           elevation={2}
// //           sx={{ p: 3, bgcolor: "info.light", maxWidth: 400 }}
// //         >
// //           <Typography variant="body1" sx={{ color: "info.main" }}>
// //             Thanks for the feedback! It helps improve the product.
// //           </Typography>
// //         </Paper>
// //       )}

// //       <Typography variant="body2" color="text.secondary">
// //         We appreciate the time taken to share the experience!
// //       </Typography>
// //     </Stack>
// //   );

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <Container maxWidth="sm" sx={{ py: 4 }}>
// //         <StyledCard>
// //           <Skeleton variant="rectangular" height={120} />
// //           <CardContent>
// //             <Stack spacing={2}>
// //               <Skeleton variant="text" height={40} />
// //               <Skeleton variant="rectangular" height={56} />
// //               <Skeleton variant="rectangular" height={56} />
// //               <Skeleton variant="rectangular" height={100} />
// //             </Stack>
// //           </CardContent>
// //         </StyledCard>
// //       </Container>
// //     );
// //   }

// //   // Error state
// //   if (error && !campaign) {
// //     return (
// //       <Container maxWidth="sm" sx={{ py: 4 }}>
// //         <StyledCard>
// //           <CardContent sx={{ textAlign: "center", py: 4 }}>
// //             <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
// //             <Typography variant="h5" gutterBottom>
// //               Campaign Not Found
// //             </Typography>
// //             <Typography variant="body1" color="text.secondary" paragraph>
// //               {error}
// //             </Typography>
// //             <Button variant="outlined" onClick={() => navigate("/")}>
// //               Go Home
// //             </Button>
// //           </CardContent>
// //         </StyledCard>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <Container maxWidth="sm" sx={{ py: 2 }}>
// //       <StyledCard>
// //         {/* Header */}
// //         <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
// //           <Typography variant="h5" fontWeight="bold" gutterBottom>
// //             {campaign?.name || "$50 Amazon Gift Voucher 🎁"}
// //           </Typography>
// //           <Typography variant="body2" sx={{ opacity: 0.9 }}>
// //             {campaign?.customization?.customMessage ||
// //               "We'd love to hear about your experience!"}
// //           </Typography>
// //           {campaign?.seller?.name && (
// //             <Typography
// //               variant="caption"
// //               sx={{ opacity: 0.8, display: "block", mt: 1 }}
// //             >
// //               By {campaign.seller.name}
// //             </Typography>
// //           )}
// //         </GradientHeader>

// //         {/* Stepper */}
// //         <Box sx={{ px: 2, pt: 2 }}>
// //           <StyledStepper activeStep={currentStep} alternativeLabel={isMobile}>
// //             {steps.map((step, index) => (
// //               <Step key={step.label}>
// //                 <StepLabel
// //                   icon={
// //                     <Box
// //                       sx={{
// //                         color:
// //                           index <= currentStep ? "primary.main" : "grey.400",
// //                         display: "flex",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                       }}
// //                     >
// //                       {index < currentStep ? <CheckCircle /> : step.icon}
// //                     </Box>
// //                   }
// //                 >
// //                   {!isMobile && step.label}
// //                 </StepLabel>
// //               </Step>
// //             ))}
// //           </StyledStepper>
// //         </Box>

// //         {/* Content */}
// //         <CardContent sx={{ px: 3, pb: 2 }}>
// //           <Fade in timeout={300}>
// //             <Box>
// //               {currentStep === 0 && renderStep0()}
// //               {currentStep === 1 && renderStep1()}
// //               {currentStep === 2 && renderStep2()}
// //               {currentStep === 3 && renderStep3()}
// //             </Box>
// //           </Fade>

// //           {/* Error Alert */}
// //           {error && currentStep < 3 && (
// //             <Alert severity="error" sx={{ mt: 2 }}>
// //               {error}
// //             </Alert>
// //           )}
// //         </CardContent>

// //         {/* Footer Navigation */}
// //         {currentStep < 3 && (
// //           <>
// //             <Divider />
// //             <Box
// //               sx={{
// //                 p: 2,
// //                 display: "flex",
// //                 justifyContent: "space-between",
// //                 alignItems: "center",
// //               }}
// //             >
// //               <Button
// //                 onClick={handleBack}
// //                 disabled={currentStep === 0 || submitting}
// //                 startIcon={<ArrowBack />}
// //                 variant="outlined"
// //               >
// //                 Back
// //               </Button>

// //               <Typography variant="body2" color="text.secondary">
// //                 Step {currentStep + 1} of {steps.length - 1}
// //               </Typography>

// //               <Button
// //                 onClick={handleNext}
// //                 disabled={submitting}
// //                 endIcon={
// //                   submitting ? <CircularProgress size={16} /> : <ArrowForward />
// //                 }
// //                 variant="contained"
// //               >
// //                 {currentStep === 2 ? "Submit" : "Next"}
// //               </Button>
// //             </Box>
// //           </>
// //         )}
// //       </StyledCard>

// //       {/* Success Snackbar */}
// //       <Snackbar
// //         open={!!success}
// //         autoHideDuration={6000}
// //         onClose={() => setSuccess("")}
// //         anchorOrigin={{ vertical: "top", horizontal: "center" }}
// //       >
// //         <Alert onClose={() => setSuccess("")} severity="success">
// //           {success}
// //         </Alert>
// //       </Snackbar>

// //       {/* Copied Snackbar */}
// //       <Snackbar
// //         open={copied}
// //         autoHideDuration={2500}
// //         onClose={() => setCopied(false)}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// //       >
// //         <Alert onClose={() => setCopied(false)} severity="info">
// //           Review copied to clipboard!
// //         </Alert>
// //       </Snackbar>
// //     </Container>
// //   );
// // }
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Card,
//   CardContent,
//   Stepper,
//   Step,
//   StepLabel,
//   Typography,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Rating,
//   Alert,
//   CircularProgress,
//   Avatar,
//   Chip,
//   Divider,
//   Stack,
//   useTheme,
//   useMediaQuery,
//   Skeleton,
//   Snackbar,
//   Fade,
//   Paper,
//   Container,
//   InputAdornment,
// } from "@mui/material";
// import {
//   ArrowBack,
//   ArrowForward,
//   CheckCircle,
//   Error as ErrorIcon,
//   Star,
//   StarBorder,
//   ShoppingCart,
//   Person,
//   RateReview,
//   Celebration,
//   Email,
//   Phone,
//   Store,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import { API_URL } from "../config/api";

// // Styled components
// const StyledCard = styled(Card)(({ theme }) => ({
//   maxWidth: 480,
//   margin: "0 auto",
//   borderRadius: theme.spacing(2),
//   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//   overflow: "hidden",
// }));

// const GradientHeader = styled(Box, {
//   shouldForwardProp: (prop) => prop !== "primaryColor",
// })(({ theme, primaryColor }) => ({
//   background: primaryColor
//     ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
//     : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//   color: "white",
//   padding: theme.spacing(3),
//   textAlign: "center",
//   position: "relative",
//   overflow: "hidden",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: -50,
//     right: -50,
//     width: 100,
//     height: 100,
//     borderRadius: "50%",
//     background: "rgba(255,255,255,0.1)",
//   },
//   "&::after": {
//     content: '""',
//     position: "absolute",
//     bottom: -30,
//     left: -30,
//     width: 60,
//     height: 60,
//     borderRadius: "50%",
//     background: "rgba(255,255,255,0.1)",
//   },
// }));

// const StyledStepper = styled(Stepper)(({ theme }) => ({
//   padding: theme.spacing(2, 0),
//   "& .MuiStepIcon-root": {
//     fontSize: "1.5rem",
//   },
//   "& .MuiStepIcon-text": {
//     fontSize: "0.875rem",
//     fontWeight: "bold",
//   },
// }));

// const MarketplaceChip = styled(Chip, {
//   shouldForwardProp: (prop) => prop !== "marketplace",
// })(({ marketplace }) => ({
//   fontWeight: "bold",
//   "& .MuiChip-label": {
//     paddingLeft: 8,
//     paddingRight: 8,
//   },
//   ...(String(marketplace).toLowerCase().includes("amazon") && {
//     backgroundColor: "#FF9500",
//     color: "white",
//   }),
//   ...(String(marketplace).toLowerCase().includes("flipkart") && {
//     backgroundColor: "#2874F0",
//     color: "white",
//   }),
// }));

// const steps = [
//   { label: "Product Details", icon: <ShoppingCart /> },
//   { label: "Personal Info", icon: <Person /> },
//   { label: "Review", icon: <RateReview /> },
//   { label: "Complete", icon: <Celebration /> },
// ];

// // Map numeric rating (1–5) to satisfaction text
// function mapRatingToSatisfaction(rating) {
//   if (!rating) return "";
//   if (rating >= 4) return "Very satisfied";
//   if (rating === 3) return "Somewhat satisfied";
//   return "Not satisfied";
// }

// export default function PublicCampaignForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   // State management
//   const [campaign, setCampaign] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [response, setResponse] = useState(null);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formErrors, setFormErrors] = useState({});
//   const [copied, setCopied] = useState(false);

//   const [form, setForm] = useState({
//     selectedProduct: "",
//     orderNumber: "",
//     satisfaction: 0, // numeric 1–5
//     usedMoreThan7Days: "",
//     customerName: "",
//     email: "",
//     phoneNumber: "",
//     review: "",
//     // new fields
//     clickedMarketplaceButton: false,
//   });

//   // Selected product memo
//   const selectedProduct = useMemo(
//     () => campaign?.products?.find((p) => p._id === form.selectedProduct),
//     [campaign?.products, form.selectedProduct]
//   );

//   // Marketplace config via ASIN/FSN
//   const marketplaceConfig = useMemo(() => {
//     if (!selectedProduct) return null;

//     if (selectedProduct.amazonAsin) {
//       return {
//         name: "Amazon",
//         color: "#FF9500",
//         icon: <Store />,
//         url: `https://www.amazon.in/review/create-review/?asin=${encodeURIComponent(
//           selectedProduct.amazonAsin
//         )}`,
//       };
//     }
//     if (selectedProduct.flipkartFsn) {
//       // Flipkart reviews are left from the product/order context, not a single universal "create-review" URL
//       return {
//         name: "Flipkart",
//         color: "#2874F0",
//         icon: <Store />,
//         url: "https://www.flipkart.com/",
//       };
//     }
//     return null;
//   }, [selectedProduct]);

//   // Effects
//   useEffect(() => {
//     if (id) fetchCampaign();
//   }, [id]);

//   useEffect(() => {
//     if (campaign?.products?.length === 1 && !form.selectedProduct) {
//       setForm((prev) => ({
//         ...prev,
//         selectedProduct: campaign.products._id, // fix: index 0, not products._id
//       }));
//     }
//   }, [campaign?.products, form.selectedProduct]);

//   // API functions
//   const fetchCampaign = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_URL}/public/campaign/${id}`);
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Campaign not found");
//       }
//       setCampaign(data.campaign);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   // Form handlers
//   const handleChange = useCallback(
//     (e) => {
//       const { name, value } = e.target;
//       setForm((prev) => ({ ...prev, [name]: value }));
//       if (formErrors[name]) {
//         setFormErrors((prev) => ({ ...prev, [name]: "" }));
//       }
//     },
//     [formErrors]
//   );

//   const handleRatingChange = useCallback((event, newValue) => {
//     setForm((prev) => ({ ...prev, satisfaction: newValue || 0 }));
//   }, []);

//   const handleShareReview = useCallback(async () => {
//     try {
//       if (navigator?.clipboard?.writeText) {
//         await navigator.clipboard.writeText(form.review || "");
//         setCopied(true);
//       }
//     } catch {
//       // ignore clipboard errors
//     } finally {
//       if (marketplaceConfig?.url) {
//         setForm((prev) => ({ ...prev, clickedMarketplaceButton: true }));
//         window.open(marketplaceConfig.url, "_blank", "noopener,noreferrer");
//       }
//     }
//   }, [form.review, marketplaceConfig]);

//   const handleSubmit = useCallback(async () => {
//     try {
//       setSubmitting(true);
//       setError("");

//       // Map numeric to satisfaction string and include marketplace name
//       const satisfactionText = mapRatingToSatisfaction(form.satisfaction);
//       const submission = {
//         ...form,
//         satisfaction: satisfactionText, // textual version
//         rating: form.satisfaction, // numeric version (keep both for robustness)
//         marketplace: marketplaceConfig?.name || "",
//       };

//       const res = await fetch(`${API_URL}/public/campaign/${id}/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(submission),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to submit form");
//       setResponse(data);
//       setSuccess("Form submitted successfully!");
//       setCurrentStep(3);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }, [id, form, marketplaceConfig]);

//   // Validation
//   const validateStep = useCallback(
//     (step) => {
//       const errors = {};
//       switch (step) {
//         case 0:
//           if (!form.selectedProduct)
//             errors.selectedProduct = "Please select a product";
//           if (!form.orderNumber.trim())
//             errors.orderNumber = "Order number is required";
//           if (!form.satisfaction)
//             errors.satisfaction = "Please rate your satisfaction";
//           if (!form.usedMoreThan7Days)
//             errors.usedMoreThan7Days = "Please select an option";
//           break;
//         case 1:
//           if (!form.customerName.trim())
//             errors.customerName = "Name is required";
//           if (!form.email.trim()) {
//             errors.email = "Email is required";
//           } else if (!/\S+@\S+\.\S+/.test(form.email)) {
//             errors.email = "Please enter a valid email";
//           }
//           if (form.phoneNumber && !/^\+?[\d\s-()]+$/.test(form.phoneNumber)) {
//             errors.phoneNumber = "Please enter a valid phone number";
//           }
//           break;
//         case 2: {
//           const needsReview = campaign?.category === "review";
//           const minLen = campaign?.reviewMinimumLength || 0;
//           if (needsReview && !form.review.trim()) {
//             errors.review = "Review is required";
//           } else if (needsReview && minLen > 0 && form.review.length < minLen) {
//             errors.review = `Review must be at least ${minLen} characters`;
//           }
//           break;
//         }
//         default:
//           break;
//       }
//       setFormErrors(errors);
//       return Object.keys(errors).length === 0;
//     },
//     [form, campaign]
//   );

//   // Navigation
//   const handleNext = useCallback(() => {
//     if (!validateStep(currentStep)) {
//       setError("Please fix the errors before continuing");
//       return;
//     }
//     setError("");
//     if (currentStep === 2) {
//       handleSubmit();
//     } else {
//       setCurrentStep((prev) => prev + 1);
//     }
//   }, [currentStep, validateStep, handleSubmit]);

//   const handleBack = useCallback(() => {
//     setCurrentStep((prev) => Math.max(0, prev - 1));
//     setError("");
//   }, []);

//   // Step renderers
//   const renderStep0 = () => (
//     <Stack spacing={3}>
//       <FormControl fullWidth error={!!formErrors.selectedProduct}>
//         <InputLabel>Select Product *</InputLabel>
//         <Select
//           name="selectedProduct"
//           value={form.selectedProduct}
//           onChange={handleChange}
//           label="Select Product *"
//         >
//           {campaign?.products?.map((product) => {
//             const badges = [];
//             if (product.amazonAsin) badges.push("Amazon");
//             if (product.flipkartFsn) badges.push("Flipkart");
//             return (
//               <MenuItem key={product._id} value={product._id}>
//                 <Stack direction="row" spacing={1} alignItems="center">
//                   <Typography>{product.name}</Typography>
//                   {badges.map((b) => (
//                     <MarketplaceChip
//                       key={b}
//                       marketplace={b}
//                       label={b}
//                       size="small"
//                     />
//                   ))}
//                 </Stack>
//               </MenuItem>
//             );
//           })}
//         </Select>
//         {formErrors.selectedProduct && (
//           <Typography variant="caption" color="error" sx={{ mt: 1 }}>
//             {formErrors.selectedProduct}
//           </Typography>
//         )}
//       </FormControl>

//       {selectedProduct && (
//         <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Store color="primary" />
//             <Typography variant="body2" color="text.secondary">
//               Marketplace:
//             </Typography>
//             {selectedProduct.amazonAsin && (
//               <MarketplaceChip
//                 marketplace="Amazon"
//                 label="Amazon"
//                 size="small"
//               />
//             )}
//             {selectedProduct.flipkartFsn && (
//               <MarketplaceChip
//                 marketplace="Flipkart"
//                 label="Flipkart"
//                 size="small"
//               />
//             )}
//           </Stack>
//         </Paper>
//       )}

//       <TextField
//         fullWidth
//         name="orderNumber"
//         label="Order Number *"
//         value={form.orderNumber}
//         onChange={handleChange}
//         error={!!formErrors.orderNumber}
//         helperText={formErrors.orderNumber}
//         placeholder="Enter your order number"
//       />

//       <Box>
//         <FormLabel component="legend" error={!!formErrors.satisfaction}>
//           How satisfied are you with the product? *
//         </FormLabel>
//         <Box sx={{ mt: 1 }}>
//           <Rating
//             name="satisfaction"
//             value={form.satisfaction}
//             onChange={handleRatingChange}
//             size="large"
//             icon={<Star fontSize="large" />}
//             emptyIcon={<StarBorder fontSize="large" />}
//           />
//         </Box>
//         {formErrors.satisfaction && (
//           <Typography variant="caption" color="error">
//             {formErrors.satisfaction}
//           </Typography>
//         )}
//       </Box>

//       <FormControl error={!!formErrors.usedMoreThan7Days}>
//         <FormLabel>
//           Have you used this product for more than 7 days? *
//         </FormLabel>
//         <RadioGroup
//           name="usedMoreThan7Days"
//           value={form.usedMoreThan7Days}
//           onChange={handleChange}
//           row
//         >
//           <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
//           <FormControlLabel value="No" control={<Radio />} label="No" />
//         </RadioGroup>
//         {formErrors.usedMoreThan7Days && (
//           <Typography variant="caption" color="error">
//             {formErrors.usedMoreThan7Days}
//           </Typography>
//         )}
//       </FormControl>
//     </Stack>
//   );

//   const renderStep1 = () => (
//     <Stack spacing={3}>
//       <TextField
//         fullWidth
//         name="customerName"
//         label="Your Name *"
//         value={form.customerName}
//         onChange={handleChange}
//         error={!!formErrors.customerName}
//         helperText={formErrors.customerName}
//         placeholder="Enter your full name"
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Person color="action" />
//             </InputAdornment>
//           ),
//         }}
//       />

//       <TextField
//         fullWidth
//         name="email"
//         label="Email Address *"
//         type="email"
//         value={form.email}
//         onChange={handleChange}
//         error={!!formErrors.email}
//         helperText={formErrors.email || "Your offer will be sent to this email"}
//         placeholder="Enter your email address"
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Email color="action" />
//             </InputAdornment>
//           ),
//         }}
//       />

//       <TextField
//         fullWidth
//         name="phoneNumber"
//         label="Phone Number"
//         type="tel"
//         value={form.phoneNumber}
//         onChange={handleChange}
//         error={!!formErrors.phoneNumber}
//         helperText={formErrors.phoneNumber}
//         placeholder="+91 - XXXXXXXXXX"
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Phone color="action" />
//             </InputAdornment>
//           ),
//         }}
//       />
//     </Stack>
//   );

//   const renderStep2 = () => (
//     <Stack spacing={3}>
//       {selectedProduct && (
//         <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
//           <Typography variant="h6" gutterBottom>
//             {selectedProduct.name}
//           </Typography>
//           {selectedProduct.imageurl && (
//             <Avatar
//               src={selectedProduct.imageurl}
//               alt={selectedProduct.name}
//               sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
//             />
//           )}
//           <Stack direction="row" spacing={1} justifyContent="center">
//             <Rating value={form.satisfaction} readOnly size="small" />
//             <Typography variant="body2" color="text.secondary">
//               ({form.satisfaction}/5)
//             </Typography>
//           </Stack>
//         </Paper>
//       )}

//       <TextField
//         fullWidth
//         name="review"
//         label={`How do you like our ${selectedProduct?.name || "product"}?`}
//         multiline
//         rows={4}
//         value={form.review}
//         onChange={handleChange}
//         error={!!formErrors.review}
//         helperText={
//           formErrors.review ||
//           `${form.review.length}${
//             campaign?.reviewMinimumLength
//               ? `/${campaign.reviewMinimumLength}`
//               : ""
//           } characters`
//         }
//         placeholder="Share your experience with this product..."
//       />

//       {marketplaceConfig && form.satisfaction >= 4 && (
//         <Paper>
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={handleShareReview}
//             sx={{
//               bgcolor: marketplaceConfig.color,
//               "&:hover": { bgcolor: marketplaceConfig.color, opacity: 0.9 },
//             }}
//             startIcon={marketplaceConfig.icon}
//           >
//             Review on {marketplaceConfig.name}
//           </Button>
//         </Paper>
//       )}
//     </Stack>
//   );

//   const renderStep3 = () => (
//     <Stack spacing={3} alignItems="center" textAlign="center">
//       <Box sx={{ fontSize: "4rem" }}>🎉</Box>
//       <Typography variant="h4" color="primary">
//         {response?.shouldShowReward && response?.promotion
//           ? "Congratulations!"
//           : "Thank You!"}
//       </Typography>

//       {response?.shouldShowReward && response?.promotion ? (
//         <Paper
//           elevation={3}
//           sx={{ p: 3, bgcolor: "success.light", maxWidth: 400 }}
//         >
//           <Stack spacing={2} alignItems="center">
//             <Box sx={{ fontSize: "2rem" }}>🎁</Box>
//             <Typography variant="h6" sx={{ color: "success.main" }}>
//               Here is your gift!
//             </Typography>
//             <Typography variant="h5" fontWeight="bold" color="primary">
//               {response.promotion.name}
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               {response.promotion.description}
//             </Typography>
//             {response.promotion.provider && (
//               <Chip
//                 label={`Provider: ${response.promotion.provider}`}
//                 color="primary"
//                 variant="outlined"
//               />
//             )}
//           </Stack>
//         </Paper>
//       ) : (
//         <Paper
//           elevation={2}
//           sx={{ p: 3, bgcolor: "info.light", maxWidth: 400 }}
//         >
//           <Typography variant="body1" sx={{ color: "info.main" }}>
//             Thanks for the feedback! It helps improve the product.
//           </Typography>
//         </Paper>
//       )}

//       <Typography variant="body2" color="text.secondary">
//         We appreciate the time taken to share the experience!
//       </Typography>
//     </Stack>
//   );

//   // Loading state
//   if (loading) {
//     return (
//       <Container maxWidth="sm" sx={{ py: 4 }}>
//         <StyledCard>
//           <Skeleton variant="rectangular" height={120} />
//           <CardContent>
//             <Stack spacing={2}>
//               <Skeleton variant="text" height={40} />
//               <Skeleton variant="rectangular" height={56} />
//               <Skeleton variant="rectangular" height={56} />
//               <Skeleton variant="rectangular" height={100} />
//             </Stack>
//           </CardContent>
//         </StyledCard>
//       </Container>
//     );
//   }

//   // Error state
//   if (error && !campaign) {
//     return (
//       <Container maxWidth="sm" sx={{ py: 4 }}>
//         <StyledCard>
//           <CardContent sx={{ textAlign: "center", py: 4 }}>
//             <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
//             <Typography variant="h5" gutterBottom>
//               Campaign Not Found
//             </Typography>
//             <Typography variant="body1" color="text.secondary" paragraph>
//               {error}
//             </Typography>
//             <Button variant="outlined" onClick={() => navigate("/")}>
//               Go Home
//             </Button>
//           </CardContent>
//         </StyledCard>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="sm" sx={{ py: 2 }}>
//       <StyledCard>
//         {/* Header */}
//         <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             {campaign?.name || "$50 Amazon Gift Voucher 🎁"}
//           </Typography>
//           <Typography variant="body2" sx={{ opacity: 0.9 }}>
//             {campaign?.customization?.customMessage ||
//               "We'd love to hear about your experience!"}
//           </Typography>
//           {campaign?.seller?.name && (
//             <Typography
//               variant="caption"
//               sx={{ opacity: 0.8, display: "block", mt: 1 }}
//             >
//               By {campaign.seller.name}
//             </Typography>
//           )}
//         </GradientHeader>

//         {/* Stepper */}
//         <Box sx={{ px: 2, pt: 2 }}>
//           <StyledStepper activeStep={currentStep} alternativeLabel={isMobile}>
//             {steps.map((step, index) => (
//               <Step key={step.label}>
//                 <StepLabel
//                   icon={
//                     <Box
//                       sx={{
//                         color:
//                           index <= currentStep ? "primary.main" : "grey.400",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {index < currentStep ? <CheckCircle /> : step.icon}
//                     </Box>
//                   }
//                 >
//                   {!isMobile && step.label}
//                 </StepLabel>
//               </Step>
//             ))}
//           </StyledStepper>
//         </Box>

//         {/* Content */}
//         <CardContent sx={{ px: 3, pb: 2 }}>
//           <Fade in timeout={300}>
//             <Box>
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
//         {currentStep < 3 && (
//           <>
//             <Divider />
//             <Box
//               sx={{
//                 p: 2,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Button
//                 onClick={handleBack}
//                 disabled={currentStep === 0 || submitting}
//                 startIcon={<ArrowBack />}
//                 variant="outlined"
//               >
//                 Back
//               </Button>

//               <Typography variant="body2" color="text.secondary">
//                 Step {currentStep + 1} of {steps.length - 1}
//               </Typography>

//               <Button
//                 onClick={handleNext}
//                 disabled={submitting}
//                 endIcon={
//                   submitting ? <CircularProgress size={16} /> : <ArrowForward />
//                 }
//                 variant="contained"
//               >
//                 {currentStep === 2 ? "Submit" : "Next"}
//               </Button>
//             </Box>
//           </>
//         )}
//       </StyledCard>

//       {/* Success Snackbar */}
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

//       {/* Copied Snackbar */}
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
  useTheme,
  useMediaQuery,
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
  ...(String(marketplace).toLowerCase().includes("amazon") && {
    backgroundColor: "#FF9500",
    color: "white",
  }),
  ...(String(marketplace).toLowerCase().includes("flipkart") && {
    backgroundColor: "#2874F0",
    color: "white",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    if (!selectedProduct) return [];
    const arr = [];
    if (selectedProduct.amazonAsin) {
      arr.push({
        name: "Amazon",
        color: "#FF9500",
        icon: <Store />,
        url: `https://www.amazon.in/review/create-review/?asin=${encodeURIComponent(
          selectedProduct.amazonAsin
        )}`,
      });
    }
    if (selectedProduct.flipkartFsn) {
      arr.push({
        name: "Flipkart",
        color: "#2874F0",
        icon: <Store />,
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

  // Step renderers
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
                    {badges.map((b) => (
                      <MarketplaceChip
                        key={b}
                        marketplace={b}
                        label={b}
                        size="small"
                      />
                    ))}
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

        {selectedProduct && (
          <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Store color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Marketplace:
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

              {/* Only show selection when both are available */}
              {bothAvailable && (
                <FormControl error={!!formErrors.marketplace}>
                  <FormLabel>Choose marketplace *</FormLabel>
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

        <TextField
          fullWidth
          name="orderNumber"
          label="Order Number *"
          value={form.orderNumber}
          onChange={handleChange}
          error={!!formErrors.orderNumber}
          helperText={formErrors.orderNumber}
          placeholder="Enter your order number"
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
        label="Your Name *"
        value={form.customerName}
        onChange={handleChange}
        error={!!formErrors.customerName}
        helperText={formErrors.customerName}
        placeholder="Enter your full name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="email"
        label="Email Address *"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email || "Your offer will be sent to this email"}
        placeholder="Enter your email address"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="phoneNumber"
        label="Phone Number"
        type="tel"
        value={form.phoneNumber}
        onChange={handleChange}
        error={!!formErrors.phoneNumber}
        helperText={formErrors.phoneNumber}
        placeholder="+91 - XXXXXXXXXX"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone color="action" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );

  const renderStep2 = () => (
    <Stack spacing={3}>
      {selectedProduct && (
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {selectedProduct.name}
          </Typography>
          {selectedProduct.imageurl && (
            <Avatar
              src={selectedProduct.imageurl}
              alt={selectedProduct.name}
              sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
            />
          )}
          <Stack direction="row" spacing={1} justifyContent="center">
            <Rating value={form.satisfaction} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              ({form.satisfaction}/5)
            </Typography>
          </Stack>
        </Paper>
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
        placeholder="Share your experience with this product..."
      />

      {selectedMarketplaceConfig && form.satisfaction >= 4 && (
        <Paper>
          <Button
            fullWidth
            variant="contained"
            onClick={handleShareReview}
            sx={{
              bgcolor: selectedMarketplaceConfig.color,
              "&:hover": {
                bgcolor: selectedMarketplaceConfig.color,
                opacity: 0.9,
              },
            }}
            startIcon={selectedMarketplaceConfig.icon}
          >
            Review on {selectedMarketplaceConfig.name}
          </Button>
        </Paper>
      )}
    </Stack>
  );

  const renderStep3 = () => (
    <Stack spacing={3} alignItems="center" textAlign="center">
      <Box sx={{ fontSize: "4rem" }}></Box>
      <Typography variant="h4" color="primary">
        {response?.shouldShowReward && response?.reward
          ? "Congratulations!"
          : "Thank You!"}
      </Typography>

      {response?.shouldShowReward && response?.reward ? (
        <Paper
          elevation={3}
          sx={{ p: 3, maxWidth: 400 }}
        >
          <Stack spacing={2} alignItems="center">
                 <Typography variant="body2" color="text.primary">
              Use code <strong>{response.reward.codeValue}</strong> at checkout of your next purchase.
            </Typography>
            {/* <Box sx={{ fontSize: "2rem" }}>🎁</Box> */}
            {/* <Typography variant="h6">Here is your discount coupon</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {response.reward.name}
            </Typography> */}
            {response.reward.description && (
              <Typography variant="body1" color="text.secondary">
                {response.reward.description}
              </Typography>
            )}
            {/* //display code
            //  */}
       
          </Stack>
        </Paper>
      ) : (
        <Paper
          elevation={2}
          sx={{ p: 3, bgcolor: "info.light", maxWidth: 400 }}
        >
          <Typography variant="body1" sx={{ color: "info.main" }}>
            Thanks for the feedback! It helps improve the product.
          </Typography>
        </Paper>
      )}

      <Typography variant="body2" color="text.secondary">
        We appreciate the time taken to share the experience!
      </Typography>
    </Stack>
  );

  // Loading state
  if (loading) {
    return (
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
    );
  }

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

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <StyledCard>
        {/* Header */}
        <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {campaign?.name || "$50 Amazon Gift Voucher 🎁"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {campaign?.customization?.customMessage ||
              "We'd love to hear about your experience!"}
          </Typography>
          {campaign?.seller?.name && (
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, display: "block", mt: 1 }}
            >
              By {campaign.seller.name}
            </Typography>
          )}
        </GradientHeader>

        {/* Stepper */}
        <Box sx={{ px: 2, pt: 2 }}>
          <StyledStepper activeStep={currentStep} alternativeLabel={isMobile}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  icon={
                    <Box
                      sx={{
                        color:
                          index <= currentStep ? "primary.main" : "grey.400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index < currentStep ? <CheckCircle /> : step.icon}
                    </Box>
                  }
                >
                  {!isMobile && step.label}
                </StepLabel>
              </Step>
            ))}
          </StyledStepper>
        </Box>

        {/* Content */}
        <CardContent sx={{ px: 3, pb: 2 }}>
          <Fade in timeout={300}>
            <Box>
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

        {/* Footer Navigation */}
        {currentStep < 3 && (
          <>
            <Divider />
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleBack}
                disabled={currentStep === 0 || submitting}
                startIcon={<ArrowBack />}
                variant="outlined"
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
                  submitting ? <CircularProgress size={16} /> : <ArrowForward />
                }
                variant="contained"
              >
                {currentStep === 2 ? "Submit" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </StyledCard>

      {/* Success Snackbar */}
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

      {/* Copied Snackbar */}
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
