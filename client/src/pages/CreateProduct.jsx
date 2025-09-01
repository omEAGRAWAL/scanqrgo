// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { API_URL } from "../config/api";

// // export default function CreateProduct() {
// //   const [form, setForm] = useState({
// //     name: "",
// //     marketplace: "",
// //     marketplaceProductId: "",
// //     imageurl: "",
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [uploading, setUploading] = useState(false);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   // Handle text/select inputs change
// //   function handleChange(e) {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   }

// //   // Handle image file selection and upload
// //   async function handleImageChange(e) {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setUploading(true);
// //     setError("");

// //     try {
// //       const token = localStorage.getItem("token");
// //       const formData = new FormData();
// //       formData.append("file", file);

// //       const res = await fetch(`${API_URL}/upload`, {
// //         method: "POST",
// //         headers: {
// //           Authorization: token,
// //         },
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (!res.ok) throw new Error(data.message || "Image upload failed");

// //       setForm((prev) => ({
// //         ...prev,
// //         imageurl: data.url,
// //       }));
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setUploading(false);
// //     }
// //   }

// //   // Handle Create Product form submit
// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const token = localStorage.getItem("token");
// //       const res = await fetch(`${API_URL}/products`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: token,
// //         },
// //         body: JSON.stringify(form),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.message || "Failed to create product");

// //       navigate("/products");
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-2xl mx-auto">
// //         <div className="mb-8">
// //           <Link
// //             to="/products"
// //             className="text-blue-600 hover:underline mb-4 inline-block"
// //           >
// //             ← Back to Products
// //           </Link>
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Create New Product
// //           </h1>
// //         </div>

// //         <div className="bg-white p-8 rounded-lg shadow">
// //           {error && (
// //             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
// //               {error}
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Product Name *
// //               </label>
// //               <input
// //                 name="name"
// //                 type="text"
// //                 placeholder="Enter product name"
// //                 value={form.name}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Marketplace
// //               </label>
// //               <select
// //                 name="marketplace"
// //                 value={form.marketplace}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option value="">Select Marketplace</option>
// //                 <option value="Amazon India">Amazon India</option>
// //                 <option value="Flipkart">Flipkart</option>
// //                 <option value="Meesho">Meesho</option>
// //                 <option value="Snapdeal">Snapdeal</option>
// //                 <option value="Other">Other</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Marketplace Product ID
// //               </label>
// //               <input
// //                 name="marketplaceProductId"
// //                 type="text"
// //                 placeholder="e.g., B08XXXXX (Amazon ASIN)"
// //                 value={form.marketplaceProductId}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Product Image
// //               </label>
// //               <input
// //                 type="file"
// //                 accept="image/*"
// //                 onChange={handleImageChange}
// //                 className="w-full"
// //               />
// //               {uploading && (
// //                 <p className="text-gray-500 mt-2">Uploading image...</p>
// //               )}
// //               {form.imageurl && (
// //                 <img
// //                   src={form.imageurl}
// //                   alt="Product Preview"
// //                   className="mt-4 h-32 object-contain rounded border"
// //                 />
// //               )}
// //             </div>

