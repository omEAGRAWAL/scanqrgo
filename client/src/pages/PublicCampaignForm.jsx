// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// export default function PublicCampaignForm() {
//   const { id } = useParams();
//   const [campaign, setCampaign] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [response, setResponse] = useState(null);

//   const [form, setForm] = useState({
//     selectedProduct: "",
//     orderNumber: "",
//     satisfaction: "",
//     usedMoreThan7Days: "",
//     customerName: "",
//     email: "",
//     phoneNumber: "",
//     review: "",
//   });

//   const satisfactionOptions = [
//     "Very Satisfied",
//     "Somewhat Satisfied",
//     "Neither Satisfied Nor Dissatisfied",
//     "Somewhat Dissatisfied",
//     "Very Dissatisfied",
//   ];

//   useEffect(() => {
//     fetchCampaign();
//   }, [id]);

//   async function fetchCampaign() {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/public/campaign/${id}`
//       );
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Campaign not found");

//       setCampaign(data.campaign);

//       // Auto-select product if only one
//       if (data.campaign.products?.length === 1) {
//         setForm((prev) => ({
//           ...prev,
//           selectedProduct: data.campaign.products[0]._id,
//         }));
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/public/campaign/${id}/submit`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to submit form");

//       setResponse(data);
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-lg text-gray-600">Loading campaign...</div>
//       </div>
//     );
//   }

//   if (error && !campaign) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 text-center">
//           <div className="text-4xl mb-4">❌</div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Campaign Not Found
//           </h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (submitted && response) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center">
//           <div className="text-6xl mb-6">🎉</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             {response.message}
//           </h2>

//           {response.shouldShowReward && response.promotion && (
//             <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl mb-6">
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">
//                 Your Reward:
//               </h3>
//               <div className="text-lg font-bold text-purple-800 mb-2">
//                 {response.promotion.name}
//               </div>
//               <p className="text-gray-700">{response.promotion.description}</p>
//               {response.promotion.provider && (
//                 <p className="text-sm text-gray-600 mt-2">
//                   Provider: {response.promotion.provider}
//                 </p>
//               )}
//             </div>
//           )}

//           {response.shouldShowReviewForm && form.review && (
//             <div className="bg-blue-100 p-4 rounded-xl mb-6">
//               <p className="text-blue-800">
//                 Thank you for your detailed review! It helps us improve our
//                 products.
//               </p>
//             </div>
//           )}

//           <p className="text-gray-600">
//             Thank you for taking the time to share your feedback with us!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header */}
//           <div
//             className="px-8 py-6 text-white"
//             style={{
//               backgroundColor:
//                 campaign?.customization?.primaryColor || "#3B82F6",
//               background:
//                 campaign?.customization?.backgroundStyle === "gradient"
//                   ? `linear-gradient(135deg, ${
//                       campaign?.customization?.primaryColor || "#3B82F6"
//                     }, ${campaign?.customization?.primaryColor || "#3B82F6"}dd)`
//                   : campaign?.customization?.primaryColor || "#3B82F6",
//             }}
//           >
//             <h1 className="text-2xl font-bold mb-2">{campaign?.name}</h1>
//             <p className="opacity-90">
//               {campaign?.customization?.customMessage ||
//                 "We'd love to hear about your experience!"}
//             </p>
//             <p className="text-sm opacity-75 mt-2">
//               By {campaign?.seller?.name}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="p-8 space-y-6">
//             {/* Product Selection */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Select Product *
//               </label>
//               <select
//                 name="selectedProduct"
//                 value={form.selectedProduct}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Choose a product</option>
//                 {campaign?.products?.map((product) => (
//                   <option key={product._id} value={product._id}>
//                     {product.name}{" "}
//                     {product.marketplace && `(${product.marketplace})`}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Order Number */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Order Number *
//               </label>
//               <input
//                 type="text"
//                 name="orderNumber"
//                 value={form.orderNumber}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your order number"
//               />
//             </div>

//             {/* Satisfaction Level */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 How happy are you with our product? *
//               </label>
//               <div className="space-y-2">
//                 {satisfactionOptions.map((option) => (
//                   <label
//                     key={option}
//                     className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
//                   >
//                     <input
//                       type="radio"
//                       name="satisfaction"
//                       value={option}
//                       checked={form.satisfaction === option}
//                       onChange={handleChange}
//                       required
//                       className="w-4 h-4 text-blue-600 mr-3"
//                     />
//                     <span className="text-gray-700">{option}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Usage Duration */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Have you been using this product for more than 7 days? *
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="usedMoreThan7Days"
//                     value="Yes"
//                     checked={form.usedMoreThan7Days === "Yes"}
//                     onChange={handleChange}
//                     required
//                     className="w-4 h-4 text-blue-600 mr-3"
//                   />
//                   <span className="text-gray-700">Yes</span>
//                 </label>
//                 <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="usedMoreThan7Days"
//                     value="No"
//                     checked={form.usedMoreThan7Days === "No"}
//                     onChange={handleChange}
//                     required
//                     className="w-4 h-4 text-blue-600 mr-3"
//                   />
//                   <span className="text-gray-700">No</span>
//                 </label>
//               </div>
//             </div>

//             {/* Customer Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Customer Information
//               </h3>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Your Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={form.customerName}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your full name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your email address"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   value={form.phoneNumber}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your phone number"
//                 />
//               </div>
//             </div>

//             {/* Review Section - Show based on campaign type and smart funnel logic */}
//             {campaign?.category === "review" &&
//               (!campaign?.enableSmartFunnel ||
//                 form.satisfaction === "Very Satisfied") && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Review{" "}
//                     {campaign?.reviewMinimumLength &&
//                       `(minimum ${campaign.reviewMinimumLength} characters)`}
//                   </label>
//                   <textarea
//                     name="review"
//                     value={form.review}
//                     onChange={handleChange}
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                     placeholder="Share your experience with this product..."
//                     minLength={campaign?.reviewMinimumLength || 0}
//                   />
//                   {campaign?.reviewMinimumLength && form.review && (
//                     <p
//                       className={`text-xs mt-1 ${
//                         form.review.length >= campaign.reviewMinimumLength
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {form.review.length}/{campaign.reviewMinimumLength}{" "}
//                       characters
//                     </p>
//                   )}
//                 </div>
//               )}

//             {/* Error Display */}
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
//                 <div className="flex">
//                   <span className="text-red-600 mr-3">⚠️</span>
//                   <p className="text-red-700">{error}</p>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
//             >
//               {submitting ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Submitting...
//                 </span>
//               ) : (
//                 "Submit Feedback"
//               )}
//             </button>
//             <button
//               onClick={() => {
//                 // Get the selected product's marketplace ID
//                 const selectedProduct = campaign?.products?.find(
//                   (p) => p._id === form.selectedProduct
//                 );
//                 const productId =
//                   selectedProduct?.marketplaceProductId ||
//                   "PRODUCT_ID_NOT_FOUND";

//                 // Construct Amazon review URL
//                 const amazonReviewUrl = `https://www.amazon.in/review/create-review/?asin=${productId}`;

//                 // Open in new tab
//                 window.open(amazonReviewUrl, "_blank", "noopener,noreferrer");
//               }}
//               className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
//             >
//               📝 Review on Amazon
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PublicCampaignForm() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState(null);

  const [form, setForm] = useState({
    selectedProduct: "",
    orderNumber: "",
    satisfaction: "",
    usedMoreThan7Days: "",
    customerName: "",
    email: "",
    phoneNumber: "",
    review: "",
  });

  const satisfactionOptions = [
    "Very Satisfied",
    "Somewhat Satisfied",
    "Neither Satisfied Nor Dissatisfied",
    "Somewhat Dissatisfied",
    "Very Dissatisfied",
  ];

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/public/campaign/${id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Campaign not found");

      setCampaign(data.campaign);

      // Auto-select product if only one
      if (data.campaign.products?.length === 1) {
        setForm((prev) => ({
          ...prev,
          selectedProduct: data.campaign.products[0]._id,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/public/campaign/${id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit form");

      setResponse(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Check if Amazon review button should be shown
  const shouldShowAmazonButton = () => {
    return (
      (form.satisfaction === "Very Satisfied" ||
        form.satisfaction === "Somewhat Satisfied") &&
      form.selectedProduct
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div className="text-lg text-gray-600 font-medium">
            Loading campaign...
          </div>
        </div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center border border-red-100">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted && response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-green-100">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {response.message}
          </h2>

          {response.shouldShowReward && response.promotion && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6 border border-purple-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Your Reward:
              </h3>
              <div className="text-lg font-bold text-purple-800 mb-2">
                {response.promotion.name}
              </div>
              <p className="text-gray-700">{response.promotion.description}</p>
              {response.promotion.provider && (
                <p className="text-sm text-gray-600 mt-2">
                  Provider: {response.promotion.provider}
                </p>
              )}
            </div>
          )}

          {response.shouldShowReviewForm && form.review && (
            <div className="bg-blue-50 p-6 rounded-2xl mb-6 border border-blue-200">
              <p className="text-blue-800 font-medium">
                Thank you for your detailed review! It helps us improve our
                products.
              </p>
            </div>
          )}

          <p className="text-gray-600 text-lg">
            Thank you for taking the time to share your feedback with us!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div
            className="px-8 py-8 text-white relative overflow-hidden"
            style={{
              backgroundColor:
                campaign?.customization?.primaryColor || "#3B82F6",
              background:
                campaign?.customization?.backgroundStyle === "gradient"
                  ? `linear-gradient(135deg, ${
                      campaign?.customization?.primaryColor || "#3B82F6"
                    }, ${campaign?.customization?.primaryColor || "#3B82F6"}dd)`
                  : campaign?.customization?.primaryColor || "#3B82F6",
            }}
          >
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-3">{campaign?.name}</h1>
              <p className="opacity-90 text-lg">
                {campaign?.customization?.customMessage ||
                  "We'd love to hear about your experience!"}
              </p>
              <p className="text-sm opacity-75 mt-3 font-medium">
                By {campaign?.seller?.name}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Product Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Select Product *
              </label>
              <select
                name="selectedProduct"
                value={form.selectedProduct}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">Choose a product</option>
                {campaign?.products?.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}{" "}
                    {product.marketplace && `(${product.marketplace})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Number */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Order Number *
              </label>
              <input
                type="text"
                name="orderNumber"
                value={form.orderNumber}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your order number"
              />
            </div>

            {/* Satisfaction Level */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                How happy are you with our product? *
              </label>
              <div className="space-y-3">
                {satisfactionOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="radio"
                      name="satisfaction"
                      value={option}
                      checked={form.satisfaction === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-600 mr-4 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Usage Duration */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Have you been using this product for more than 7 days? *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="usedMoreThan7Days"
                    value="Yes"
                    checked={form.usedMoreThan7Days === "Yes"}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 text-green-600 mr-3 focus:ring-green-500"
                  />
                  <span className="text-gray-800 font-medium">Yes</span>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-red-300 hover:bg-red-50 cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="usedMoreThan7Days"
                    value="No"
                    checked={form.usedMoreThan7Days === "No"}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 text-red-600 mr-3 focus:ring-red-500"
                  />
                  <span className="text-gray-800 font-medium">No</span>
                </label>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                Customer Information
              </h3>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Review Section - Show based on campaign type and smart funnel logic */}
            {campaign?.category === "review" &&
              (!campaign?.enableSmartFunnel ||
                form.satisfaction === "Very Satisfied") && (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Review{" "}
                    {campaign?.reviewMinimumLength &&
                      `(minimum ${campaign.reviewMinimumLength} characters)`}
                  </label>
                  <textarea
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Share your experience with this product..."
                    minLength={campaign?.reviewMinimumLength || 0}
                  />
                  {campaign?.reviewMinimumLength && form.review && (
                    <p
                      className={`text-sm mt-2 font-medium ${
                        form.review.length >= campaign.reviewMinimumLength
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {form.review.length}/{campaign.reviewMinimumLength}{" "}
                      characters
                    </p>
                  )}
                </div>
              )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl">
                <div className="flex">
                  <span className="text-red-600 mr-3 text-xl">⚠️</span>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>

            {/* Amazon Review Button - Only show when satisfaction is Very Satisfied or Somewhat Satisfied */}
            {shouldShowAmazonButton() && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 mb-4">
                  <p className="text-orange-800 font-medium text-center">
                    ⭐ We'd love your review on Amazon too!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Get the selected product's marketplace ID
                    const selectedProduct = campaign?.products?.find(
                      (p) => p._id === form.selectedProduct
                    );
                    const productId =
                      selectedProduct?.marketplaceProductId ||
                      "PRODUCT_ID_NOT_FOUND";

                    // Construct Amazon review URL
                    const amazonReviewUrl = `https://www.amazon.in/review/create-review/?asin=${productId}`;

                    // Open in new tab
                    window.open(
                      amazonReviewUrl,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📝 Review on Amazon
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
