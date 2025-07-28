import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config/api";
export default function PromotionDetail() {
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  async function fetchPromotion() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/promotions/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch promotion");

      setPromotion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getTypeIcon(type) {
    const icons = {
      giftcard: "🎁",
      "discount code": "🏷️",
      "extended warranty": "🛡️",
      custom: "⚙️"
    };
    return icons[type] || "🎯";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading promotion...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/promotions"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Promotions
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{getTypeIcon(promotion.type)}</span>
            <h1 className="text-3xl font-bold text-gray-900">{promotion.name}</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-3 ${promotion.status === 'active' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                promotion.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {promotion.status === 'active' ? '✅ Active' : '❌ Inactive'}
              </span>
              <span className="text-sm text-gray-500">
                Created: {new Date(promotion.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Promotion Details</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Type</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {promotion.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Description</label>
                      <p className="mt-1 text-gray-900">{promotion.description}</p>
                    </div>
                    {promotion.provider && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Provider</label>
                        <p className="mt-1 text-gray-900">{promotion.provider}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Value Information */}
                {promotion.value && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Value Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {typeof promotion.value === 'object' 
                          ? `${promotion.value.amount || 'N/A'} ${promotion.value.currency || ''}` 
                          : promotion.value}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Settings & Stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="font-medium text-gray-700">Delivery Type</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        promotion.deliveryType === 'auto' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {promotion.deliveryType === 'auto' ? '🤖 Automatic' : '👤 Manual'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="font-medium text-gray-700">Status</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        promotion.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {promotion.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Stats (Placeholder) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Statistics</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-xs text-gray-500">Times Used</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-gray-500">Active Campaigns</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={`/promotions/${promotion._id}/edit`}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
              >
                Edit Promotion
              </Link>
              <Link
                to="/promotions"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Back to Promotions
              </Link>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => alert('Campaign creation with this promotion coming soon!')}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
