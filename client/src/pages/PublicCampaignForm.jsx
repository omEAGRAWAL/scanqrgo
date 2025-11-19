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
//   // useTheme,
//   // useMediaQuery,
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
// import { SiFlipkart } from "react-icons/si";
// import { FaAmazon } from "react-icons/fa";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github.css"; // You can use 'atom-one-dark.css' for dark mode

// // import rev from "../assets/Reviu_Logo.png";

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
//   ...(String(marketplace).toLowerCase().includes("amazon") &&
//     {
//       // backgroundColor: "#FF9500",
//       // color: "white",
//     }),
//   ...(String(marketplace).toLowerCase().includes("flipkart") &&
//     {
//       // backgroundColor: "#2874F0",
//       // color: "white",
//     }),
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
//   // const theme = useTheme();
//   // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
//     usedMoreDays: "",
//     customerName: "",
//     email: "",
//     phoneNumber: "",
//     review: "",
//     clickedMarketplaceButton: false,
//     marketplace: "", // NEW: user-selected marketplace
//   });

//   // Selected product memo
//   const selectedProduct = useMemo(
//     () => campaign?.products?.find((p) => p._id === form.selectedProduct),
//     [campaign?.products, form.selectedProduct]
//   );

//   // Available marketplaces for the selected product
//   const marketplaces = useMemo(() => {
//     console.log("selectedProduct", response, selectedProduct);
//     if (!selectedProduct) return [];
//     const arr = [];
//     if (selectedProduct.amazonAsin) {
//       arr.push({
//         name: "Amazon",
//         color: "#FF9500",
//         icon: <FaAmazon style={{ color: "white", fontSize: 20 }} />,
//         url: `https://www.amazon.in/review/create-review/?asin=${encodeURIComponent(
//           selectedProduct.amazonAsin
//         )}`,
//       });
//     }
//     if (selectedProduct.flipkartFsn) {
//       arr.push({
//         name: "Flipkart",
//         color: "#2874F0",
//         icon: <SiFlipkart style={{ color: "white", fontSize: 20 }} />,
//         url: "https://www.flipkart.com/",
//       });
//     }
//     return arr;
//   }, [selectedProduct]);

//   // The chosen marketplace configuration (if chosen or only one available)
//   const selectedMarketplaceConfig = useMemo(() => {
//     if (!selectedProduct) return null;
//     // If user has selected explicitly
//     const chosen = marketplaces.find((m) => m.name === form.marketplace);
//     if (chosen) return chosen;
//     // If only one available, auto-use it
//     if (marketplaces.length === 1) return marketplaces;
//     return null;
//   }, [selectedProduct, marketplaces, form.marketplace]);

//   // Effects
//   useEffect(() => {
//     if (id) fetchCampaign();
//   }, [id]);

//   // Auto-select single product; reset marketplace when product changes
//   useEffect(() => {
//     if (campaign?.products?.length === 1 && !form.selectedProduct) {
//       setForm((prev) => ({
//         ...prev,
//         selectedProduct: campaign.products._id,
//       }));
//     }
//   }, [campaign?.products, form.selectedProduct]);

//   // Keep marketplace in sync with available options of the selected product
//   useEffect(() => {
//     if (!selectedProduct) {
//       if (form.marketplace) {
//         setForm((prev) => ({ ...prev, marketplace: "" }));
//       }
//       return;
//     }
//     const hasAmazon = !!selectedProduct.amazonAsin;
//     const hasFlipkart = !!selectedProduct.flipkartFsn;

//     // If only one option, set it automatically
//     if (hasAmazon && !hasFlipkart && form.marketplace !== "Amazon") {
//       setForm((prev) => ({ ...prev, marketplace: "Amazon" }));
//     } else if (!hasAmazon && hasFlipkart && form.marketplace !== "Flipkart") {
//       setForm((prev) => ({ ...prev, marketplace: "Flipkart" }));
//     } else if (hasAmazon && hasFlipkart) {
//       // Both present; clear if previously set to an invalid one
//       if (
//         form.marketplace &&
//         !["Amazon", "Flipkart"].includes(form.marketplace)
//       ) {
//         setForm((prev) => ({ ...prev, marketplace: "" }));
//       }
//       // Otherwise, keep user's choice or leave empty for selection
//     } else if (!hasAmazon && !hasFlipkart && form.marketplace) {
//       setForm((prev) => ({ ...prev, marketplace: "" }));
//     }
//   }, [selectedProduct, form.marketplace]);

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
//       if (selectedMarketplaceConfig?.url) {
//         setForm((prev) => ({ ...prev, clickedMarketplaceButton: true }));
//         window.open(
//           selectedMarketplaceConfig.url,
//           "_blank",
//           "noopener,noreferrer"
//         );
//       }
//     }
//   }, [form.review, selectedMarketplaceConfig]);

