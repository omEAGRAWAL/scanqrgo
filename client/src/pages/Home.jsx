// import React, { useEffect, useState } from "react";
// import { API_URL } from "../config/api";

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     products: 0,
//     campaigns: 0,
//     promotions: 0,
//     reviews: 0,
//   });

//   const [campaigns, setCampaigns] = useState([]);
//   const [selectedCampaignId, setSelectedCampaignId] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [loadingSummary, setLoadingSummary] = useState(true);
//   const [loadingReviews, setLoadingReviews] = useState(false);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchSummary();
//     fetchCampaigns();
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     if (selectedCampaignId) {
//       fetchReviewsForCampaign(selectedCampaignId);
//     } else {
//       fetchAllReviews();
//     }
//   }, [selectedCampaignId]);

//   async function fetchSummary() {
//     setLoadingSummary(true);
//     try {
//       // const headers =s token ? { Authorization: token } : {};
//       const [productRes, campaignRes, promotionRes, reviewsRes] =
//         await Promise.all([
//           // fetch(`${API_URL}/products`, { headers }),
//           // fetch(`${API_URL}/campaigns`, { headers }),
//           // fetch(`${API_URL}/promotions`, { headers }),
//           // fetch(`${API_URL}/reviews`, { headers }),
//           fetch(`${API_URL}/products`, { headers: { Authorization: token } }),
//           fetch(`${API_URL}/campaigns`, { headers: { Authorization: token } }),
//           fetch(`${API_URL}/promotions`, { headers: { Authorization: token } }),
//           fetch(`${API_URL}/public/reviews`, {
//             headers: { Authorization: token },
//           }),
//         ]);

//       const productData = await productRes.json();
//       const campaignData = await campaignRes.json();
//       const promotionData = await promotionRes.json();
//       const reviewsData = await reviewsRes.json();

//       setStats({
//         products: productData.products?.length || 0,
//         campaigns: campaignData.campaigns?.length || 0,
//         promotions: promotionData.promotions?.length || 0,
//         reviews: reviewsData.total || reviewsData.count || 0,
//       });
//     } catch (error) {
//       console.error("Failed to fetch summary", error);
//     } finally {
//       setLoadingSummary(false);
//     }
//   }

//   async function fetchCampaigns() {
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/campaigns`, { headers });
//       const data = await res.json();
//       setCampaigns(data.campaigns || []);
//     } catch (error) {
//       console.error("Failed to fetch campaigns", error);
//     }
//   }

//   async function fetchAllReviews() {
//     setLoadingReviews(true);
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/public/reviews`, { headers });
//       const data = await res.json();
//       setReviews(data.reviews || []);
//     } catch (error) {
//       console.error("Failed to fetch all reviews", error);
//       setReviews([]);
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   async function fetchReviewsForCampaign(id) {
//     setLoadingReviews(true);
//     try {
//       const headers = token ? { Authorization: token } : {};
//       const res = await fetch(`${API_URL}/public/campaign/${id}/reviews`, {
//         headers,
//       });
//       const data = await res.json();
//       setReviews(data.reviews || []);
//     } catch (error) {
//       console.error(`Failed to fetch reviews for campaign ${id}`, error);
//       setReviews([]);
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Dashboard Summary
//         </h1>

//         {/* Summary Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Products</h3>
//             <p className="text-3xl font-semibold text-blue-600">
//               {loadingSummary ? "..." : stats.products}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Campaigns</h3>
//             <p className="text-3xl font-semibold text-green-600">
//               {loadingSummary ? "..." : stats.campaigns}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Promotions</h3>
//             <p className="text-3xl font-semibold text-purple-600">
//               {loadingSummary ? "..." : stats.promotions}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <h3 className="text-gray-500 text-sm mb-2">Reviews</h3>
//             <p className="text-3xl font-semibold text-orange-600">
//               {loadingSummary ? "..." : stats.reviews}
//             </p>
//           </div>
//         </div>

//         {/* Campaign Selector */}
//         <div className="mb-6">
//           <label
//             htmlFor="campaign"
//             className="block text-gray-700 font-semibold mb-2"
//           >
//             Select Campaign
//           </label>
//           <select
//             id="campaign"
//             className="border rounded p-2 w-full max-w-md"
//             value={selectedCampaignId}
//             onChange={(e) => setSelectedCampaignId(e.target.value)}
//           >
//             <option value="">All Campaigns</option>
//             {campaigns.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Reviews Table */}
//         <div className="bg-white rounded-lg shadow overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Date
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Campaign
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Product
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Customer Name
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Email
//                 </th>
//                 <th className="text-left px-4 py-2 text-gray-600 font-semibold">
//                   Review
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loadingReviews ? (
//                 <tr>
//                   <td colSpan={6} className="text-center p-4 text-gray-600">
//                     Loading reviews...
//                   </td>
//                 </tr>
//               ) : reviews.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center p-4 text-gray-400">
//                     No reviews found.
//                   </td>
//                 </tr>
//               ) : (
//                 reviews.map((r) => (
//                   <tr key={r._id} className="border-b">
//                     <td className="px-4 py-2">
//                       {new Date(r.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-2">{r.campaign?.name || "-"}</td>
//                     <td className="px-4 py-2">{r.product?.name || "-"}</td>
//                     <td className="px-4 py-2">{r.customerName || "-"}</td>
//                     <td className="px-4 py-2">{r.email || "-"}</td>
//                     <td className="px-4 py-2 max-w-2xl whitespace-pre-wrap">
//                       {r.review}
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
import { API_URL } from "../config/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    campaigns: 0,
    promotions: 0,
    reviews: 0,
  });

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSummary();
    fetchCampaigns();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      fetchReviewsForCampaign(selectedCampaignId);
    } else {
      fetchAllReviews();
    }
  }, [selectedCampaignId]);

  async function fetchSummary() {
    setLoadingSummary(true);
    try {
      const headers = token ? { Authorization: token } : {};
      const [productRes, campaignRes, promotionRes, reviewsRes] =
        await Promise.all([
          fetch(`${API_URL}/products`, { headers }),
          fetch(`${API_URL}/campaigns`, { headers }),
          fetch(`${API_URL}/promotions`, { headers }),
          fetch(`${API_URL}/public/reviews`, { headers }),
        ]);

      const productData = await productRes.json();
      const campaignData = await campaignRes.json();
      const promotionData = await promotionRes.json();
      const reviewsData = await reviewsRes.json();

      setStats({
        products: productData.products?.length || 0,
        campaigns: campaignData.campaigns?.length || 0,
        promotions: promotionData.promotions?.length || 0,
        reviews: reviewsData.total || reviewsData.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch summary", error);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function fetchCampaigns() {
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/campaigns`, { headers });
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    }
  }

  async function fetchAllReviews() {
    setLoadingReviews(true);
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/public/reviews`, { headers });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch all reviews", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function fetchReviewsForCampaign(id) {
    setLoadingReviews(true);
    try {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/public/campaign/${id}/reviews`, {
        headers,
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(`Failed to fetch reviews for campaign ${id}`, error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  // Convert JSON array to CSV string
  function arrayToCSV(data) {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((field) => {
            let val = row[field];
            if (val === null || val === undefined) val = "";
            else if (typeof val === "string") {
              val = val.replace(/"/g, '""');
              if (val.search(/("|,|\\n)/g) >= 0) {
                val = `"${val}"`;
              }
            }
            return val;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  }

  // Trigger CSV download of reviews
  function downloadCSV() {
    if (!reviews.length) {
      alert("No reviews available to download");
      return;
    }

    // Flatten nested fields for CSV
    const csvData = reviews.map(
      ({
        _id,
        createdAt,
        campaign,
        product,
        customerName,
        email,
        phoneNumber,
        review,
      }) => ({
        ID: _id,
        Date: new Date(createdAt).toLocaleString(),
        Campaign: campaign?.name || "",
        Product: product?.name || "",
        CustomerName: customerName || "",
        Email: email || "",
        Review: review || "",
        PhoneNumber: phoneNumber || "",
      })
    );

    const csvString = arrayToCSV(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reviews_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard Summary
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm mb-2">Products</h3>
            <p className="text-3xl font-semibold text-blue-600">
              {loadingSummary ? "..." : stats.products}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm mb-2">Campaigns</h3>
            <p className="text-3xl font-semibold text-green-600">
              {loadingSummary ? "..." : stats.campaigns}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm mb-2">Promotions</h3>
            <p className="text-3xl font-semibold text-purple-600">
              {loadingSummary ? "..." : stats.promotions}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm mb-2">Reviews</h3>
            <p className="text-3xl font-semibold text-orange-600">
              {loadingSummary ? "..." : stats.reviews}
            </p>
          </div>
        </div>

        {/* Campaign Selector */}
        <div className="mb-6">
          <label
            htmlFor="campaign"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Campaign
          </label>
          <select
            id="campaign"
            className="border rounded p-2 w-full max-w-md"
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
          >
            <option value="">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Download CSV button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download CSV
          </button>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Date
                </th>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Campaign
                </th>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Product
                </th>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Customer Name
                </th>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Email
                </th>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Phone Number
                </th>
                <th className="text-left px-4 py-2 text-gray-600 font-semibold">
                  Review
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingReviews ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-600">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r._id} className="border-b">
                    <td className="px-4 py-2">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{r.campaign?.name || "-"}</td>
                    <td className="px-4 py-2">{r.product?.name || "-"}</td>
                    <td className="px-4 py-2">{r.customerName || "-"}</td>
                    <td className="px-4 py-2">{r.email || "-"}</td>
                    <td className="px-4 py-2">{r.phoneNumber || "-"}</td>
                    <td className="px-4 py-2 max-w-2xl whitespace-pre-wrap">
                      {r.review}
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
