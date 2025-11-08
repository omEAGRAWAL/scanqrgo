// import React, { useState } from "react";
// // In a real app, you would use useNavigate from react-router-dom
// import { useNavigate } from "react-router-dom";

// // Placeholder for API_URL if not defined elsewhere
// // const API_URL = "/api/promotions"; // Example API endpoint
// import { API_URL } from "../config/api";

// export default function CreatePromotion() {
//   // API_URL = API_URL ;
//   // const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [offerType, setOfferType] = useState("extended-warranty"); // 'extended-warranty' or 'discount-code'
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     offerTitle: "",
//     warrantyPeriod: "3", // Default warranty selection
//     customWarranty: "",
//     couponCode: "",
//     expiryDate: "",
//     termsAndConditions: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };

//   const handleWarrantyPeriodChange = (period) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       warrantyPeriod: period,
//       customWarranty: period !== "Custom" ? "" : prevForm.customWarranty,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // --- Data Validation ---
//     if (!form.name || !form.offerTitle || !form.termsAndConditions) {
//       setError("Promotion Name, Offer Title, and Terms are required.");
//       setLoading(false);
//       return;
//     }

//     let payload = {
//       name: form.name,
//       offerTitle: form.offerTitle,
//       type:
//         offerType === "extended-warranty"
//           ? "extended warranty"
//           : "discount code",
//       termsAndConditions: form.termsAndConditions,
//     };

//     if (offerType === "extended-warranty") {
//       if (form.warrantyPeriod === "Custom" && !form.customWarranty) {
//         setError("Please specify the custom warranty period.");
//         setLoading(false);
//         return;
//       }
//       payload.warrantyPeriod =
//         form.warrantyPeriod === "Custom"
//           ? form.customWarranty
//           : form.warrantyPeriod;
//     } else {
//       // discount-code
//       if (!form.couponCode) {
//         setError("Discount Code is required for this offer type.");
//         setLoading(false);
//         return;
//       }
//       payload.couponCode = form.couponCode;
//       // You might want to include expiryDate in the payload if your backend supports it
//       // payload.expiryDate = form.expiryDate;
//     }

//     console.log("Submitting payload:", payload);

//     try {
//       // --- API Call ---
//       // Replace with your actual API call logic
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/promotions`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Include Authorization header if needed
//           Authorization: `${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create promotion.");
//       }

//       const result = await response.json();
//       console.log("Promotion created successfully:", result);
//       alert("Promotion created successfully!");

//       navigate("/home"); // Redirect on success
//     } catch (err) {
//       setError(err.message);
//       console.error("Create promotion error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
//       <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-8">
//         <h1 className="text-4xl font-bold text-gray-800 text-left">
//           Create Promotion
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Promotion Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Promotion Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="e.g., 3months_EW"
//             />
//           </div>

//           {/* Offer Title */}
//           <div>
//             <label
//               htmlFor="offerTitle"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Offer Title
//             </label>
//             <input
//               type="text"
//               id="offerTitle"
//               name="offerTitle"
//               value={form.offerTitle}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter Offer Title"
//             />
//           </div>

//           {/* Offer Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Offer Type
//             </label>
//             <div className="flex space-x-2">
//               <button
//                 type="button"
//                 onClick={() => setOfferType("extended-warranty")}
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
//                   offerType === "extended-warranty"
//                     ? "bg-indigo-600 text-white shadow"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 Extended Warranty
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setOfferType("discount-code")}
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
//                   offerType === "discount-code"
//                     ? "bg-indigo-600 text-white shadow"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 Discount Code
//               </button>
//             </div>
//           </div>

//           {/* Conditional Fields */}
//           {offerType === "extended-warranty" ? (
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Select Warranty Time
//               </label>
//               <div className="flex space-x-2">
//                 {["3 months", "6 months", "Custom"].map((period) => (
//                   <button
//                     key={period}
//                     type="button"
//                     onClick={() => handleWarrantyPeriodChange(period)}
//                     className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
//                       form.warrantyPeriod === period
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
//                     }`}
//                   >
//                     {period}
//                   </button>
//                 ))}
//               </div>
//               {form.warrantyPeriod === "Custom" && (
//                 <div>
//                   <label
//                     htmlFor="customWarranty"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Custom Warranty Period
//                   </label>
//                   <input
//                     type="text"
//                     id="customWarranty"
//                     name="customWarranty"
//                     value={form.customWarranty}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="e.g., 1 Month"
//                   />
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="couponCode"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Add Discount Code
//                 </label>
//                 <input
//                   type="text"
//                   id="couponCode"
//                   name="couponCode"
//                   value={form.couponCode}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="e.g., SAVE10"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="expiryDate"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Expiry Date
//                 </label>
//                 <input
//                   type="date"
//                   id="expiryDate"
//                   name="expiryDate"
//                   value={form.expiryDate}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Terms and Conditions */}
//           <div>
//             <label
//               htmlFor="termsAndConditions"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Terms and Conditions
//             </label>

