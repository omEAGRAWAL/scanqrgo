import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [form, setForm] = useState({
    name: "",
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
    fetchProducts();
    fetchPromotions();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
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
        "http://localhost:5000/api/promotions?status=active",
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
        category: form.category,
        products: form.products,
        ...(form.category === "promotion" && {
          promotion: form.promotion,
          promotionSettings: form.promotionSettings,
        }),
        ...(form.category === "review" && {
          reviewMinimumLength: form.reviewMinimumLength,
          enableSmartFunnel: form.enableSmartFunnel,
        }),
        customization: form.customization,
      };

      const res = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(campaignData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create campaign");

      navigate("/campaigns");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
                Create New Campaign
              </h1>
              <p className="text-gray-600 mt-2">
                Set up a campaign to engage customers and track results
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
                  placeholder="e.g., Summer Sale 2025"
                />
              </div>

              {/* Campaign Category */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Campaign Type *
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      form.category === "promotion"
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="promotion"
                      checked={form.category === "promotion"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">🎁</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Promotion Campaign
                        </p>
                        <p className="text-sm text-gray-600">
                          Offer rewards and incentives
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      form.category === "review"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="review"
                      checked={form.category === "review"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">⭐</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Review Campaign
                        </p>
                        <p className="text-sm text-gray-600">
                          Collect customer reviews
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Products Selection */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Select Products *
                </label>
                <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No products found</p>
                      <Link
                        to="/products/create"
                        className="text-blue-600 hover:underline"
                      >
                        Create your first product
                      </Link>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>

              {/* Promotion-specific fields */}
              {form.category === "promotion" && (
                <>
                  <div className="space-y-4">
                    <label className="text-lg font-semibold text-gray-800 block">
                      Select Promotion *
                    </label>
                    <select
                      name="promotion"
                      value={form.promotion}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a promotion</option>
                      {promotions.map((promo) => (
                        <option key={promo._id} value={promo._id}>
                          {promo.name} ({promo.type})
                        </option>
                      ))}
                    </select>
                    {promotions.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No active promotions found.{" "}
                        <Link
                          to="/promotions/create"
                          className="text-blue-600 hover:underline"
                        >
                          Create one first
                        </Link>
                      </p>
                    )}
                  </div>

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
                            placeholder="1000"
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
                            placeholder="SAVE100"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Review-specific fields */}
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
                      <p className="text-sm text-gray-500 ml-7">
                        Only request reviews from satisfied customers
                      </p>
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
                      placeholder="Thank you for choosing our product!"
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
                      Creating...
                    </span>
                  ) : (
                    "Create Campaign"
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
