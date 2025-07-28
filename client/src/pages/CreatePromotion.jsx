import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreatePromotion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "giftcard",
    description: "",
    provider: "",
    deliveryType: "auto",
    codeType: "same",
    codeValue: "",
    value: { amount: "", currency: "INR" },
  });

  const token = localStorage.getItem("token");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("value.")) {
      const valueKey = name.split(".")[1];
      setForm({
        ...form,
        value: { ...form.value, [valueKey]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const promotionData = {
        name: form.name,
        type: form.type,
        description: form.description,
        provider: form.provider || undefined,
        deliveryType: form.deliveryType,
        value: form.value.amount ? form.value : undefined,
      };

      const res = await fetch("http://localhost:5000/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(promotionData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create promotion");
      navigate("/promotions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const promotionTypes = [
    {
      value: "giftcard",
      label: "🎁 Gift Card",
      desc: "Digital gift cards and e-vouchers",
    },
    {
      value: "discount code",
      label: "🏷️ Discount Code",
      desc: "Percentage or fixed amount discounts",
    },
    {
      value: "custom",
      label: "🎯 Free Product",
      desc: "Complimentary products or samples",
    },
    {
      value: "extended warranty",
      label: "📱 Digital Download",
      desc: "Downloadable content and services",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/promotions"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Promotions
          </Link>
          <div className="bg-white rounded-2xl shadow-xl border-0">
            <div className="px-8 py-6 border-b border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Promotion
              </h1>
              <p className="text-gray-600 mt-2">
                Design attractive offers to engage your customers
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Promotion Name */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 block">
                  Promotion Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  placeholder="e.g., ₹100 Paytm Cashback Offer"
                />
              </div>

              {/* Promotion Type */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Promotion Type *
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {promotionTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                        form.type === type.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={form.type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {type.label.split(" ")[0]}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {type.label.split(" ").slice(1).join(" ")}
                            </p>
                            <p className="text-sm text-gray-600">{type.desc}</p>
                          </div>
                        </div>
                      </div>
                      {form.type === type.value && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 block">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe what customers will receive and any terms & conditions..."
                />
                <p className="text-sm text-gray-500">
                  This description will be shown to customers when they scan the
                  QR code
                </p>
              </div>

              {/* Provider & Value */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800 block">
                    Provider
                  </label>
                  <select
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Provider</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800 block">
                    Value Amount
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl">
                      ₹
                    </span>
                    <input
                      name="value.amount"
                      type="number"
                      placeholder="100"
                      value={form.value.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Code Configuration */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Code Configuration
                </label>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="codeType"
                        value="same"
                        checked={form.codeType === "same"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">
                        Same code for everyone
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="codeType"
                        value="unique"
                        checked={form.codeType === "unique"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">
                        Unique codes (CSV upload)
                      </span>
                    </label>
                  </div>

                  {form.codeType === "same" && (
                    <div className="mt-4">
                      <input
                        type="text"
                        name="codeValue"
                        value={form.codeValue}
                        onChange={handleChange}
                        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter promo code (e.g., SAVE100)"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 block">
                  Delivery Method
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.deliveryType === "auto"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="auto"
                      checked={form.deliveryType === "auto"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Automatic Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          Instant delivery upon completion
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.deliveryType === "manual"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="manual"
                      checked={form.deliveryType === "manual"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Manual Approval
                        </p>
                        <p className="text-sm text-gray-600">
                          Requires manual verification
                        </p>
                      </div>
                    </div>
                  </label>
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
                  to="/promotions"
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
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
                    "Create Promotion"
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
