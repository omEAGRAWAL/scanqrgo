// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL } from "../config/api";

// export default function CreatePromotion() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   console.log("Token:", error);
//   const [form, setForm] = useState({
//     name: "",
//     type: "extended warranty", // default to extended warranty
//     description: "",
//     provider: "",
//     codeType: "same",
//     codeValue: "",
//     value: { amount: "", currency: "INR" },
//   });

//   function handleChange(e) {
//     const { name, value, type: inputType, files } = e.target;
//     if (name.startsWith("value.")) {
//       const key = name.split(".")[1];
//       setForm((prev) => ({
//         ...prev,
//         value: { ...prev.value, [key]: value },
//       }));
//     } else if (name === "csvFile") {
//       setCsvFile(files[0]);
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: inputType === "checkbox" ? e.target.checked : value,
//       }));
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       let promotionData = {
//         name: form.name,
//         type: form.type,
//         description: form.description,
//         provider: form.provider || undefined,
//         value: form.value.amount ? form.value : undefined,
//         codeType: form.codeType,
//         codeValue: form.codeValue,
//       };

//       let body, headers;
//       if (form.codeType === "unique" && csvFile) {
//         const formData = new FormData();
//         formData.append(
//           "promotionData",
//           new Blob([JSON.stringify(promotionData)], {
//             type: "application/json",
//           })
//         );
//         formData.append("csvFile", csvFile);
//         body = formData;
//         headers = { Authorization: token };
//       } else {
//         body = JSON.stringify(promotionData);
//         headers = { "Content-Type": "application/json", Authorization: token };
//       }

//       const res = await fetch(`${API_URL}/promotions`, {
//         method: "POST",
//         headers,
//         body,
//       });

//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.message || "Failed to create promotion");

//       navigate("/promotions");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const promotionTypes = [
//     {
//       value: "extended warranty",
//       label: "📱 Extended Warranty",
//       desc: "Give honest feedback to get a 3-month warranty extension (period customizable)",
//     },
//     {
//       value: "discount code",
//       label: "🏷️ Discount Coupon",
//       desc: "Offer percentage or fixed amount discounts for future purchases",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             to="/promotions"
//             className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
//           >
//             <span className="mr-2">←</span>
//             Back to Promotions
//           </Link>
//           <div className="bg-white rounded-2xl shadow-xl">
//             <div className="px-8 py-6 border-b border-gray-100">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Create New Promotion
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Design attractive offers to engage your customers
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8 space-y-8">
//               {/* Promotion Name */}
//               <div>
//                 <label className="block text-lg font-semibold text-gray-800 mb-1">
//                   Promotion Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="e.g., ₹100 Paytm Cashback Offer"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
//                 />
//               </div>

//               {/* Promotion Type */}
//               <div className="space-y-4">
//                 <label className="block text-lg font-semibold text-gray-800 mb-1">
//                   Promotion Type *
//                 </label>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   {promotionTypes.map((type) => (
//                     <label
//                       key={type.value}
//                       className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
//                         form.type === type.value
//                           ? "border-blue-500 bg-blue-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="type"
//                         value={type.value}
//                         checked={form.type === type.value}
//                         onChange={handleChange}
//                         className="sr-only"
//                       />
//                       <div className="flex-1 flex items-center space-x-3">
//                         <span className="text-2xl">
//                           {type.label.split(" ")[0]}
//                         </span>
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {type.label.split(" ").slice(1).join(" ")}
//                           </p>
//                           <p className="text-sm text-gray-600">{type.desc}</p>
//                         </div>
//                       </div>
//                       {form.type === type.value && (
//                         <div className="absolute top-3 right-3">
//                           <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                             <span className="text-white text-xs">✓</span>
//                           </div>
//                         </div>
//                       )}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-lg font-semibold text-gray-800 mb-1">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   rows={4}
//                   required
//                   value={form.description}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//                   placeholder="Describe what customers will receive and any terms & conditions..."
//                 />
//                 <p className="text-sm text-gray-500">
//                   This description will be shown to customers when they view
//                   this promotion
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-lg font-semibold text-gray-800 mb-1">
//                   Code Configuration
//                 </label>
//                 <div className="bg-gray-50 rounded-xl p-6 space-y-4">
//                   <div className="flex items-center space-x-6">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="codeType"
//                         value="same"
//                         checked={form.codeType === "same"}
//                         onChange={handleChange}
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span>Coupon code</span>
//                     </label>
//                   </div>

//                   {form.codeType === "same" && (
//                     <input
//                       type="text"
//                       name="codeValue"
//                       value={form.codeValue}
//                       onChange={handleChange}
//                       placeholder="Enter promo code (e.g., SAVE100)"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* Submit & Cancel Buttons */}
//               <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
//                 <Link
//                   to="/promotions"
//                   className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition"
//                 >
//                   Cancel
//                 </Link>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`px-8 py-3 rounded-xl font-semibold shadow text-white ${
//                     loading
//                       ? "bg-blue-300 cursor-not-allowed"
//                       : "bg-blue-600 hover:bg-blue-700"
//                   }`}
//                 >
//                   {loading ? "Creating..." : "Create Promotion"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
// In a real app, you would use useNavigate from react-router-dom
import { useNavigate } from "react-router-dom";

// Placeholder for API_URL if not defined elsewhere
// const API_URL = "/api/promotions"; // Example API endpoint
import { API_URL } from "../config/api";

export default function CreatePromotion() {
  // API_URL = API_URL ;
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offerType, setOfferType] = useState("extended-warranty"); // 'extended-warranty' or 'discount-code'
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    offerTitle: "",
    warrantyPeriod: "3", // Default warranty selection
    customWarranty: "",
    couponCode: "",
    expiryDate: "",
    termsAndConditions: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleWarrantyPeriodChange = (period) => {
    setForm((prevForm) => ({
      ...prevForm,
      warrantyPeriod: period,
      customWarranty: period !== "Custom" ? "" : prevForm.customWarranty,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // --- Data Validation ---
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
        setError("Please specify the custom warranty period.");
        setLoading(false);
        return;
      }
      payload.warrantyPeriod =
        form.warrantyPeriod === "Custom"
          ? form.customWarranty
          : form.warrantyPeriod;
    } else {
      // discount-code
      if (!form.couponCode) {
        setError("Discount Code is required for this offer type.");
        setLoading(false);
        return;
      }
      payload.couponCode = form.couponCode;
      // You might want to include expiryDate in the payload if your backend supports it
      // payload.expiryDate = form.expiryDate;
    }

    console.log("Submitting payload:", payload);

    try {
      // --- API Call ---
      // Replace with your actual API call logic
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include Authorization header if needed
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create promotion.");
      }

      const result = await response.json();
      console.log("Promotion created successfully:", result);
      alert("Promotion created successfully!");

      navigate("/home"); // Redirect on success
    } catch (err) {
      setError(err.message);
      console.error("Create promotion error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 text-left">
          Create Promotion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Promotion Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 3months_EW"
            />
          </div>

          {/* Offer Title */}
          <div>
            <label
              htmlFor="offerTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Offer Title
            </label>
            <input
              type="text"
              id="offerTitle"
              name="offerTitle"
              value={form.offerTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Offer Title"
            />
          </div>

          {/* Offer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Type
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setOfferType("extended-warranty")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                  offerType === "extended-warranty"
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                Extended Warranty
              </button>
              <button
                type="button"
                onClick={() => setOfferType("discount-code")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                  offerType === "discount-code"
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                Discount Code
              </button>
            </div>
          </div>

          {/* Conditional Fields */}
          {offerType === "extended-warranty" ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Warranty Time
              </label>
              <div className="flex space-x-2">
                {["3 ", "6", "Custom"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => handleWarrantyPeriodChange(period)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                      form.warrantyPeriod === period
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              {form.warrantyPeriod === "Custom" && (
                <div>
                  <label
                    htmlFor="customWarranty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Custom Warranty Period
                  </label>
                  <input
                    type="text"
                    id="customWarranty"
                    name="customWarranty"
                    value={form.customWarranty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 1 Year"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="couponCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Add Discount Code
                </label>
                <input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  value={form.couponCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., SAVE10"
                />
              </div>
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
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
              placeholder={
                offerType === "extended-warranty"
                  ? "Enter your extended warranty terms and conditions..."
                  : "Enter your coupon code terms and conditions..."
              }
            ></textarea>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
            >
              {loading ? "Creating..." : "Create Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