//   const handleSubmit = useCallback(async () => {
//     try {
//       setSubmitting(true);
//       setError("");

//       // Map numeric to satisfaction string and include user-selected marketplace
//       const satisfactionText = mapRatingToSatisfaction(form.satisfaction);
//       const submission = {
//         ...form,
//         satisfaction: satisfactionText, // textual version
//         rating: form.satisfaction, // numeric version
//         marketplace: form.marketplace || selectedMarketplaceConfig?.name || "",
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
//   }, [id, form, selectedMarketplaceConfig]);

//   // Validation
//   const validateStep = useCallback(
//     (step) => {
//       const errors = {};
//       switch (step) {
//         case 0: {
//           if (!form.selectedProduct)
//             errors.selectedProduct = "Please select a product";
//           if (!form.orderNumber.trim())
//             errors.orderNumber = "Order number is required";
//           if (!form.satisfaction)
//             errors.satisfaction = "Please rate your satisfaction";
//           if (!form.usedMoreDays)
//             errors.usedMoreDays = "Please select an option";
//           // Require marketplace choice only if both are available
//           const bothAvailable =
//             !!selectedProduct?.amazonAsin && !!selectedProduct?.flipkartFsn;
//           if (bothAvailable && !form.marketplace) {
//             errors.marketplace = "Please select a marketplace";
//           }
//           break;
//         }
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
//           // Backend requires review always; min length only enforced for review category
//           const minLen = campaign?.reviewMinimumLength || 0;
//           if (!form.review.trim()) {
//             errors.review = "Review is required";
//           } else if (
//             campaign?.category === "review" &&
//             minLen > 0 &&
//             form.review.length < minLen
//           ) {
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
//     [form, campaign, selectedProduct]
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

//   const renderStep0 = () => {
//     const bothAvailable =
//       !!selectedProduct?.amazonAsin && !!selectedProduct?.flipkartFsn;

//     return (
//       <Stack spacing={3}>
//         <FormControl fullWidth error={!!formErrors.selectedProduct}>
//           <InputLabel>Select Product *</InputLabel>
//           <Select
//             name="selectedProduct"
//             value={form.selectedProduct}
//             onChange={handleChange}
//             label="Select Product *"
//           >
//             {campaign?.products?.map((product) => {
//               const badges = [];
//               if (product.amazonAsin) badges.push("Amazon");
//               if (product.flipkartFsn) badges.push("Flipkart");
//               return (
//                 // <MenuItem key={product._id} value={product._id}>
//                 //   <Stack direction="row" spacing={1} alignItems="center">
//                 //     {/* //logo if any in same row */}
//                 //     {product.imageurl ? (
//                 //       <Box
//                 //         component="img"
//                 //         src={product.imageurl}
//                 //         alt={product.name}
//                 //         sx={{
//                 //           width: 40,
//                 //           height: 40,
//                 //           objectFit: "contain",
//                 //           borderRadius: 1,
//                 //           mr: 1,
//                 //         }}
//                 //       />
//                 //     ) : (
//                 //       <Box
//                 //         sx={{
//                 //           width: 40,
//                 //           height: 40,
//                 //           bgcolor: "grey.200",
//                 //           borderRadius: 1,
//                 //           display: "flex",
//                 //           justifyContent: "center",
//                 //           alignItems: "center",
//                 //           mr: 1,
//                 //         }}
//                 //       />
//                 //     )}
//                 //     // <Typography>{product.name}</Typography>
//                 //   </Stack>
//                 // </MenuItem>
//                 <MenuItem key={product._id} value={product._id}>
//                   <Stack direction="row" spacing={2} alignItems="center">
//                     <Avatar
//                       src={product.imageurl}
//                       alt={product.name}
//                       variant="rounded"
//                       sx={{ width: 40, height: 40 }}
//                     />
//                     <Box>
//                       <Typography variant="body1">{product.name}</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {product.brand || ""}
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </MenuItem>
//               );
//             })}
//           </Select>
//           {formErrors.selectedProduct && (
//             <Typography variant="caption" color="error" sx={{ mt: 1 }}>
//               {formErrors.selectedProduct}
//             </Typography>
//           )}
//         </FormControl>

