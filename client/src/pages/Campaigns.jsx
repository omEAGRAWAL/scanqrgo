import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// /env
import { API_URL } from "../config/api";
export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "all", category: "all" });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, [filter]);

  async function fetchCampaigns() {
    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/campaigns`;

      const params = new URLSearchParams();
      if (filter.status !== "all") params.append("status", filter.status);
      if (filter.category !== "all") params.append("category", filter.category);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch campaigns");

      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/campaigns/stats/dashboard", {
        headers: { Authorization: token },
      });

      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  async function deleteCampaign(campaignId) {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete campaign");
      }

      setCampaigns(campaigns.filter((c) => c._id !== campaignId));
      fetchStats(); // Refresh stats
    } catch (err) {
      alert(err.message);
    }
  }

  function getCategoryColor(category) {
    return category === "promotion" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-blue-100 text-blue-800";
  }

  function getStatusColor(status) {
    const colors = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      ended: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function getCategoryIcon(category) {
    return category === "promotion" ? "🎁" : "⭐";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaigns</h1>
            <p className="text-gray-600">Manage your marketing campaigns and track performance</p>
          </div>
          <Link
            to="/campaigns/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Create Campaign
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.summary.total}</div>
              <div className="text-sm text-gray-600">Total Campaigns</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-green-600">{stats.summary.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600">{stats.analytics.totalScans}</div>
              <div className="text-sm text-gray-600">Total Scans</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600">{stats.analytics.totalCompletions}</div>
              <div className="text-sm text-gray-600">Completions</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="promotion">Promotion</option>
                <option value="review">Review</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl mb-6">
            <div className="flex">
              <span className="text-red-600 mr-3">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {campaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No campaigns found</h3>
            <p className="text-gray-600 mb-8">Start creating campaigns to engage your customers and grow your business</p>
            <Link
              to="/campaigns/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getCategoryIcon(campaign.category)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{campaign.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
                          {campaign.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Products:</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.products?.slice(0, 2).map((product) => (
                      <span key={product._id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {product.name}
                      </span>
                    ))}
                    {campaign.products?.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{campaign.products.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{campaign.analytics?.totalScans || 0}</div>
                    <div className="text-xs text-gray-600">Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{campaign.analytics?.totalCompletions || 0}</div>
                    <div className="text-xs text-gray-600">Completions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {campaign.analytics?.conversionRate?.toFixed(1) || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Rate</div>
                  </div>
                </div>

                {/* Created date */}
                <p className="text-xs text-gray-500 mb-4">
                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                </p>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm text-center hover:bg-blue-700 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/campaigns/${campaign._id}/edit`}
                    className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm text-center hover:bg-yellow-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCampaign(campaign._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
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
