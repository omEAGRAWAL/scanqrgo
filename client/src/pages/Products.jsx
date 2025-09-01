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
// import { Add, Edit, Delete } from "@mui/icons-material";
// import { API_URL } from "../config/api";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

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
//       const res = await fetch(url, { headers: { Authorization: token || "" } });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch products");
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
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/products/${productId}`, {
//         method: "DELETE",
//         headers: { Authorization: token || "" },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to delete product");
//       setProducts((prev) => prev.filter((p) => p._id !== productId));
//       setSuccess("Product deleted successfully.");
//     } catch (err) {
//       setError(err.message || "Failed to delete product");
//     }
//   }

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
//         No products found
//       </Typography>
//       <Typography color="text.secondary">
//         Add a new product to get started managing the catalog.
//       </Typography>
//       <Button
//         sx={{ mt: 2 }}
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
//         mb={2}
//       >
//         <Box>
//           <Typography variant="h4">Products</Typography>
//           <Typography color="text.secondary">
//             Manage the product catalog and keep details up to date
//           </Typography>
//         </Box>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           component={RouterLink}
//           to="/products/create"
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
//                 <TableCell>ASIN</TableCell>
//                 <TableCell>Added On</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading && rowsSkeleton}

//               {!loading && products.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={5}>{emptyState}</TableCell>
//                 </TableRow>
//               )}

//               {!loading &&
//                 products.length > 0 &&
//                 products.map((product) => {
//                   const initial =
//                     product?.name?.trim()?.charAt(0)?.toUpperCase() || "P";
//                   const created = product?.createdAt
//                     ? new Date(product.createdAt).toLocaleDateString()
//                     : "-";
//                   const asin = product?.marketplaceProductId || "--";
//                   const name = product?.name || "-";

//                   return (
//                     <TableRow key={product._id} hover>
//                       <TableCell>
//                         {product?.imageurl ? (
//                           <Avatar
//                             src={product.imageurl}
//                             alt={name}
//                             variant="rounded"
//                             sx={{ width: 40, height: 40 }}
//                           />
//                         ) : (
//                           <Avatar
//                             variant="rounded"
//                             sx={{
//                               width: 40,
//                               height: 40,
//                               bgcolor: "grey.200",
//                               color: "text.primary",
//                               fontWeight: 600,
//                             }}
//                           >
//                             {initial}
//                           </Avatar>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <Typography fontWeight={400}>{name}</Typography>
//                           {/* Example badge for optional situations (e.g., new) */}
//                           {product?.isNew && (
//                             <Chip
//                               label="New"
//                               color="success"
//                               size="small"
//                               variant="outlined"
//                             />
//                           )}
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography
//                           variant="body2"
//                           color={
//                             asin === "--" ? "text.disabled" : "text.primary"
//                           }
//                         >
//                           {asin}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>{created}</TableCell>
//                       <TableCell align="right">
//                         <Stack
//                           direction="row"
//                           spacing={1}
//                           justifyContent="flex-end"
//                         >
//                           <Tooltip title="Edit">
//                             <IconButton
//                               component={RouterLink}
//                               to={`/products/${product._id}/edit`}
//                               size="small"
//                               color="primary"
//                             >
//                               <Edit fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete">
//                             <IconButton
//                               onClick={() => handleDelete(product._id)}
//                               size="small"
//                               color="error"
//                             >
//                               {loading ? (
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
//           <Box px={2} py={1}>
//             <Typography variant="body2" color="text.secondary">
//               Showing {products.length} product{products.length > 1 ? "s" : ""}
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
  Button,
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
  CircularProgress,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { API_URL } from "../config/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = `${API_URL}/products`;
      const res = await fetch(url, { headers: { Authorization: token || "" } });
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

  async function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  }

  const rowsSkeleton = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={`sk-${i}`}>
          <TableCell>
            <Skeleton variant="circular" width={40} height={40} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={160} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="text" width={120} />
          </TableCell>
        </TableRow>
      )),
    []
  );

  const emptyState = (
    <Box textAlign="center" py={6}>
      <Typography variant="h6" gutterBottom>
        No products found
      </Typography>
      <Typography color="text.secondary">
        Add a new product to get started managing the catalog.
      </Typography>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        startIcon={<Add />}
        component={RouterLink}
        to="/products/create"
      >
        Create Product
      </Button>
    </Box>
  );

  return (
    <Box p={3}>
      {/* Header + Primary Action */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <Typography variant="h4">Products</Typography>
          <Typography color="text.secondary">
            Manage the product catalog and keep details up to date
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={RouterLink}
          to="/products/create"
        >
          New Product
        </Button>
      </Stack>

      {/* Alerts via Snackbar */}
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

      {/* Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Amazon ASIN</TableCell>
                <TableCell>Flipkart FSN</TableCell>
                <TableCell>Added On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && rowsSkeleton}

              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>{emptyState}</TableCell>
                </TableRow>
              )}

              {!loading &&
                products.length > 0 &&
                products.map((product) => {
                  const initial =
                    product?.name?.trim()?.charAt(0)?.toUpperCase() || "P";
                  const created = product?.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "-";
                  const asin = product?.amazonAsin || "–";
                  const fsn = product?.flipkartFsn || "–";
                  const name = product?.name || "-";

                  return (
                    <TableRow key={product._id} hover>
                      <TableCell>
                        {product?.imageurl ? (
                          <Avatar
                            src={product.imageurl}
                            alt={name}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "grey.200",
                              color: "text.primary",
                              fontWeight: 600,
                            }}
                          >
                            {initial}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={400}>{name}</Typography>
                          {product?.isNew && (
                            <Chip
                              label="New"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={
                            asin === "–" ? "text.disabled" : "text.primary"
                          }
                        >
                          {asin}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={fsn === "–" ? "text.disabled" : "text.primary"}
                        >
                          {fsn}
                        </Typography>
                      </TableCell>
                      <TableCell>{created}</TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              component={RouterLink}
                              to={`/products/${product._id}/edit`}
                              size="small"
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(product._id)}
                              size="small"
                              color="error"
                            >
                              {loading ? (
                                <CircularProgress size={16} />
                              ) : (
                                <Delete fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && products.length > 0 && (
          <Box px={2} py={1}>
            <Typography variant="body2" color="text.secondary">
              Showing {products.length} product{products.length > 1 ? "s" : ""}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
