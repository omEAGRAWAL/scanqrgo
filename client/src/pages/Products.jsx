
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
    const sources = [];

    // Add legacy sources
    if (product?.amazonAsin) {
      sources.push({
        marketplace: "Amazon India",
        productId: product.amazonAsin,
        isPrimary: !product?.flipkartFsn // Primary if it's the only one
      });
    }
    if (product?.flipkartFsn) {
      sources.push({
        marketplace: "Flipkart",
        productId: product.flipkartFsn,
        isPrimary: !product?.amazonAsin // Primary if it's the only one
      });
    }

    // Add new marketplace sources (override legacy if present)
    if (product?.marketplaceSources && product.marketplaceSources.length > 0) {
      // Clear legacy sources if new format exists
      sources.length = 0;
      sources.push(...product.marketplaceSources);
    }

    if (sources.length === 0) {
      return (
        <Typography variant="caption" color="text.disabled">
          None
        </Typography>
      );
    }

    return (
      <Stack direction="column" spacing={0.5}>
        {sources.map((source, idx) => {
          const mp = source.marketplace || source;
          const isAmazon = mp.toLowerCase().includes("amazon");
          const isFlipkart = mp.toLowerCase().includes("flipkart");
          const isMeesho = mp.toLowerCase().includes("meesho");

          return (
            <Stack key={idx} direction="row" spacing={0.5} alignItems="center">
              <Chip
                label={mp}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: 22,
                  bgcolor: isAmazon
                    ? "#fff7ed"
                    : isFlipkart
                      ? "#eff6ff"
                      : isMeesho
                        ? "#fef3c7"
                        : "#f3f4f6",
                  color: isAmazon
                    ? "#c2410c"
                    : isFlipkart
                      ? "#1d4ed8"
                      : isMeesho
                        ? "#92400e"
                        : "#374151",
                  border: "1px solid",
                  borderColor: isAmazon
                    ? "#fdba74"
                    : isFlipkart
                      ? "#93c5fd"
                      : isMeesho
                        ? "#fde68a"
                        : "#e5e7eb",
                }}
              />
              {source.productId && (
                <Typography
                  variant="caption"
                  fontFamily="monospace"
                  sx={{
                    fontSize: "0.7rem",
                    color: "text.secondary",
                    bgcolor: "grey.100",
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 0.5,
                  }}
                >
                  {source.productId}
                </Typography>
              )}
              {source.isPrimary && (
                <Chip
                  label="Primary"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    bgcolor: "#dcfce7",
                    color: "#166534",
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 0.75 }
                  }}
                />
              )}
            </Stack>
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
          to="/products/new"
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
                              to={`/products/edit/${productId}`}
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
