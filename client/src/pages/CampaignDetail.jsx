import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

//env from .env
import { API_URL } from "../config/api";

export default function CampaignDetail() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/campaigns/${id}`, {
        headers: { Authorization: token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");

      setCampaign(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getCategoryIcon(category) {
    return category === "promotion" ? "🎁" : "⭐";
  }

  function getStatusColor(status) {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ended: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading campaign...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/campaigns"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Campaigns
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-5xl">
                {getCategoryIcon(campaign.category)}
              </span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {campaign.name}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {campaign.category} Campaign
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600">
              {campaign.analytics?.totalScans || 0}
            </div>
            <div className="text-sm text-gray-600">Total Scans</div>
            <div className="text-xs text-gray-400 mt-1">QR code scans</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-green-600">
              {campaign.analytics?.totalCompletions || 0}
            </div>
            <div className="text-sm text-gray-600">Completions</div>
            <div className="text-xs text-gray-400 mt-1">Funnel completed</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-purple-600">
              {campaign.analytics?.totalRedemptions || 0}
            </div>
            <div className="text-sm text-gray-600">Redemptions</div>
            <div className="text-xs text-gray-400 mt-1">Rewards claimed</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-orange-600">
              {campaign.analytics?.conversionRate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600">Conversion</div>
            <div className="text-xs text-gray-400 mt-1">Completion rate</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Campaign Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Campaign Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {campaign.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Type
                  </label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {campaign.category}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Associated Products
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {campaign.products?.map((product) => (
                  <div
                    key={product._id}
                    className="p-4 border border-gray-200 rounded-xl"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.marketplace}
                    </p>
                    {product.marketplaceProductId && (
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {product.marketplaceProductId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Promotion Details (if promotion campaign) */}
            {campaign.category === "promotion" && campaign.promotion && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Promotion Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Promotion Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.promotion.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Type
                    </label>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {campaign.promotion.type}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <p className="text-gray-700">
                      {campaign.promotion.description}
                    </p>
                  </div>
                  {campaign.promotionSettings && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Code Type
                        </label>
                        <p className="text-gray-900 capitalize">
                          {campaign.promotionSettings.codeType}
                        </p>
                      </div>
                      {campaign.promotionSettings.maxRedemptions && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Max Redemptions
                          </label>
                          <p className="text-gray-900">
                            {campaign.promotionSettings.maxRedemptions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {/* Public Form Link - Add this in the sidebar section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Public Form
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Public Form URL:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {window.location.origin}/campaign/{campaign._id}
                </code>
              </div>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/campaign/${campaign._id}`;
                  navigator.clipboard.writeText(url);
                  alert("Public form link copied to clipboard!");
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Copy Public Form Link
              </button>
              <a
                href={`/campaign/${campaign._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
              >
                Preview Form
              </a>
            </div>
          </div>
          <div className="space-y-8">
            {/* QR Code */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code</h3>
              {campaign.qrCodeUrl ? (
                <div>
                  <img
                    src={campaign.qrCodeUrl}
                    alt="Campaign QR Code"
                    className="mx-auto mb-4 border rounded-lg"
                  />
                  <button
                    onClick={() => window.open(campaign.qrCodeUrl, "_blank")}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Full Size
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">QR Code not generated</div>
              )}
            </div>

            {/* Customization */}
            {campaign.customization && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Customization
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Primary Color
                    </span>
                    <div
                      className="w-6 h-6 rounded border"
                      style={{
                        backgroundColor: campaign.customization.primaryColor,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Background
                    </span>
                    <span className="text-sm text-gray-900 capitalize">
                      {campaign.customization.backgroundStyle}
                    </span>
                  </div>
                  {campaign.customization.customMessage && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Message
                      </span>
                      <p className="text-sm text-gray-900">
                        {campaign.customization.customMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/campaigns/${campaign._id}/edit`}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                >
                  Edit Campaign
                </Link>
                <button
                  onClick={() => {
                    // Copy campaign link to clipboard
                    navigator.clipboard.writeText(
                      `https://yourapp.com/campaign/${campaign._id}`
                    );
                    alert("Campaign link copied to clipboard!");
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Copy Link
                </button>
                <Link
                  to="/campaigns"
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center block"
                >
                  Back to Campaigns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
