// import React, { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Stack,
//   Snackbar,
//   Alert,
//   Skeleton,
//   Tooltip,
// } from "@mui/material";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github.css"; // You can use 'atom-one-dark.css' for dark mode

// import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
// import { API_URL } from "../config/api";
// import TermsAndConditions from "./T&C";

// export default function Promotions() {
//   const [promotions, setPromotions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [filter, setFilter] = useState({ status: "all", type: "all" });

//   useEffect(() => {
//     fetchPromotions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filter]);

//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 3000);
//     return () => clearTimeout(t);
//   }, [success]);

//   async function fetchPromotions() {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       let url = `${API_URL}/promotions`;
//       const params = new URLSearchParams();
//       if (filter.status !== "all") params.append("status", filter.status);
//       if (filter.type !== "all") params.append("type", filter.type);
//       if (params.toString()) url += `?${params.toString()}`;
//       const res = await fetch(url, { headers: { Authorization: token } });
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.message || "Failed to fetch promotions");
//       setPromotions(data.promotions || []);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function deletePromotion(promotionId) {
//     if (!window.confirm("Are you sure you want to delete this promotion?"))
//       return;
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/promotions/${promotionId}`, {
//         method: "DELETE",
//         headers: { Authorization: token },
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to delete promotion");
//       }
//       setPromotions((prev) => prev.filter((p) => p._id !== promotionId));
//       setSuccess("Promotion deleted successfully.");
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   const statusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "success";
//       case "inactive":
//         return "default";
//       default:
//         return "warning";
//     }
//   };

//   const renderCodeValue = (promotion) => {
//     if (promotion.type === "discount code") {
//       return promotion.couponCode || "-";
//     }
//     if (promotion.type === "extended warranty") {
//       return promotion.warrantyPeriod
//         ? `${promotion.warrantyPeriod} months`
//         : "-";
//     }
//     return "-";
//   };

//   const rowsSkeleton = useMemo(
//     () =>
//       Array.from({ length: 6 }).map((_, i) => (
//         <TableRow key={`sk-${i}`}>
//           <TableCell>
//             <Skeleton variant="text" width={120} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={200} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={80} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="rectangular" width={60} height={24} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell align="right">
//             <Skeleton variant="text" width={120} />
//           </TableCell>
//         </TableRow>
//       )),
//     []
//   );

//   const emptyState = (
//     <Box textAlign="center" py={6}>
//       <Typography variant="h6" gutterBottom>
//         No promotions found
//       </Typography>
//       <Typography color="text.secondary">
//         Add a new promotion to start engaging customers.
//       </Typography>
//       <Button
//         sx={{ mt: 2 }}
//         variant="contained"
//         startIcon={<Add />}
//         component={Link}
//         to="/promotions/create"
//       >
//         Create Promotion
//       </Button>
//     </Box>
//   );

//   return (
//     <Box p={3}>
//       {/* Header */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center">
//         <div>
//           <Typography variant="h4" gutterBottom>
//             Promotions
//           </Typography>
//           <Typography color="text.secondary">
//             Create and manage promotional rewards & offers
//           </Typography>
//         </div>
//         <Button
//           component={Link}
//           to="/promotions/create"
//           variant="contained"
//           startIcon={<Add />}
//         >
//           New Promotion
//         </Button>
//       </Stack>

//       {/* Filters */}
//       <Stack direction="row" spacing={2} my={3}>
//         <FormControl size="small" sx={{ minWidth: 120 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             label="Status"
//             value={filter.status}
//             onChange={(e) =>
//               setFilter((f) => ({ ...f, status: e.target.value }))
//             }
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="active">Active</MenuItem>
//             <MenuItem value="inactive">Inactive</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl size="small" sx={{ minWidth: 180 }}>
//           <InputLabel>Type</InputLabel>
//           <Select
//             label="Type"
//             value={filter.type}
//             onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="discount code">Discount Code</MenuItem>
//             <MenuItem value="extended warranty">Extended Warranty</MenuItem>
//           </Select>
//         </FormControl>
//       </Stack>

//       {/* Alerts */}
//       <Snackbar
//         open={!!error}
//         autoHideDuration={4000}
//         onClose={() => setError("")}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={() => setError("")} severity="error" variant="filled">
//           {error}
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={!!success}
//         autoHideDuration={3000}
//         onClose={() => setSuccess("")}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSuccess("")}
//           severity="success"
//           variant="filled"
//         >
//           {success}
//         </Alert>
//       </Snackbar>

//       {/* Table */}
//       <Paper variant="outlined">
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell sx={{ minWidth: "100px" }}>
//                   Terms & Conditions
//                 </TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Value</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Created</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading && rowsSkeleton}

//               {!loading && promotions.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7}>{emptyState}</TableCell>
//                 </TableRow>
//               )}

//               {!loading &&
//                 promotions.length > 0 &&
//                 promotions.map((promotion) => (
//                   <TableRow hover key={promotion._id}>
//                     <TableCell>{promotion.name}</TableCell>
//                     {/* <TableCell>{promotion.termsAndConditions || "-"}</TableCell> */}
//                     <div
//                       className="prose prose-indigo max-w- p-2"
//                       style={{ maxWidth: "350px" }}
//                     >
//                       <ReactMarkdown
//                         remarkPlugins={[remarkGfm]}
//                         rehypePlugins={[rehypeHighlight]}
//                       >
//                         {promotion.termsAndConditions || "-"}
//                       </ReactMarkdown>
//                     </div>
//                     <TableCell sx={{ textTransform: "capitalize" }}>
//                       {promotion.type || "-"}
//                     </TableCell>
//                     <TableCell>{renderCodeValue(promotion)}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={promotion.status || "pending"}
//                         color={statusColor(promotion.status)}
//                         size="small"
//                         sx={{ textTransform: "capitalize" }}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       {promotion.createdAt
//                         ? new Date(promotion.createdAt).toLocaleDateString()
//                         : "-"}
//                     </TableCell>
//                     <TableCell align="right">
//                       <Stack
//                         direction="row"
//                         spacing={0.5}
//                         justifyContent="flex-end"
//                       >
//                         <Tooltip title="Edit">
//                           <IconButton
//                             component={Link}
//                             to={`/promotions/${promotion._id}/edit`}
//                             size="small"
//                             color="primary"
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <IconButton
//                             color="error"
//                             size="small"
//                             onClick={() => deletePromotion(promotion._id)}
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {!loading && promotions.length > 0 && (
//           <Box px={2} py={1}>
//             <Typography variant="body2" color="text.secondary">
//               Showing {promotions.length} promotion
//               {promotions.length > 1 ? "s" : ""}
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  Skeleton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Avatar,
  useTheme,
  alpha,
  TablePagination,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import {
  Add,
  Edit,
  DeleteOutline,
  VisibilityOutlined,
  Search as SearchIcon,
  LocalOfferOutlined,
  SecurityOutlined,
  DescriptionOutlined,
  WarningAmberRounded,
} from "@mui/icons-material";
import { API_URL } from "../config/api";

export default function Promotions() {
  const theme = useTheme();

  // Data States
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter/Search States
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [promoToView, setPromoToView] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function fetchPromotions() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Fetch all and filter client side for smoother UX on small datasets
      // Or keep server side filtering if dataset is huge.
      // Here I'm fetching all to allow client-side search/sort.
      const res = await fetch(`${API_URL}/promotions`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch promotions");
      setPromotions(data.promotions || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Delete Logic ---
  const confirmDelete = async () => {
    if (!promoToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/promotions/${promoToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      setPromotions((prev) => prev.filter((p) => p._id !== promoToDelete._id));
      setSuccess("Promotion deleted successfully.");
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setPromoToDelete(null);
    }
  };

  // --- Filtering Logic ---
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      const matchesType = filterType === "all" || p.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promotions, search, filterStatus, filterType]);

  const paginatedPromotions = useMemo(() => {
    return filteredPromotions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredPromotions, page, rowsPerPage]);

  // --- Render Helpers ---
  const statusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      default:
        return "warning";
    }
  };

  const renderCodeValue = (promotion) => {
    if (promotion.type === "discount code") {
      return (
        <Box
          sx={{
            fontFamily: "monospace",
            bgcolor: "grey.100",
            px: 1,
            borderRadius: 1,
            display: "inline-block",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {promotion.couponCode}
        </Box>
      );
    }
    if (promotion.type === "extended warranty") {
      return promotion.warrantyPeriod
        ? `${promotion.warrantyPeriod} Months`
        : "-";
    }
    return "-";
  };

  const getIconForType = (type) => {
    if (type === "discount code")
      return <LocalOfferOutlined fontSize="small" />;
    if (type === "extended warranty")
      return <SecurityOutlined fontSize="small" />;
    return <DescriptionOutlined fontSize="small" />;
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Promotions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage coupons, warranty offers, and terms.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/promotions/create"
          variant="contained"
          startIcon={<Add />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: theme.shadows[4],
          }}
        >
          Create Promotion
        </Button>
      </Stack>

      {/* Filters Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search promotions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="discount code">Discount Code</MenuItem>
            <MenuItem value="extended warranty">Extended Warranty</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Table Card */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Name & Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Reward Value
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Created Date
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton variant="text" width={150} />
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={50} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredPromotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <LocalOfferOutlined
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      No promotions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPromotions.map((promo) => (
                  <TableRow hover key={promo._id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor:
                              promo.type === "discount code"
                                ? "secondary.light"
                                : "primary.light",
                            color:
                              promo.type === "discount code"
                                ? "secondary.main"
                                : "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getIconForType(promo.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {promo.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {promo.type}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{renderCodeValue(promo)}</TableCell>

                    <TableCell>
                      <Chip
                        label={promo.status || "pending"}
                        color={statusColor(promo.status)}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {promo.createdAt
                          ? new Date(promo.createdAt).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View Terms">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setPromoToView(promo);
                              setViewDialogOpen(true);
                            }}
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "info.main",
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                              },
                            }}
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            to={`/promotions/${promo._id}/edit`}
                            size="small"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "primary.main",
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setPromoToDelete(promo);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "error.main",
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPromotions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>

      {/* --- Dialogs --- */}

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberRounded color="error" /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{promoToDelete?.name}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Terms Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          {promoToView?.name}
          <Typography variant="caption" display="block" color="text.secondary">
            Terms & Conditions Preview
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {promoToView?.termsAndConditions ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {promoToView.termsAndConditions}
              </ReactMarkdown>
            </div>
          ) : (
            <Typography color="text.disabled" fontStyle="italic">
              No Terms & Conditions provided.
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{ borderTop: "1px solid", borderColor: "divider", p: 2 }}
        >
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Toasts */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setError("")} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          variant="filled"
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