//         {/* --- Marketplace Selection Logic --- */}
//         {selectedProduct && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               border: "1px solid #ddd",
//               ":hover": { border: "1px solid #aaa" },
//             }}
//           >
//             <Stack spacing={2}>
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <Store color="action" />
//                 <Typography variant="body2" color="text.secondary">
//                   Available on:
//                 </Typography>
//                 {selectedProduct.amazonAsin && (
//                   <MarketplaceChip
//                     marketplace="Amazon"
//                     label="Amazon"
//                     size="small"
//                   />
//                 )}
//                 {selectedProduct.flipkartFsn && (
//                   <MarketplaceChip
//                     marketplace="Flipkart"
//                     label="Flipkart"
//                     size="small"
//                   />
//                 )}
//               </Stack>

//               {/* Only show radio buttons if BOTH are available */}
//               {bothAvailable && (
//                 <FormControl error={!!formErrors.marketplace}>
//                   <FormLabel>Choose where you purchased from *</FormLabel>
//                   <RadioGroup
//                     row
//                     name="marketplace"
//                     value={form.marketplace}
//                     onChange={handleChange}
//                   >
//                     <FormControlLabel
//                       value="Amazon"
//                       control={<Radio />}
//                       label="Amazon"
//                     />
//                     <FormControlLabel
//                       value="Flipkart"
//                       control={<Radio />}
//                       label="Flipkart"
//                     />
//                   </RadioGroup>
//                   {formErrors.marketplace && (
//                     <Typography variant="caption" color="error">
//                       {formErrors.marketplace}
//                     </Typography>
//                   )}
//                 </FormControl>
//               )}
//             </Stack>
//           </Paper>
//         )}
//         {/* --- End of Marketplace Logic --- */}

//         <TextField
//           fullWidth
//           name="orderNumber"
//           label="Enter your order id *"
//           value={form.orderNumber}
//           onChange={handleChange}
//           error={!!formErrors.orderNumber}
//           helperText={formErrors.orderNumber}
//           placeholder="Enter the order id from your purchase"
//         />

//         <Box>
//           <FormLabel component="legend" error={!!formErrors.satisfaction}>
//             How satisfied are you with the product? *
//           </FormLabel>
//           <Box sx={{ mt: 1 }}>
//             <Rating
//               name="satisfaction"
//               value={form.satisfaction}
//               onChange={handleRatingChange}
//               size="large"
//               icon={<Star fontSize="large" />}
//               emptyIcon={<StarBorder fontSize="large" />}
//             />
//           </Box>
//           {formErrors.satisfaction && (
//             <Typography variant="caption" color="error">
//               {formErrors.satisfaction}
//             </Typography>
//           )}
//         </Box>

//         <FormControl error={!!formErrors.usedMoreDays}>
//           <FormLabel>
//             Have you used this product for more than 7 days? *
//           </FormLabel>
//           <RadioGroup
//             name="usedMoreDays"
//             value={form.usedMoreDays}
//             onChange={handleChange}
//             row
//           >
//             <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
//             <FormControlLabel value="No" control={<Radio />} label="No" />
//           </RadioGroup>
//           {formErrors.usedMoreDays && (
//             <Typography variant="caption" color="error">
//               {formErrors.usedMoreDays}
//             </Typography>
//           )}
//         </FormControl>
//       </Stack>
//     );
//   };
//   const renderStep1 = () => (
//     <Stack spacing={3}>
//       <TextField
//         fullWidth
//         name="customerName"
//         label="Enter Full Name"
//         value={form.customerName}
//         onChange={handleChange}
//         error={!!formErrors.customerName}
//         helperText={formErrors.customerName}
//         placeholder="Enter your full name"
//       />

//       <TextField
//         fullWidth
//         name="email"
//         label="Enter Email ID"
//         type="email"
//         value={form.email}
//         onChange={handleChange}
//         error={!!formErrors.email}
//         helperText={
//           formErrors.email || "Your offer will be received on this email"
//         }
//         placeholder="Enter your email address"
//       />