//             {/* use a markdown input that can remember line break */}

//             <textarea
//               id="termsAndConditions"
//               name="termsAndConditions"
//               rows="4"
//               value={form.termsAndConditions}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder={
//                 offerType === "extended-warranty"
//                   ? "Enter your extended warranty terms and conditions..."
//                   : "Enter your coupon code terms and conditions..."
//               }
//             ></textarea>
//           </div>

//           {error && <p className="text-sm text-red-600">{error}</p>}

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
//             >
//               {loading ? "Creating..." : "Create Promotion"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import { API_URL } from "../config/api";
// export default function EditPromotion() {
//   const [form, setForm] = useState({
//     name: "",
//     type: "",
//     description: "",
//     provider: "",
//     deliveryType: "auto",
//     status: "active",
//     value: { amount: "", currency: "INR" }
//   });
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchPromotion();
//   }, [id]);

//   async function fetchPromotion() {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/promotions/${id}`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch promotion");

//       setForm({
//         name: data.name || "",
//         type: data.type || "",
//         description: data.description || "",
//         provider: data.provider || "",
//         deliveryType: data.deliveryType || "auto",
//         status: data.status || "active",
//         value: data.value || { amount: "", currency: "INR" }
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setFetchLoading(false);
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const promotionData = {
//         name: form.name,
//         type: form.type,
//         description: form.description,
//         provider: form.provider || undefined,
//         deliveryType: form.deliveryType,
//         status: form.status,
//         value: form.value.amount ? form.value : undefined
//       };

//       const res = await fetch(`${API_URL}/promotions/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${token}`,
//         },
//         body: JSON.stringify(promotionData),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update promotion");

//       navigate("/promotions");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleChange(e) {
//     const { name, value } = e.target;
//     if (name.startsWith('value.')) {
//       const valueKey = name.split('.')[1];
//       setForm({
//         ...form,
//         value: { ...form.value, [valueKey]: value }
//       });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading promotion...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-8">
//           <Link
//             to="/promotions"
//             className="text-blue-600 hover:underline mb-4 inline-block"
//           >
//             ← Back to Promotions
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">Edit Promotion</h1>
//         </div>

//         <div className="bg-white p-8 rounded-lg shadow">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Promotion Name *
//               </label>
//               <input
//                 name="name"
//                 type="text"
//                 placeholder="e.g., ₹100 Paytm Cashback"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Promotion Type *
//               </label>
//               <select
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Select Type</option>
//                 <option value="giftcard">Gift Card</option>
//                 <option value="discount code">Discount Code</option>
//                 <option value="extended warranty">Extended Warranty</option>
//                 <option value="custom">Custom</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 placeholder="Describe what customers will receive..."
//                 value={form.description}
//                 onChange={handleChange}
//                 required
//                 rows={3}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Provider (Optional)
//               </label>
//               <input
//                 name="provider"
//                 type="text"
//                 placeholder="e.g., Paytm, PhonePe, Amazon"
//                 value={form.provider}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Amount (Optional)
//                 </label>
//                 <input
//                   name="value.amount"
//                   type="number"
//                   placeholder="100"
//                   value={form.value?.amount || ""}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Currency
//                 </label>
//                 <select
//                   name="value.currency"
//                   value={form.value?.currency || "INR"}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="INR">INR</option>
//                   <option value="USD">USD</option>
//                   <option value="EUR">EUR</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Type
//               </label>
//               <select
//                 name="deliveryType"
//                 value={form.deliveryType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="auto">Automatic Delivery</option>
//                 <option value="manual">Manual Delivery</option>
//               </select>
//             </div>

//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {loading ? "Updating..." : "Update Promotion"}
//               </button>
//               <Link
//                 to="/promotions"
//                 className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-center"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm"; // For tables, strikethrough, lists, etc.
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function PromotionForm() {
  const { id } = useParams(); // If present, it’s edit mode
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState("");
  // const [previewMode, setPreviewMode] = useState(false);

  const [offerType, setOfferType] = useState("extended-warranty");
  const [form, setForm] = useState({
    name: "",
    offerTitle: "",
    warrantyPeriod: "3 months",
    customWarranty: "",
    couponCode: "",
    expiryDate: "",
    termsAndConditions: "",
  });

  // 🧠 Fetch existing promotion if editing
  useEffect(() => {
    if (!id) return;
    const fetchPromotion = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/promotions/${id}`, {
          headers: { Authorization: `${token}` },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch promotion");

        // Populate form
        setForm({
          name: data.name || "",
          offerTitle: data.offerTitle || "",
          warrantyPeriod: data.warrantyPeriod || "3 months",
          customWarranty: data.customWarranty || "",
          couponCode: data.couponCode || "",
          expiryDate: data.expiryDate || "",
          termsAndConditions: data.termsAndConditions || "",
        });

        setOfferType(
          data.type === "discount code" ? "discount-code" : "extended-warranty"
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  // 🔄 Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarrantyPeriodChange = (period) => {
    setForm((prev) => ({
      ...prev,
      warrantyPeriod: period,
      customWarranty: period !== "Custom" ? "" : prev.customWarranty,
    }));
  };

  // 🚀 Create or Update Promotion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.offerTitle || !form.termsAndConditions) {
      setError("Promotion Name, Offer Title, and Terms are required.");
      setLoading(false);
      return;
    }

    let payload = {
      name: form.name,
      offerTitle: form.offerTitle,
      type:
        offerType === "extended-warranty"
          ? "extended warranty"
          : "discount code",
      termsAndConditions: form.termsAndConditions,
    };

    if (offerType === "extended-warranty") {
      if (form.warrantyPeriod === "Custom" && !form.customWarranty) {
        setError("Please specify custom warranty period.");
        setLoading(false);
        return;
      }
      payload.warrantyPeriod =
        form.warrantyPeriod === "Custom"
          ? form.customWarranty
          : form.warrantyPeriod;
    } else {
      if (!form.couponCode) {
        setError("Discount Code is required for this offer type.");
        setLoading(false);
        return;
      }
      payload.couponCode = form.couponCode;
      if (form.expiryDate) payload.expiryDate = form.expiryDate;
    }

    try {
      const token = localStorage.getItem("token");
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/promotions/${id}` : `${API_URL}/promotions`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save promotion");

      alert(id ? "Promotion updated successfully!" : "Promotion created!");
      navigate("/promotions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Loading Screen
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700 text-lg animate-pulse">
          Loading promotion details...
        </div>
      </div>
    );
  }

  // 🧱 Form UI
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? "Edit Promotion" : "Create Promotion"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Name */}
          <Input
            label="Promotion Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="e.g., 3months_EW"
          />

          {/* Offer Title */}
          <Input
            label="Offer Title"
            name="offerTitle"
            value={form.offerTitle}
            onChange={handleInputChange}
            placeholder="Enter Offer Title"
          />

          {/* Offer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Type
            </label>
            <div className="flex space-x-2">
              {[
                { id: "extended-warranty", label: "Extended Warranty" },
                { id: "discount-code", label: "Discount Code" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setOfferType(t.id)}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                    offerType === t.id
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Fields */}
          {offerType === "extended-warranty" ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Warranty Duration
              </label>
              <div className="flex space-x-2">
                {["3 months", "6 months", "Custom"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => handleWarrantyPeriodChange(period)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                      form.warrantyPeriod === period
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              {form.warrantyPeriod === "Custom" && (
                <Input
                  label="Custom Warranty Period"
                  name="customWarranty"
                  value={form.customWarranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 year"
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Discount Code"
                name="couponCode"
                value={form.couponCode}
                onChange={handleInputChange}
                placeholder="e.g., SAVE10"
              />
              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Terms and Conditions */}
          {/* 
          <div>
            <label
              htmlFor="termsAndConditions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Terms and Conditions
            </label>
            <textarea
              id="termsAndConditions"
              name="termsAndConditions"
              rows="4"
              value={form.termsAndConditions}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter terms with line breaks..."
            ></textarea>
          </div> */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Terms and Conditions
            </label>

            <SimpleMDE
              value={form.termsAndConditions}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, termsAndConditions: value }))
              }
              options={{
                spellChecker: false,
                autofocus: true,
                autosave: {
                  enabled: false,
                },
                placeholder:
                  offerType === "extended-warranty"
                    ? "Enter your extended warranty terms and conditions..."
                    : "Enter your coupon code terms and conditions...",
                renderingConfig: {
                  singleLineBreaks: false,
                  codeSyntaxHighlighting: true,
                },
                toolbar: [
                  "bold",
                  "italic",
                  "heading",
                  "|",
                  "quote",
                  "unordered-list",
                  "ordered-list",
                  "|",
                  "link",
                  "code",
                  "preview",
                  "guide",
                ],
                status: false,
                minHeight: "200px",
              }}
            />
            <div>press Shift+Enter to get a new line</div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-all"
          >
            {loading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update Promotion"
              : "Create Promotion"}
          </button>
        </form>
      </div>
    </div>
  );
}

// 🔹 Reusable input field
function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