// //             <div className="flex space-x-4">
// //               <button
// //                 type="submit"
// //                 disabled={loading || uploading}
// //                 className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
// //               >
// //                 {loading ? "Creating..." : "Create Product"}
// //               </button>
// //               <Link
// //                 to="/products"
// //                 className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-center"
// //               >
// //                 Cancel
// //               </Link>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";
import * as XLSX from "xlsx";
export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    amazonAsin: "",
    flipkartFsn: "",
    imageurl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  // const [error, setError] = useState("");
  // const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        setUploading(true);
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Validate headers
        const [header, ...body] = rows;
        if (
          !header ||
          header[0] !== "name" ||
          header[1] !== "flipkart-fsn" ||
          header[2] !== "amazon-asin" ||
          header[3] !== "imageurl"
        ) {
          setError(
            "Invalid Excel headers. Must be: name, flipkart-fsn, amazon-asin, imageurl."
          );
          setUploading(false);
          return;
        }

        // Map and validate data (skip empty rows)
        const products = body
          .filter((r) => r[0] || r[1] || r[2]) // at least one ID and name
          .map(([name, flipkartFsn, amazonAsin, imageurl]) => ({
            name,
            flipkartFsn,
            amazonAsin,
            imageurl,
          }));

        // At least 1 marketplace identifier per row
        const allValid = products.every(
          (p) =>
            p.name &&
            ((p.flipkartFsn && p.flipkartFsn.length >= 5) ||
              (p.amazonAsin && p.amazonAsin.length === 10))
        );
        if (!allValid) {
          setError(
            "Each row must have a product name and at least one valid Flipkart FSN or Amazon ASIN."
          );
          setUploading(false);
          return;
        }

        // Send to server
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/products/bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ products }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Bulk upload failed.");
        alert("Bulk upload successful!");
        navigate("/products");
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle text inputs change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle image file selection and upload
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Image upload failed");

      setForm((prev) => ({
        ...prev,
        imageurl: data.url,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  // Frontend validation: require at least one marketplace ID
  function validateMarketplaceIds() {
    if (!form.amazonAsin && !form.flipkartFsn) {
      setError(
        "Please provide at least one marketplace ID: either Amazon ASIN or Flipkart FSN."
      );
      return false;
    }
    // Further optional format checks:
    if (form.amazonAsin && form.amazonAsin.length !== 10) {
      setError("Amazon ASIN must be exactly 10 characters.");
      return false;
    }
    if (form.flipkartFsn && form.flipkartFsn.length < 5) {
      setError("Flipkart FSN must be at least 5 characters.");
      return false;
    }
    return true;
  }

  // Handle Create Product form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validateMarketplaceIds()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: form.name,
        amazonAsin: form.amazonAsin || undefined,
        flipkartFsn: form.flipkartFsn || undefined,
        imageurl: form.imageurl || undefined,
      };
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            to="/products"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Product
          </h1>
        </div>
        <div className="bg-white rounded shadow p-8 max-w-lg mx-auto">
          <h2 className="text-2xl mb-4 font-bold">Bulk Product Upload</h2>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block mb-4"
            disabled={uploading}
          />

          {fileName && <p className="my-2">Selected file: {fileName}</p>}
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {uploading && <div className="text-gray-500 mt-2">Uploading...</div>}
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Amazon ASIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amazon ASIN
              </label>
              <input
                name="amazonAsin"
                type="text"
                placeholder="e.g., B08XXXXX (10-char ASIN)"
                value={form.amazonAsin}
                maxLength={10}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                10-character Amazon ID (optional, but at least one marketplace
                ID required)
              </p>
            </div>

            {/* Flipkart FSN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flipkart FSN
              </label>
              <input
                name="flipkartFsn"
                type="text"
                placeholder="e.g., ACCEYZTGF..."
                value={form.flipkartFsn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Flipkart Serial Number (optional, but at least one marketplace
                ID required)
              </p>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {uploading && (
                <p className="text-gray-500 mt-2">Uploading image...</p>
              )}
              {form.imageurl && (
                <img
                  src={form.imageurl}
                  alt="Product Preview"
                  className="mt-4 h-32 object-contain rounded border"
                />
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
              <Link
                to="/products"
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { API_URL } from "../config/api";

// export default function BulkProductUpload() {
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const handleFileUpload = async (e) => {
//     setError("");
//     const file = e.target.files[0];
//     if (!file) return;

//     setFileName(file.name);
//     const reader = new FileReader();

//     reader.onload = async (evt) => {
//       try {
//         setUploading(true);
//         const data = new Uint8Array(evt.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//         const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

//         // Validate headers
//         const [header, ...body] = rows;
//         if (
//           !header ||
//           header[0] !== "name" ||
//           header[1] !== "flipkart-fsn" ||
//           header[2] !== "amazon-asin" ||
//           header[3] !== "imageurl"
//         ) {
//           setError(
//             "Invalid Excel headers. Must be: name, flipkart-fsn, amazon-asin, imageurl."
//           );
//           setUploading(false);
//           return;
//         }

//         // Map and validate data (skip empty rows)
//         const products = body
//           .filter((r) => r[0] || r[1] || r[2]) // at least one ID and name
//           .map(([name, flipkartFsn, amazonAsin, imageurl]) => ({
//             name,
//             flipkartFsn,
//             amazonAsin,
//             imageurl,
//           }));

//         // At least 1 marketplace identifier per row
//         const allValid = products.every(
//           (p) =>
//             p.name &&
//             ((p.flipkartFsn && p.flipkartFsn.length >= 5) ||
//               (p.amazonAsin && p.amazonAsin.length === 10))
//         );
//         if (!allValid) {
//           setError(
//             "Each row must have a product name and at least one valid Flipkart FSN or Amazon ASIN."
//           );
//           setUploading(false);
//           return;
//         }

//         // Send to server
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_URL}/products/bulk`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//           body: JSON.stringify({ products }),
//         });
//         const result = await res.json();
//         if (!res.ok) throw new Error(result.message || "Bulk upload failed.");
//         alert("Bulk upload successful!");
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setUploading(false);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="bg-white rounded shadow p-8 max-w-lg mx-auto">
//       <h2 className="text-2xl mb-4 font-bold">Bulk Product Upload</h2>
//       <input
//         type="file"
//         accept=".xlsx,.xls"
//         onChange={handleFileUpload}
//         className="block mb-4"
//         disabled={uploading}
//       />

//       {fileName && <p className="my-2">Selected file: {fileName}</p>}
//       {error && <div className="text-red-600 mt-4">{error}</div>}
//       {uploading && <div className="text-gray-500 mt-2">Uploading...</div>}
//     </div>
//   );
// }
