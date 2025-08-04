import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "all", type: "all" });

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line
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

      const res = await fetch(url, {
        headers: { Authorization: token },
      });
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
      alert(err.message);
    }
  }

  function getTypeColor(type) {
    const colors = {
      giftcard: "bg-green-100 text-green-800",
      "discount code": "bg-blue-100 text-blue-800",
      "extended warranty": "bg-purple-100 text-purple-800",
      custom: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  }

  function getStatusColor(status) {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Promotions</h1>
          <Link
            to="/promotions/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Create New Promotion
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="giftcard">Gift Card</option>
                <option value="discount code">Discount Code</option>
                <option value="extended warranty">Extended Warranty</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Empty state */}
        {promotions.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-7xl mb-6">🎁</div>
            <p className="text-lg mb-6">No promotions found</p>
            <Link
              to="/promotions/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Your First Promotion
            </Link>
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="py-3 px-6 font-semibold text-gray-700">Name</th>
                <th className="py-3 px-6 font-semibold text-gray-700">
                  Description
                </th>
                <th className="py-3 px-6 font-semibold text-gray-700">Type</th>
                <th className="py-3 px-6 font-semibold text-gray-700">
                  Status
                </th>
                
                <th className="py-3 px-6 font-semibold text-gray-700">
                  Created On
                </th>
                <th className="py-3 px-6 font-semibold text-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-600">
                    Loading promotions...
                  </td>
                </tr>
              ) : (
                promotions.map((promotion, i) => (
                  <tr
                    key={promotion._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-4 px-6 max-w-xs truncate">
                      {promotion.name}
                    </td>
                    <td className="py-4 px-6 max-w-sm truncate">
                      {promotion.description || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold uppercase inline-block ${getTypeColor(
                          promotion.type
                        )}`}
                      >
                        {promotion.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold uppercase inline-block ${getStatusColor(
                          promotion.status
                        )}`}
                      >
                        {promotion.status}
                      </span>
                    </td>
                    
             
                  
                    <td className="py-4 px-6">
                      {promotion.createdAt
                        ? new Date(promotion.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-6 flex gap-2 justify-center items-center">
                      <Link
                        to={`/promotions/${promotion._id}`}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`/promotions/${promotion._id}/edit`}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePromotion(promotion._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
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