//       <TextField
//         fullWidth
//         name="phoneNumber"
//         label="Enter Phone Number"
//         type="tel"
//         value={form.phoneNumber}
//         onChange={handleChange}
//         error={!!formErrors.phoneNumber}
//         helperText={formErrors.phoneNumber}
//         placeholder="+91 - XXXXXXXXXX"
//       />
//     </Stack>
//   );
//   const renderStep2 = () => (
//     <Stack spacing={2.5} alignItems="center">
//       {selectedProduct && (
//         <>
//           {/* <img src={selectedProduct.imageurl} alt={selectedProduct.name} /> */}
//           <Typography variant="h6" fontWeight="bold">
//             {selectedProduct.name}
//           </Typography>

//           {selectedProduct.imageurl && (
//             <Box
//               component="img"
//               src={selectedProduct.imageurl}
//               alt={selectedProduct.name}
//               sx={{
//                 width: 120,
//                 height: 120,
//                 objectFit: "contain",
//                 borderRadius: 2,
//                 mb: 1,
//               }}
//             />
//           )}
//         </>
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
//         placeholder="Enter Feedback"
//       />

//       {/* Logic to show button only for high ratings remains */}
//       {selectedMarketplaceConfig && form.satisfaction >= 4 && (
//         <Stack spacing={1} sx={{ width: "100%", pt: 1 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={handleShareReview}
//             sx={{
//               bgcolor: selectedMarketplaceConfig.color,
//               color: "white",
//               fontWeight: "bold",
//               py: 1.5,
//               "&:hover": {
//                 bgcolor: selectedMarketplaceConfig.color,
//                 opacity: 0.9,
//               },
//             }}
//             startIcon={selectedMarketplaceConfig.icon}
//           >
//             Copy and share on {selectedMarketplaceConfig.name}
//           </Button>

//           <Typography
//             variant="caption"
//             color="text.secondary"
//             textAlign="center"
//           >
//             Click button to copy your written feedback and share it on{" "}
//             {selectedMarketplaceConfig.name}
//           </Typography>
//         </Stack>
//       )}
//     </Stack>
//   );

//   const renderStep3 = () => (
//     <Stack
//       spacing={3}
//       alignItems="center"
//       textAlign="center"
//       sx={{ pt: 4, pb: 4 }}
//     >
//       <Typography variant="h4" component="h1" fontWeight="bold">
//         Congratulations! 🎉
//       </Typography>

//       {/* Dynamic message based on promotion type */}
//       {campaign?.promotion?.type === "extended warranty" ? (
//         <Typography variant="body1" color="text.secondary">
//           You’ve successfully registered for the <strong></strong> Month
//           Extended Warranty for
//           <strong> {selectedProduct?.name || "<Product Name>"} </strong>
//           {/* on {new Date().toLocaleDateString()}. */}
//         </Typography>
//       ) : (
//         <Typography variant="body1" color="text.secondary">
//           You've successfully unlocked a coupon code for your next purchase of
//           <strong> {selectedProduct?.name || "<Product Name>"} </strong>.
//           Details have been sent to your email.
//         </Typography>
//       )}

//       {/* <Typography
//         variant="body2"
//         color="text.secondary"
//         sx={{ fontStyle: "italic" }}
//       >
//         {campaign?.promotion?.termsAndConditions
//           ? campaign.promotion.termsAndConditions
//           : "<Extended Warranty Terms & Conditions>"}
//       </Typography> */}

//       <div className="prose prose-indigo max-w-none">
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           rehypePlugins={[rehypeHighlight]}
//         >
//           {campaign?.promotion?.termsAndConditions
//             ? campaign.promotion.termsAndConditions
//             : "warrenty is extended"}
//         </ReactMarkdown>
//       </div>

//       <Box sx={{ pt: 2 }}>
//         <Typography variant="h6" component="p" color="text.primary">
//           We value your feedback.
//         </Typography>
//         <Typography variant="h6" component="p" color="text.primary">
//           Thanks for sharing.
//         </Typography>
//       </Box>
//       {loading && (
//         <Container maxWidth="sm" sx={{ py: 4 }}>
//           <StyledCard>
//             <Skeleton variant="rectangular" height={120} />
//             <CardContent>
//               <Stack spacing={2}>
//                 <Skeleton variant="text" height={40} />
//                 <Skeleton variant="rectangular" height={56} />
//                 <Skeleton variant="rectangular" height={56} />
//                 <Skeleton variant="rectangular" height={100} />
//               </Stack>
//             </CardContent>
//           </StyledCard>
//         </Container>
//       )}
//     </Stack>

