import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from "../config/api";
export default function EditCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    status: "active",
    category: "promotion",
    promotion: "",
    products: [],
    reviewMinimumLength: 10,
    enableSmartFunnel: false,
    promotionSettings: {
      codeType: "same",
      codeValue: "",
      deliveryType: "auto",
      maxRedemptions: "",
    },
    customization: {
      primaryColor: "#3B82F6",
      customMessage: "",
      backgroundStyle: "solid",
    },
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCampaign();
    fetchProducts();
    fetchPromotions();
  }, [id]);

  async function fetchCampaign() {
    try {
      const res = await fetch(`${API_URL}/campaigns/${id}`, {
        headers: { Authorization: token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");

      setForm({
        name: data.name || "",
        status: data.status || "active",
        category: data.category || "promotion",
        promotion: data.promotion?._id || "",
        products: data.products?.map((p) => p._id) || [],
        reviewMinimumLength: data.reviewMinimumLength || 10,
        enableSmartFunnel: data.enableSmartFunnel || false,
        promotionSettings: {
          codeType: data.promotionSettings?.codeType || "same",
          codeValue: data.promotionSettings?.codeValue || "",
          deliveryType: data.promotionSettings?.deliveryType || "auto",
          maxRedemptions: data.promotionSettings?.maxRedemptions || "",
        },
        customization: {
          primaryColor: data.customization?.primaryColor || "#3B82F6",
          customMessage: data.customization?.customMessage || "",
          backgroundStyle: data.customization?.backgroundStyle || "solid",
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }

  async function fetchPromotions() {
    try {
      const res = await fetch(
        `${API_URL}/promotions?status=active`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await res.json();
      if (res.ok) setPromotions(data.promotions || []);
    } catch (err) {
      console.error("Failed to fetch promotions:", err);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("promotionSettings.")) {
      const settingKey = name.split(".")[1];
      setForm({
        ...form,
        promotionSettings: { ...form.promotionSettings, [settingKey]: value },
      });
    } else if (name.startsWith("customization.")) {
      const customKey = name.split(".")[1];
      setForm({
        ...form,
        customization: { ...form.customization, [customKey]: value },
      });
    } else if (name === "products") {
      const productId = value;
      const pr = promotions;
      console.log("Selected product ID:", pr);
      const isChecked = checked;
      setForm({
        ...form,
        products: isChecked
          ? [...form.products, productId]
          : form.products.filter((id) => id !== productId),
      });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const campaignData = {
        name: form.name,
        status: form.status,
        products: form.products,
        ...(form.category === "promotion" && {
          promotionSettings: form.promotionSettings,
        }),
        ...(form.category === "review" && {
          reviewMinimumLength: form.reviewMinimumLength,
          enableSmartFunnel: form.enableSmartFunnel,
        }),
        customization: form.customization,
      };

      const res = await fetch(`${API_URL}/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(campaignData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update campaign");

      navigate("/campaigns");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading campaign...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/campaigns"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Campaigns
          </Link>

          <div className="bg-white rounded-2xl shadow-xl">
            <div className="px-8 py-6 border-b border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Campaign
              </h1>
              <p className="text-gray-600 mt-2">
                Update your campaign settings and configuration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Campaign Name */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 block">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 block">
                  Campaign Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* Products Selection */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Associated Products *
                </label>
                <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-3">
                    {products.map((product) => (
                      <label
                        key={product._id}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50"
                      >
                        <input
                          type="checkbox"
                          name="products"
                          value={product._id}
                          checked={form.products.includes(product._id)}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.marketplace}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category-specific settings */}
              {form.category === "promotion" && (
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-800 block">
                    Promotion Settings
                  </label>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code Type
                        </label>
                        <select
                          name="promotionSettings.codeType"
                          value={form.promotionSettings.codeType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="same">Same for everyone</option>
                          <option value="unique">Unique codes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Redemptions
                        </label>
                        <input
                          type="number"
                          name="promotionSettings.maxRedemptions"
                          value={form.promotionSettings.maxRedemptions}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {form.promotionSettings.codeType === "same" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Promotion Code
                        </label>
                        <input
                          type="text"
                          name="promotionSettings.codeValue"
                          value={form.promotionSettings.codeValue}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {form.category === "review" && (
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-800 block">
                    Review Settings
                  </label>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Review Length
                      </label>
                      <input
                        type="number"
                        name="reviewMinimumLength"
                        value={form.reviewMinimumLength}
                        onChange={handleChange}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="enableSmartFunnel"
                          checked={form.enableSmartFunnel}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-medium text-gray-700">
                          Enable Smart Funnel
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Customization */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Customization
                </label>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        name="customization.primaryColor"
                        value={form.customization.primaryColor}
                        onChange={handleChange}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Style
                      </label>
                      <select
                        name="customization.backgroundStyle"
                        value={form.customization.backgroundStyle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="solid">Solid Color</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Message
                    </label>
                    <textarea
                      name="customization.customMessage"
                      value={form.customization.customMessage}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                  <div className="flex">
                    <span className="text-red-600 mr-3">⚠️</span>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <Link
                  to="/campaigns"
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || form.products.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Updating...
                    </span>
                  ) : (
                    "Update Campaign"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
