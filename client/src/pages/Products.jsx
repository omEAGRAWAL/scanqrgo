// import React, { useEffect, useMemo, useState } from "react";
// import { Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Snackbar,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableContainer,
//   Avatar,
//   Stack,
//   IconButton,
//   Chip,
//   CircularProgress,
//   Skeleton,
//   Tooltip,
// } from "@mui/material";
// import { Add, Edit, Delete, ShoppingBag } from "@mui/icons-material";
// import { API_URL } from "../config/api";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 3000);
//     return () => clearTimeout(t);
//   }, [success]);

//   async function fetchProducts() {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const url = `${API_URL}/products`;
//       const res = await fetch(url, {
//         headers: {
//           Authorization: `${token}` || "",
//         },
//       });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to fetch products");

//       // Go backend returns { count, products }
//       setProducts(data.products || []);
//       setError("");
//     } catch (err) {
//       setError(err.message || "Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDelete(productId) {
//     if (!window.confirm("Are you sure you want to delete this product?"))
//       return;

//     setError("");
//     setSuccess("");
//     setDeletingId(productId);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/products/${productId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `${token}` || "",
//         },
//       });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to delete product");

//       // Remove from state
//       setProducts((prev) => prev.filter((p) => p.id !== productId));
//       setSuccess(data.message || "Product deleted successfully.");
//     } catch (err) {
//       setError(err.message || "Failed to delete product");
//     } finally {
//       setDeletingId(null);
//     }
//   }

//   // Helper to render marketplace badges
//   const renderMarketplaces = (product) => {
//     const marketplaces = product?.availableMarketplaces || [];

//     if (marketplaces.length === 0) {
//       return (
//         <Typography variant="body2" color="text.disabled">
//           No marketplaces
//         </Typography>
//       );
//     }

//     return (
//       <Stack direction="row" spacing={0.5}>
//         {marketplaces.map((marketplace) => (
//           <Chip
//             key={marketplace}
//             label={marketplace}
//             size="small"
//             variant="outlined"
//             color={marketplace === "Amazon" ? "primary" : "secondary"}
//           />
//         ))}
//       </Stack>
//     );
//   };

//   const rowsSkeleton = useMemo(
//     () =>
//       Array.from({ length: 6 }).map((_, i) => (
//         <TableRow key={`sk-${i}`}>
//           <TableCell>
//             <Skeleton variant="circular" width={40} height={40} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={160} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={120} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={120} />
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
//       <ShoppingBag sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
//       <Typography variant="h6" gutterBottom>
//         No products found
//       </Typography>
//       <Typography color="text.secondary" mb={2}>
//         Add a new product to get started managing your catalog.
//       </Typography>
//       <Button
//         variant="contained"
//         startIcon={<Add />}
//         component={RouterLink}
//         to="/products/create"
//       >
//         Create Product
//       </Button>
//     </Box>
//   );

//   return (
//     <Box p={3}>
//       {/* Header + Primary Action */}
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         mb={3}
//       >
//         <Box>
//           <Typography variant="h4" fontWeight={600} gutterBottom>
//             Products
//           </Typography>
//           <Typography color="text.secondary">
//             Manage your product catalog and marketplace listings
//           </Typography>
//         </Box>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           component={RouterLink}
//           to="/products/create"
//           size="large"
//         >
//           New Product
//         </Button>
//       </Stack>

//       {/* Alerts via Snackbar */}
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
//                 <TableCell>Image</TableCell>
//                 <TableCell>Product Name</TableCell>
//                 <TableCell>Amazon ASIN</TableCell>
//                 <TableCell>Flipkart FSN</TableCell>
//                 <TableCell>Marketplaces</TableCell>
//                 <TableCell>Added On</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading && rowsSkeleton}

//               {!loading && products.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7}>{emptyState}</TableCell>
//                 </TableRow>
//               )}

//               {!loading &&
//                 products.length > 0 &&
//                 products.map((product) => {
//                   // Go backend uses 'id' not '_id'
//                   const productId = product.id || product._id;
//                   const initial =
//                     product?.name?.trim()?.charAt(0)?.toUpperCase() || "P";
//                   const created = product?.createdAt
//                     ? new Date(product.createdAt).toLocaleDateString()
//                     : "-";
//                   const asin = product?.amazonAsin || "–";
//                   const fsn = product?.flipkartFsn || "–";
//                   const name = product?.name || "-";
//                   const imageUrl = product?.imageurl || product?.imageUrl;