//     // Loading state
//   );
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

//   //   return (
//   //     <Container maxWidth="sm" sx={{ py: 2 }}>
//   //       <StyledCard>
//   //         {/* Header */}
//   //         <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
//   //           {campaign?.seller?.logoUrl && (
//   //             <img
//   //               src={campaign.seller.logoUrl}
//   //               alt="Seller Logo"
//   //               style={{ maxHeight: 30, marginBottom: 8 }}
//   //             />
//   //           )}
//   //           <Typography variant="h5" fontWeight="bold" gutterBottom>
//   //             {campaign?.promotion?.name || "<Offer Title>"}
//   //           </Typography>
//   //         </GradientHeader>

//   //         {/* Content */}
//   //         <CardContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
//   //           <Fade in timeout={300}>
//   //             <Box>
//   //               {/* This Box will render the correct step based on the currentStep state */}
//   //               {currentStep === 0 && renderStep0()}
//   //               {currentStep === 1 && renderStep1()}
//   //               {currentStep === 2 && renderStep2()}
//   //               {currentStep === 3 && renderStep3()}
//   //             </Box>
//   //           </Fade>
//   //           {/* Error Alert */}
//   //           {error && currentStep < 3 && (
//   //             <Alert severity="error" sx={{ mt: 2 }}>
//   //               {error}
//   //             </Alert>
//   //           )}
//   //         </CardContent>

//   //         {/* Footer Navigation */}
//   //         {currentStep < 4 && (
//   //           <>
//   //             <Divider />
//   //             <Box sx={{ p: 2, position: "relative", textAlign: "center" }}>
//   //               <Box
//   //                 sx={{
//   //                   display: "flex",
//   //                   justifyContent: "space-between",
//   //                   alignItems: "center",
//   //                 }}
//   //               >
//   //                 <Button
//   //                   onClick={handleBack}
//   //                   disabled={currentStep === 0 || submitting}
//   //                   startIcon={<ArrowBack />}
//   //                 >
//   //                   Back
//   //                 </Button>

//   //                 <Typography variant="body2" color="text.secondary">
//   //                   Step {currentStep + 1} of {steps.length - 1}
//   //                 </Typography>

//   //                 <Button
//   //                   onClick={handleNext}
//   //                   disabled={submitting}
//   //                   endIcon={
//   //                     submitting ? (
//   //                       <CircularProgress size={20} />
//   //                     ) : (
//   //                       <ArrowForward />
//   //                     )
//   //                   }
//   //                   variant="contained"
//   //                 >
//   //                   {currentStep === 2 ? "Submit" : "Next"}
//   //                 </Button>
//   //               </Box>
//   //               <Typography
//   //                 variant="caption"
//   //                 color="text.secondary"
//   //                 sx={{ mt: 2, display: "block" }}
//   //               >
//   //                 Powered by Reviu
//   //               </Typography>
//   //             </Box>
//   //           </>
//   //         )}
//   //       </StyledCard>

//   //       {/* Snackbars for user feedback */}
//   //       <Snackbar
//   //         open={!!success}
//   //         autoHideDuration={6000}
//   //         onClose={() => setSuccess("")}
//   //         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//   //       >
//   //         <Alert onClose={() => setSuccess("")} severity="success">
//   //           {success}
//   //         </Alert>
//   //       </Snackbar>
//   //       <Snackbar
//   //         open={copied}
//   //         autoHideDuration={2500}
//   //         onClose={() => setCopied(false)}
//   //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//   //       >
//   //         <Alert onClose={() => setCopied(false)} severity="info">
//   //           Review copied to clipboard!
//   //         </Alert>
//   //       </Snackbar>
//   //     </Container>
//   //   );
//   // }
//   return (
//     <Container maxWidth="sm" sx={{ py: 2 }}>
//       <StyledCard>
//         {/* Header */}
//         {/* Shift to center */}
//         <GradientHeader primaryColor={campaign?.customization?.primaryColor}>
//           <Box sx={{ textAlign: "center", mb: 2 }}>
//             {campaign?.seller?.logoUrl && (
//               <img
//                 src={campaign.seller.logoUrl}
//                 alt="Seller Logo"
//                 style={{
//                   maxHeight: 30,
//                   marginBottom: 8,
//                   display: "block",
//                   marginLeft: "auto",
//                   marginRight: "auto",
//                 }}
//               />
//             )}
//           </Box>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             {campaign?.promotion?.offerTitle || "<Offer Title>"}
//           </Typography>
//         </GradientHeader>

