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
  }, [filter]);

  async function fetchPromotions() {
    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/promotions`;

      // Add filters to URL if not 'all'
      const params = new URLSearchParams();
      if (filter.status !== "all") params.append("status", filter.status);
      if (filter.type !== "all") params.append("type", filter.type);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch promotions");

      setPromotions(data.promotions || []);
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
      const res = await fetch(
        `${API_URL}/promotions/${promotionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete promotion");
      }

      setPromotions(promotions.filter((p) => p._id !== promotionId));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading promotions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Promotions</h1>
          <Link
            to="/promotions/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Promotion
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {promotions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-500 text-lg mb-4">No promotions found</p>
            <Link
              to="/promotions/create"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Your First Promotion
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <div
                key={promotion._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {promotion.name}
                  </h3>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        promotion.type
                      )}`}
                    >
                      {promotion.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        promotion.status
                      )}`}
                    >
                      {promotion.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {promotion.description}
                </p>

                {promotion.provider && (
                  <p className="text-sm text-gray-500 mb-2">
                    Provider: {promotion.provider}
                  </p>
                )}

                {promotion.value && (
                  <div className="text-sm text-gray-500 mb-3">
                    Value:{" "}
                    {typeof promotion.value === "object"
                      ? `${promotion.value.amount} ${
                          promotion.value.currency || ""
                        }`
                      : promotion.value}
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-400">
                    {promotion.deliveryType === "auto"
                      ? "🤖 Auto"
                      : "👤 Manual"}{" "}
                    Delivery
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(promotion.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/promotions/${promotion._id}`}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm text-center hover:bg-green-700"
                  >
                    View
                  </Link>
                  <Link
                    to={`/promotions/${promotion._id}/edit`}
                    className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm text-center hover:bg-yellow-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePromotion(promotion._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
