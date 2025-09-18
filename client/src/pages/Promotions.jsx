// import React, { useEffect, useState } from "react";
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
//   CircularProgress,
//   IconButton,
//   Stack,
// } from "@mui/material";
// import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
// import { API_URL } from "../config/api";

// export default function Promotions() {
//   const [promotions, setPromotions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState({ status: "all", type: "all" });

//   useEffect(() => {
//     fetchPromotions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filter]);

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
//     } catch (err) {
//       alert(err.message);
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

//   return (
//     <Box p={3}>
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
//         <FormControl size="small">
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

//         <FormControl size="small">
//           <InputLabel>Type</InputLabel>
//           <Select
//             label="Type"
//             value={filter.type}
//             onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="giftcard">Gift Card</MenuItem>
//             <MenuItem value="discount code">Discount Code</MenuItem>
//             <MenuItem value="extended warranty">Extended Warranty</MenuItem>
//             <MenuItem value="custom">Custom</MenuItem>
//           </Select>
//         </FormControl>
//       </Stack>

//       {/* Table */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" mt={5}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : promotions.length === 0 ? (
//         <Box textAlign="center" mt={5}>
//           <Typography>No promotions found</Typography>
//           <Button
//             variant="outlined"
//             component={Link}
//             to="/promotions/create"
//             sx={{ mt: 2 }}
//           >
//             Create Promotion
//           </Button>
//         </Box>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell sx={{ width: "30px" }}>Description</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Code Value</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Created</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {promotions.map((promotion) => (
//                 <TableRow key={promotion._id}>
//                   <TableCell>{promotion.name}</TableCell>
//                   <TableCell>{promotion.description || "-"}</TableCell>
//                   <TableCell>{promotion.type || "-"}</TableCell>
//                   <TableCell>{promotion.codeValue || "-"}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={promotion.status || "-"}
//                       color={statusColor(promotion.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {promotion.createdAt
//                       ? new Date(promotion.createdAt).toLocaleDateString()
//                       : "-"}
//                   </TableCell>
//                   <TableCell align="right">
//                     <Stack
//                       direction="row"
//                       spacing={1}
//                       justifyContent="flex-end"
//                     >
//                       <IconButton
//                         component={Link}
//                         to={`/promotions/${promotion._id}`}
//                       >
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         component={Link}
//                         to={`/promotions/${promotion._id}/edit`}
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         color="error"
//                         onClick={() => deletePromotion(promotion._id)}
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <Typography variant="body2" px={2} py={1} color="text.secondary">
//             Showing {promotions.length} promotion(s)
//           </Typography>
//         </TableContainer>
//       )}
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
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
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";

// In a real app, this would likely be in a config file
// const API_URL = {}; // Example API endpoi
import { API_URL } from "../config/api";
export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "all", type: "all" });

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function fetchPromotions() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `${API_URL}/promotions`;
      const params = new URLSearchParams();
      if (filter.status !== "all") params.append("status", filter.status);
      if (filter.type !== "all") params.append("type", filter.type);
      if (params.toString()) url += `?${params.toString()}`;
      const res = await fetch(url, { headers: { Authorization: token } });
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

  async function deletePromotion(promotionId) {
    // A custom modal would be better than window.confirm in a real app
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/promotions/${promotionId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete promotion");
      }
      setPromotions((prev) => prev.filter((p) => p._id !== promotionId));
    } catch (err) {
      // In a real app, you might use a snackbar for this message
      alert(err.message);
    }
  }

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
      return promotion.couponCode || "-";
    }
    if (promotion.type === "extended warranty") {
      // Assuming backend stores warrantyPeriod as a number (e.g., 3, 6)
      return promotion.warrantyPeriod
        ? `${promotion.warrantyPeriod} months`
        : "-";
    }
    return "-";
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" gutterBottom>
            Promotions
          </Typography>
          <Typography color="text.secondary">
            Create and manage promotional rewards & offers
          </Typography>
        </div>
        <Button
          component={Link}
          to="/promotions/create"
          variant="contained"
          startIcon={<Add />}
        >
          New Promotion
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} my={3}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filter.status}
            onChange={(e) =>
              setFilter((f) => ({ ...f, status: e.target.value }))
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={filter.type}
            onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="discount code">Discount Code</MenuItem>
            <MenuItem value="extended warranty">Extended Warranty</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : promotions.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <Typography>No promotions found</Typography>
          <Button
            variant="outlined"
            component={Link}
            to="/promotions/create"
            sx={{ mt: 2 }}
          >
            Create Promotion
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ minWidth: "200px" }}>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow hover key={promotion._id}>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.description || "-"}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {promotion.type || "-"}
                  </TableCell>
                  <TableCell>{renderCodeValue(promotion)}</TableCell>
                  <TableCell>
                    <Chip
                      label={promotion.status || "pending"}
                      color={statusColor(promotion.status)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    {promotion.createdAt
                      ? new Date(promotion.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        component={Link}
                        to={`/promotions/${promotion._id}`}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/promotions/${promotion._id}/edit`}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deletePromotion(promotion._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="body2" px={2} py={1} color="text.secondary">
            Showing {promotions.length} promotion(s)
          </Typography>
        </TableContainer>
      )}
    </Box>
  );
}