//         {/* Content */}
//         <CardContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
//           <Fade in timeout={300}>
//             {/* MODIFICATION:
//               - Added a min-height to prevent the card from resizing between steps.
//               - Used flexbox to align content consistently within the fixed space.
//             */}
//             <Box
//               sx={{
//                 minHeight: { xs: 420, sm: 450 },
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//               }}
//             >
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

//         {/* Footer Navigation
//           MODIFICATION: Changed condition to currentStep < 3 to hide on the final step.
//         */}
//         {currentStep < 3 && (
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
//             </Box>
//           </>
//         )}
//         <Box sx={{ p: 2, position: "relative", textAlign: "center" }}>
//           <Typography
//             variant="caption"
//             color="text.secondary"
//             sx={{ mt: 2, display: "block" }}
//           >
//             Powered by Reviu
//           </Typography>
//         </Box>
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
  Button,
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
  borderRadius: theme.spacing(3),
  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  display: "flex", // Flex layout to push footer to bottom
  flexDirection: "column", // Stack children vertically
  // Fixed height strategy for mobile stability:
  [theme.breakpoints.down("sm")]: {
    minHeight: "85vh", // Take up most of the screen on mobile
  },
  [theme.breakpoints.up("sm")]: {
    minHeight: 650, // Fixed minimum height on desktop
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
  clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
  marginBottom: theme.spacing(-3),
  flexShrink: 0, // Prevent header from shrinking
}));

