// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL } from "../config/api";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (success) {
//       const t = setTimeout(() => setSuccess(""), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [success]);

//   async function fetchProducts() {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const url = `${API_URL}/products`;
//       const res = await fetch(url, { headers: { Authorization: token } });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch products");
//       setProducts(data.products || []);
//       setError("");
//     } catch (err) {
//       setError(err.message);
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
//         headers: { Authorization: token },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to delete product");
//       setProducts((prev) => prev.filter((p) => p._id !== productId));
//       setSuccess("Product deleted successfully.");
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Top bar */}
//       <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">
//               P
//             </div>
//             <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
//               Products
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={fetchProducts}
//               className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//             >
//               <span className="i-refresh h-4 w-4" aria-hidden="true" />
//               Refresh
//             </button>
//             <Link
//               to="/products/create"
//               className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
//             >
//               <span className="-ml-0.5">+</span>
//               New Product
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
//         <p className="text-slate-600 mb-4">
//           Manage the catalog and keep product details up to date. Ensure
//           accurate identifiers and assets for downstream channels.
//         </p>

//         {/* Alerts */}
//         {error && (
//           <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
//             {success}
//           </div>
//         )}

//         {/* Card */}
//         <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
//           {/* Table toolbar */}
//           <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-slate-600">
//                 {loading
//                   ? "Loading products..."
//                   : `Showing ${products.length} item${
//                       products.length !== 1 ? "s" : ""
//                     }`}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 placeholder="Search name or ASIN"
//                 className="w-56 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 onChange={(e) => {
//                   const q = e.target.value.toLowerCase();
//                   if (!q) {
//                     fetchProducts();
//                     return;
//                   }
//                   // Optional client-side quick filter (non-destructive)
//                   // Could be replaced by server-side query param
//                   fetchProducts(); // keep as-is or implement local filter
//                 }}
//               />
//             </div>
//           </div>

//           {/* States */}
//           {loading ? (
//             <div className="p-8">
//               <div className="h-2 w-full animate-pulse rounded bg-slate-200" />
//               <div className="mt-2 h-2 w-5/6 animate-pulse rounded bg-slate-200" />
//               <div className="mt-2 h-2 w-2/3 animate-pulse rounded bg-slate-200" />
//             </div>
//           ) : products.length === 0 ? (
//             <div className="px-8 py-16 text-center">
//               <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
//                 📦
//               </div>
//               <h3 className="text-base font-semibold text-slate-900">
//                 No products found
//               </h3>
//               <p className="mt-1 text-sm text-slate-600">
//                 Add a new product to get started.
//               </p>
//               <div className="mt-6">
//                 <Link
//                   to="/products/create"
//                   className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
//                 >
//                   Create Product
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
//                     >
//                       Image
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
//                     >
//                       Product Name
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
//                     >
//                       ASIN
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
//                     >
//                       Added On
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600"
//                     >
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {products.map((product) => (
//                     <tr key={product._id} className="hover:bg-slate-50">
//                       <td className="px-4 py-3">
//                         {product.imageurl ? (
//                           <img
//                             src={product.imageurl}
//                             alt={product.name}
//                             className="h-12 w-12 rounded object-cover ring-1 ring-slate-200"
//                           />
//                         ) : (
//                           <div className="h-12 w-12 rounded bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-slate-600 font-semibold">
//                             {product.name
//                               ? product.name.charAt(0).toUpperCase()
//                               : "P"}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="max-w-xs truncate font-medium text-slate-900">
//                           {product.name || "-"}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           ID: {product._id.slice(-8)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
//                           {product.marketplaceProductId || "--"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-slate-700">
//                         {product.createdAt
//                           ? new Date(product.createdAt).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             onClick={() =>
//                               navigate(`/products/${product._id}/edit`)
//                             }
//                             className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(product._id)}
//                             className="inline-flex items-center rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Footer */}
//               <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
//                 <p className="text-xs text-slate-600">
//                   {products.length} total • Use filters or search to refine
//                   results
//                 </p>
//                 <div className="flex items-center gap-2 text-xs">
//                   <button className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-50">
//                     Prev
//                   </button>
//                   <button className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-50">
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
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
                <TableCell>ASIN</TableCell>
                <TableCell>Added On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && rowsSkeleton}

              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>{emptyState}</TableCell>
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
                  const asin = product?.marketplaceProductId || "--";
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
                          {/* Example badge for optional situations (e.g., new) */}
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
                            asin === "--" ? "text.disabled" : "text.primary"
                          }
                        >
                          {asin}
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