//                   return (
//                     <TableRow key={productId} hover>
//                       <TableCell>
//                         {imageUrl ? (
//                           <Avatar
//                             src={imageUrl}
//                             alt={name}
//                             variant="rounded"
//                             sx={{ width: 48, height: 48 }}
//                           />
//                         ) : (
//                           <Avatar
//                             variant="rounded"
//                             sx={{
//                               width: 48,
//                               height: 48,
//                               bgcolor: "primary.light",
//                               color: "primary.contrastText",
//                               fontWeight: 600,
//                             }}
//                           >
//                             {initial}
//                           </Avatar>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Typography fontWeight={500}>{name}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography
//                           variant="body2"
//                           fontFamily="monospace"
//                           color={
//                             asin === "–" ? "text.disabled" : "text.primary"
//                           }
//                         >
//                           {asin}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography
//                           variant="body2"
//                           fontFamily="monospace"
//                           color={fsn === "–" ? "text.disabled" : "text.primary"}
//                         >
//                           {fsn}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>{renderMarketplaces(product)}</TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary">
//                           {created}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="right">
//                         <Stack
//                           direction="row"
//                           spacing={1}
//                           justifyContent="flex-end"
//                         >
//                           <Tooltip title="Edit Product">
//                             <IconButton
//                               component={RouterLink}
//                               to={`/products/${productId}/edit`}
//                               size="small"
//                               color="primary"
//                             >
//                               <Edit fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete Product">
//                             <IconButton
//                               onClick={() => handleDelete(productId)}
//                               size="small"
//                               color="error"
//                               disabled={deletingId === productId}
//                             >
//                               {deletingId === productId ? (
//                                 <CircularProgress size={16} />
//                               ) : (
//                                 <Delete fontSize="small" />
//                               )}
//                             </IconButton>
//                           </Tooltip>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {!loading && products.length > 0 && (
//           <Box px={3} py={2} borderTop={1} borderColor="divider">
//             <Typography variant="body2" color="text.secondary">
//               Showing {products.length} product
//               {products.length !== 1 ? "s" : ""}
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  // Button, // Replaced by custom Button
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Avatar,
  Stack,
  IconButton,
  Chip,
  Skeleton,
  Tooltip,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add,
  Edit,
  DeleteOutline,
  Search as SearchIcon,
  Inventory2Outlined,
  WarningAmberRounded,
} from "@mui/icons-material";
import { API_URL } from "../config/api";
import Button from "../components/base/Button";

export default function Products() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete Modal State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-hide success toast
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `${token}` || "" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  // --- Delete Logic ---
  const promptDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const productId = productToDelete.id || productToDelete._id;
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `${token}` || "" },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete");

      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== productId));
      setSuccess("Product deleted successfully.");
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  };

  // --- Filtering & Pagination Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.amazonAsin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.flipkartFsn?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredProducts, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Rendering Helpers ---
  const renderMarketplaces = (product) => {
    const marketplaces = product?.availableMarketplaces || [];
    if (marketplaces.length === 0)
      return (
        <Typography variant="caption" color="text.disabled">
          None
        </Typography>
      );

    return (
      <Stack direction="row" spacing={1}>
        {marketplaces.map((mp) => {
          const isAmazon = mp.toLowerCase().includes("amazon");
          const isFlipkart = mp.toLowerCase().includes("flipkart");

          return (
            <Chip
              key={mp}
              label={mp}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
                bgcolor: isAmazon
                  ? "#fff7ed"
                  : isFlipkart
                    ? "#eff6ff"
                    : "default",
                color: isAmazon
                  ? "#c2410c"
                  : isFlipkart
                    ? "#1d4ed8"
                    : "text.primary",
                border: "1px solid",
                borderColor: isAmazon
                  ? "#fdba74"
                  : isFlipkart
                    ? "#93c5fd"
                    : "divider",
              }}
            />
          );
        })}
      </Stack>
    );
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your catalog, ASINs, and marketplace links.
          </Typography>
        </Box>
        <Button
          to="/products/create"
          icon={<Add />}
          variant="primary"
          className="shadow-lg px-6"
        >
          Add Product
        </Button>
      </Stack>

      {/* Toolbar: Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search by name, ASIN, or FSN..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ maxWidth: 500, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Main Table Card */}
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
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Product Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Identifiers (ASIN / FSN)
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Marketplaces
                </TableCell>
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
                      <Stack direction="row" spacing={2}>
                        <Skeleton variant="rounded" width={40} height={40} />
                        <Box>
                          <Skeleton width={120} />
                          <Skeleton width={80} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={50} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Inventory2Outlined
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      No products found
                    </Typography>
                    {searchTerm && (
                      <Typography variant="body2" color="text.disabled">
                        Try adjusting your search terms
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => {
                  const productId = product.id || product._id;
                  const created = product?.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "-";
                  const asin = product?.amazonAsin || "—";
                  const fsn = product?.flipkartFsn || "—";

                  return (
                    <TableRow
                      key={productId}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* Product Name & Image */}
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={product.imageurl}
                            variant="rounded"
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: "primary.light",
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            {product.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              color="text.primary"
                            >
                              {product.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.brand || "No Brand"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Identifiers */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography
                            variant="caption"
                            fontFamily="monospace"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{ color: "text.secondary", width: 40 }}
                            >
                              ASIN:
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 500,
                                bgcolor: "grey.100",
                                px: 0.5,
                                borderRadius: 0.5,
                              }}
                            >
                              {asin}
                            </Box>
                          </Typography>
                          <Typography
                            variant="caption"
                            fontFamily="monospace"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{ color: "text.secondary", width: 40 }}
                            >
                              FSN:
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 500,
                                bgcolor: "grey.100",
                                px: 0.5,
                                borderRadius: 0.5,
                              }}
                            >
                              {fsn}
                            </Box>
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Marketplaces */}
                      <TableCell>{renderMarketplaces(product)}</TableCell>

                      {/* Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {created}
                        </Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              component={RouterLink}
                              to={`/products/${productId}/edit`}
                              size="small"
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  color: "primary.main",
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => promptDelete(product)}
                              size="small"
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberRounded color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{productToDelete?.name}</strong>?
            <br />
            This action cannot be undone and will remove all associated
            campaigns.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteOutline />
              )
            }
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toasts */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
    </Box>
  );
}