const ScrollableContent = styled(CardContent)(({ theme }) => ({
  flex: 1, // Takes up all available remaining space
  overflowY: "auto", // Scroll internally if content exceeds fixed height
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  // Hide scrollbar for cleaner UI
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

const MarketplaceButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "brandColor",
})(({ theme, selected, brandColor }) => ({
  border: `2px solid ${selected ? brandColor : theme.palette.grey[300]}`,
  backgroundColor: selected ? alpha(brandColor, 0.05) : "transparent",
  color: selected ? brandColor : theme.palette.text.secondary,
  justifyContent: "flex-start",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
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

export default function PublicCampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    satisfaction: 0,
    usedMoreDays: "",
    customerName: "",
    email: "",
    phoneNumber: "",
    review: "",
    clickedMarketplaceButton: false,
    marketplace: "",
  });

  // --- Hooks ---
  const selectedProduct = useMemo(
    () => campaign?.products?.find((p) => p._id === form.selectedProduct),
    [campaign?.products, form.selectedProduct]
  );

  const marketplaces = useMemo(() => {
    if (!selectedProduct) return [];
    const arr = [];
    if (selectedProduct.amazonAsin) {
      arr.push({
        name: "Amazon",
        color: "#FF9500",
        icon: <FaAmazon style={{ fontSize: 20 }} />,
        url: `https://www.amazon.in/review/create-review/?asin=${encodeURIComponent(
          selectedProduct.amazonAsin
        )}`,
      });
    }
    if (selectedProduct.flipkartFsn) {
      arr.push({
        name: "Flipkart",
        color: "#2874F0",
        icon: <SiFlipkart style={{ fontSize: 20 }} />,
        url: "https://www.flipkart.com/",
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
    if (id) fetchCampaign();
  }, [id]);

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
    const hasAmazon = !!selectedProduct.amazonAsin;
    const hasFlipkart = !!selectedProduct.flipkartFsn;

    if (hasAmazon && !hasFlipkart && form.marketplace !== "Amazon") {
      setForm((prev) => ({ ...prev, marketplace: "Amazon" }));
    } else if (!hasAmazon && hasFlipkart && form.marketplace !== "Flipkart") {
      setForm((prev) => ({ ...prev, marketplace: "Flipkart" }));
    } else if (hasAmazon && hasFlipkart) {
      if (
        form.marketplace &&
        !["Amazon", "Flipkart"].includes(form.marketplace)
      ) {
        setForm((prev) => ({ ...prev, marketplace: "" }));
      }
    } else if (!hasAmazon && !hasFlipkart && form.marketplace) {
      setForm((prev) => ({ ...prev, marketplace: "" }));
    }
  }, [selectedProduct, form.marketplace]);

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

  const handleSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      setError("");
      const satisfactionText = mapRatingToSatisfaction(form.satisfaction);
      const submission = {
        ...form,
        satisfaction: satisfactionText,
        rating: form.satisfaction,
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
      console.log("Submission response:", response);
      setSuccess("Form submitted successfully!");
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [id, form, selectedMarketplaceConfig]);

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
    const bothAvailable =
      !!selectedProduct?.amazonAsin && !!selectedProduct?.flipkartFsn;

    return (
      <Stack spacing={3}>
        {/* Product Selection */}
        <FormControl
          fullWidth
          error={!!formErrors.selectedProduct}
          variant="outlined"
        >
          <InputLabel>Select Product</InputLabel>
          <Select
            name="selectedProduct"
            value={form.selectedProduct}
            onChange={handleChange}
            label="Select Product"
            // FIX 1: Ensure displayed value when selected is truncated (1 line max)
            renderValue={(selected) => {
              const p = campaign?.products?.find(
                (prod) => prod._id === selected
              );
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Typography noWrap sx={{ maxWidth: "100%" }}>
                    {p?.name}
                  </Typography>
                </Box>
              );
            }}
          >
            {campaign?.products?.map((product) => (
              <MenuItem key={product._id} value={product._id}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: "100%", overflow: "hidden" }}
                >
                  <Avatar
                    src={product.imageurl}
                    alt={product.name}
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "grey.100",
                      flexShrink: 0,
                    }}
                  >
                    <ShoppingCart fontSize="small" />
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    {" "}
                    {/* minWidth 0 is crucial for flex truncation */}
                    {/* FIX 1: Truncate items in dropdown too */}
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      display="block"
                    >
                      {product.brand}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          {formErrors.selectedProduct && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, ml: 1.5 }}
            >
              {formErrors.selectedProduct}
            </Typography>
          )}
        </FormControl>

        {/* Marketplace Selection - Only if both available */}
        {selectedProduct && bothAvailable && (
          <Box>
            <FormLabel component="legend" sx={{ mb: 1.5, fontSize: "0.9rem" }}>
              Where did you purchase this item?
            </FormLabel>
            <Stack direction="row" spacing={2}>
              <MarketplaceButton
                fullWidth
                selected={form.marketplace === "Amazon"}
                brandColor="#FF9500"
                onClick={() => handleMarketplaceSelect("Amazon")}
                startIcon={<FaAmazon />}
              >
                Amazon
              </MarketplaceButton>
              <MarketplaceButton
                fullWidth
                selected={form.marketplace === "Flipkart"}
                brandColor="#2874F0"
                onClick={() => handleMarketplaceSelect("Flipkart")}
                startIcon={<SiFlipkart />}
              >
                Flipkart
              </MarketplaceButton>
            </Stack>
          </Box>
        )}

        <TextField
          fullWidth
          name="orderNumber"
          label="Order ID"
          value={form.orderNumber}
          onChange={handleChange}
          error={!!formErrors.orderNumber}
          helperText={formErrors.orderNumber || "Found in your order history"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlined color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ textAlign: "center", py: 1 }}>
          <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>
            How would you rate your experience?
          </Typography>
          <Rating
            name="satisfaction"
            value={Number(form.satisfaction)}
            onChange={handleRatingChange}
            size="large"
            icon={<Star fontSize="inherit" color="primary" />}
            emptyIcon={<StarBorder fontSize="inherit" />}
            sx={{ fontSize: "3rem" }}
          />
          {formErrors.satisfaction && (
            <Typography variant="caption" color="error" display="block">
              {formErrors.satisfaction}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography
            component="legend"
            gutterBottom
            sx={{ fontSize: "0.9rem", color: "text.secondary" }}
          >
            Have you used this product for more than 7 days?
          </Typography>
          <ToggleButtonGroup
            value={form.usedMoreDays}
            exclusive
            onChange={handleToggleChange}
            fullWidth
            color="primary"
            size="small"
          >
            <ToggleButton value="Yes">Yes</ToggleButton>
            <ToggleButton value="No">No</ToggleButton>
          </ToggleButtonGroup>
          {formErrors.usedMoreDays && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, ml: 1.5 }}
            >
              {formErrors.usedMoreDays}
            </Typography>
          )}
        </Box>
      </Stack>
    );
  };

  const renderStep1 = () => (
    <Stack spacing={3} sx={{ py: 1 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        We need these details to send you the warranty/coupon information.
      </Typography>

      <TextField
        fullWidth
        name="customerName"
        label="Full Name"
        value={form.customerName}
        onChange={handleChange}
        error={!!formErrors.customerName}
        helperText={formErrors.customerName}
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
        label="Email Address"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlined color="action" />
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
        placeholder="+91"
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

  const renderStep2 = () => (
    <Stack spacing={3} alignItems="center" sx={{ py: 1 }}>
      {selectedProduct && (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Avatar
            src={selectedProduct.imageurl}
            variant="rounded"
            sx={{ width: 60, height: 60, flexShrink: 0 }}
          >
            <ShoppingCart />
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {/* FIX 1: Truncate Long Product names in review step to 1 line */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              noWrap
              title={selectedProduct.name}
            >
              {selectedProduct.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tell us what you think
            </Typography>
          </Box>
        </Stack>
      )}

      <TextField
        fullWidth
        name="review"
        label="Write your review"
        multiline
        minRows={4}
        value={form.review}
        onChange={handleChange}
        error={!!formErrors.review}
        helperText={formErrors.review || `${form.review.length} characters`}
        placeholder="What did you like? What could be improved?"
      />

      {selectedMarketplaceConfig && form.satisfaction >= 4 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            width: "100%",
            bgcolor: alpha(selectedMarketplaceConfig.color, 0.05),
            borderColor: alpha(selectedMarketplaceConfig.color, 0.2),
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Store sx={{ color: selectedMarketplaceConfig.color }} />
              <Typography
                variant="subtitle2"
                sx={{
                  color: selectedMarketplaceConfig.color,
                  fontWeight: "bold",
                }}
              >
                Share on {selectedMarketplaceConfig.name}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Copy your review and paste it on {selectedMarketplaceConfig.name}{" "}
              to help others.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleShareReview}
              startIcon={<ContentCopy />}
              sx={{
                bgcolor: selectedMarketplaceConfig.color,
                "&:hover": {
                  bgcolor: alpha(selectedMarketplaceConfig.color, 0.9),
                },
              }}
            >
              Copy Text & Open {selectedMarketplaceConfig.name}
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );

  const renderStep3 = () => (
    <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: 4 }}>
      <Avatar sx={{ width: 80, height: 80, bgcolor: "success.light", mb: 2 }}>
        <CheckCircleOutline sx={{ fontSize: 50, color: "white" }} />
      </Avatar>

      <Typography variant="h4" fontWeight="800" color="success.main">
        Success!
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        {campaign?.promotion?.type === "extended warranty"
          ? `You have successfully registered for the Extended Warranty for ${
              selectedProduct?.name || "your product"
            }.`
          : `You have unlocked your coupon code! Details have been sent to ${form.email}.`}
      </Typography>

      {campaign?.promotion?.termsAndConditions && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "grey.50",
            borderRadius: 2,
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
              {campaign.promotion.termsAndConditions}
            </ReactMarkdown>
          </div>
        </Paper>
      )}
    </Stack>
  );

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
            <Button variant="outlined" onClick={() => navigate("/")}>
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
              sx={{ height: 40, mb: 2, filter: "brightness(0) invert(1)" }}
            />
          )}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ letterSpacing: 0.5 }}
          >
            {campaign?.promotion?.offerTitle || "Claim Your Offer"}
          </Typography>
        </GradientHeader>

        {/* Stepper */}
        {currentStep < 3 && (
          <Box sx={{ px: 3, mt: 4, flexShrink: 0 }}>
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
                sx={{ mt: 2, borderRadius: 2 }}
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
                startIcon={<ArrowBack />}
                sx={{ color: "text.secondary" }}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={submitting}
                endIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ArrowForward />
                  )
                }
                sx={{
                  px: 4,
                  borderRadius: 5,
                  bgcolor: campaign?.customization?.primaryColor,
                  "&:hover": {
                    bgcolor: campaign?.customization?.primaryColor
                      ? alpha(campaign?.customization?.primaryColor, 0.9)
                      : "primary.dark",
                  },
                }}
              >
                {currentStep === 2 ? "Submit Claim" : "Next"}
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
