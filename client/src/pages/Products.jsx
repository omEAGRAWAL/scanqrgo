// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { API_URL } from "../config/api";
// import { FiEdit, FiTrash2 } from "react-icons/fi";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (success) {
//       const timeout = setTimeout(() => setSuccess(""), 3000);
//       return () => clearTimeout(timeout);
//     }
//   }, [success]);

//   async function fetchProducts() {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/products`, {
//         headers: { Authorization: token },
//       });
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
//     <div className="min-h-screen bg-gray-50 p-6 lg:p-20">
//       <div className="max-w-5xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <Link
//             to="/products/create"
//             className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 shadow font-semibold flex items-center space-x-2"
//           >
//             <span>+ New Product</span>
//           </Link>
//           <select className="border rounded px-3 py-1 text-gray-600">
//             <option>Show All</option>
//           </select>
//         </div>

//         <div className="mb-4 text-sm text-gray-600">
//           Active Products:{" "}
//           <span className="font-bold text-gray-900">
//             {products.filter((p) => p.active).length} / {products.length}
//           </span>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//             {success}
//           </div>
//         )}

//         <div className="overflow-x-auto bg-white rounded shadow">
//           <table className="min-w-full">
//             <thead>
//               <tr className="text-left text-gray-500 border-b">
//                 <th className="py-3 px-4 font-medium"></th>
//                 <th className="py-3 px-2 font-medium">Product Name</th>
//                 <th className="py-3 px-4 font-medium">ASIN</th>
//                 <th className="py-3 px-4 font-medium">Added On</th>
//                 <th className="py-3 px-4 font-medium text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="py-6 text-center text-gray-500">
//                     Loading products...
//                   </td>
//                 </tr>
//               ) : products.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="py-8 text-center text-gray-500">
//                     No products found.
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((product, i) => (
//                   <tr
//                     key={product._id}
//                     className={
//                       i % 2 === 0
//                         ? "bg-gray-50 border-b hover:bg-blue-50"
//                         : "bg-white border-b hover:bg-blue-50"
//                     }
//                   >
//                     <td className="py-3 px-4">
//                       <img
//                         src={
//                           product.imageurl ||
//                           "https://via.placeholder.com/40?text=No+Image"
//                         }
//                         alt={product.name}
//                         className="w-12 h-12 object-cover rounded border border-gray-200 bg-gray-100"
//                       />
//                     </td>
//                     <td className="py-3 px-2">
//                       <div className="font-semibold text-gray-900">
//                         {product.name}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex items-center space-x-2">
//                         <span>
//                           {/* Amazon icon */}
//                           <svg width="18" height="18" viewBox="0 0 32 32">
//                             <circle cx="16" cy="16" r="14" fill="#ff9900" />
//                             <text
//                               x="8"
//                               y="22"
//                               fontSize="16"
//                               fontFamily="Arial"
//                               fill="#FFF"
//                             >
//                               a
//                             </text>
//                           </svg>
//                         </span>
//                         <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-xs font-mono">
//                           {product.marketplaceProductId || "--"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-sm">
//                       {product.createdAt
//                         ? new Date(product.createdAt).toLocaleDateString()
//                         : "-"}
//                     </td>
//                     <td className="py-3 px-4 flex justify-center items-center space-x-2">
//                       <Link
//                         to={`/products/${product._id}/edit`}
//                         className="inline-flex p-2 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 focus:outline-none cursor-pointer"
//                         title="Edit"
//                       >
//                         <FiEdit size={18} />
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="inline-flex p-2 bg-red-50 text-red-700 rounded-full hover:bg-red-100 focus:outline-none cursor-pointer"
//                         title="Delete"
//                       >
//                         <FiTrash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { API_URL } from "../config/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | inactive

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = `${API_URL}/products`;
      const res = await fetch(url, { headers: { Authorization: token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  const activeCount = products.filter((p) => p.active).length;

  const filtered = products.filter((p) => {
    if (filter === "active") return p.active;
    if (filter === "inactive") return !p.active;
    return true;
  });

  return (
    <Box sx={{ minHeight: "100vh", pt: { xs: 10, md: 14 }, pb: 6, background: "linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Stack>
            <Typography variant="h3" fontWeight={800}>Products</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your catalog and keep product details up to date
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            component={RouterLink}
            to="/products/create"
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              fontWeight: 700,
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              boxShadow: 3,
              "&:hover": { background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", boxShadow: 6 },
            }}
          >
            New Product
          </Button>
        </Stack>

        {/* Top bar: quick stats + filter */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={3} flexWrap="wrap" useFlexGap>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Inventory2RoundedIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Active Products:
              </Typography>
              <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                {activeCount} / {products.length}
              </Typography>
              {activeCount === products.length && products.length > 0 && (
                <CheckCircleRoundedIcon sx={{ ml: 0.5 }} color="success" fontSize="small" />
              )}
            </Stack>

            <FormControl size="small" sx={{ minWidth: 180, ml: "auto" }}>
              <InputLabel id="prod-filter-label">Filter</InputLabel>
              <Select
                labelId="prod-filter-label"
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">Show All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Table / Empty / Loading */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table stickyHeader size="small" aria-label="products table">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 700 } }}>
                  <TableCell width={64}></TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>ASIN</TableCell>
                  <TableCell>Added On</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" fontWeight={800} gutterBottom>
                        No products found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Try changing the filter or add a new product.
                      </Typography>
                      <Button
                        variant="contained"
                        component={RouterLink}
                        to="/products/create"
                        sx={{
                          px: 3, py: 1.25, borderRadius: 2, fontWeight: 700,
                          background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                          "&:hover": { background: "linear-gradient(90deg, #1d4ed8, #6d28d9)" },
                        }}
                      >
                        Create Product
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => (
                    <TableRow hover key={product._id}>
                      <TableCell>
                        <Avatar
                          variant="rounded"
                          alt={product.name}
                          src={product.imageurl || undefined}
                          sx={{ width: 48, height: 48, bgcolor: "grey.100", fontWeight: 700 }}
                        >
                          {(!product.imageurl && product.name) ? product.name.charAt(0).toUpperCase() : "P"}
                        </Avatar>
                      </TableCell>

                      <TableCell>
                        <Typography noWrap title={product.name}>{product.name || "-"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ maxWidth: 280 }}>
                          {/* Simple Amazon-like badge */}
                          <Box
                            aria-hidden
                            sx={{
                              width: 20, height: 20, borderRadius: "50%",
                              bgcolor: "#ff9900", color: "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, fontWeight: 800, textTransform: "lowercase",
                            }}
                          >
                            a
                          </Box>
                          <Typography noWrap title={product.marketplaceProductId || "--"}>
                            {product.marketplaceProductId || "--"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={product.active ? "ACTIVE" : "INACTIVE"}
                          color={product.active ? "success" : "default"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              color="warning"
                              component={RouterLink}
                              to={`/products/${product._id}/edit`}
                              size="small"
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(product._id)}
                              size="small"
                            >
                              <DeleteRoundedIcon fontSize="small" />
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

          {!loading && filtered.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: 2, textAlign: "right", color: "text.secondary" }}>
                <Typography variant="caption">
                  Showing {filtered.length} product{filtered.length > 1 ? "s" : ""}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
