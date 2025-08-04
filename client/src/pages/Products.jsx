// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { API_URL } from "../config/api";
// import { HiExternalLink } from "react-icons/hi"; // for external link icon

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   async function fetchProducts() {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/products`, {
//         headers: { Authorization: token },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch products");
//       setProducts(data.products || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Dummy amazon icon base64
//   // const amazonLogo = "data:image/svg+xml;base64,..."; // Or use an <svg> inline for the a logo

//   return (
//     <div className="min-h-screen bg-gray-50 p-20">
//       <div className="max-w-5xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 flex items-center space-x-2">
//             <span>+ New Product</span>
//           </button>
//           <select className="border rounded px-3 py-1 text-gray-600">
//             <option>Show All</option>
//             {/* add more filters as needed */}
//           </select>
//         </div>

//         <div className="mb-4 text-sm text-gray-500">
//           Active Products:{" "}
//           <span className="font-bold">
//             {products.filter((p) => p.active).length} / {products.length}
//           </span>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <div className="overflow-x-auto bg-white rounded">
//           <table className="min-w-full">
//             <thead>
//               <tr className="text-left text-gray-500 border-b">
//                 <th className="py-3 px-4 font-medium"> </th>
//                 <th className="py-3 px-2 font-medium"> </th>
//                 <th className="py-3 px-4 font-medium">ASIN</th>
//                 <th className="py-3 px-4 font-medium">Campaigns</th>
//                 <th className="py-3 px-4 font-medium">Added On</th>
//                 <th className="py-3 px-4 font-medium"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="py-6 text-center text-gray-500">
//                     Loading products...
//                   </td>
//                 </tr>
//               ) : products.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="py-8 text-center text-gray-500">
//                     No products found.
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((product) => (
//                   <tr key={product._id} className="border-b hover:bg-gray-100">
//                     <td className="py-3 px-4">
//                       <img
//                         src={
//                           product.imageUrl || "https://via.placeholder.com/40"
//                         }
//                         alt={product.name}
//                         className="w-10 h-10 object-cover rounded"
//                       />
//                     </td>
//                     <td className="py-3 px-2">
//                       <div className="font-medium text-gray-900">
//                         {product.name}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex items-center space-x-2">
//                         {/* You can use an <svg> icon for Amazon or a base64 image */}
//                         <span>
//                           {/* Replace with actual <svg> for Amazon logo */}
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
//                         <span>{product.marketplaceProductId || "--"}</span>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-blue-500">
//                       <Link to={`/products/${product._id}/campaigns`}>
//                         {product.campaignCount || 0}
//                       </Link>
//                     </td>
//                     <td className="py-3 px-4 text-sm">
//                       {product.createdAt ? product.createdAt.slice(0, 10) : "-"}
//                     </td>
//                     <td className="py-3 px-4">
//                       <Link
//                         to={`/products/${product._id}/edit`}
//                         className="text-teal-600 hover:text-teal-800"
//                         title="Edit"
//                       >
//                         <HiExternalLink size={20} />
//                       </Link>
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
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { FiEdit } from "react-icons/fi"; // Pencil/edit icon

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/products/create"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 flex items-center space-x-2"
          >
            <span>+ New Product</span>
          </Link>
          <select className="border rounded px-3 py-1 text-gray-600">
            <option>Show All</option>
          </select>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          Active Products:{" "}
          <span className="font-bold">
            {products.filter((p) => p.active).length} / {products.length}
          </span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 px-4 font-medium"></th>
                <th className="py-3 px-2 font-medium">Product Name</th>
                <th className="py-3 px-4 font-medium">ASIN</th>
                <th className="py-3 px-4 font-medium">Added On</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">
                      <img
                        src={
                          product.imageurl ||
                          "https://via.placeholder.com/40?text=No+Image"
                        }
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded bg-gray-100"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {/* Amazon logo SVG */}
                        <span>
                          <svg width="18" height="18" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="14" fill="#ff9900" />
                            <text
                              x="8"
                              y="22"
                              fontSize="16"
                              fontFamily="Arial"
                              fill="#FFF"
                            >
                              a
                            </text>
                          </svg>
                        </span>
                        <span>{product.marketplaceProductId || "--"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {product.createdAt ? product.createdAt.slice(0, 10) : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="text-teal-600 hover:text-teal-800"
                        title="Edit"
                      >
                        <FiEdit size={20} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
