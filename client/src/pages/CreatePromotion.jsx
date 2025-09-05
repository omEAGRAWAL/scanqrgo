import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function CreatePromotion() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  console.log("Token:", error);
  const [form, setForm] = useState({
    name: "",
    type: "extended warranty", // default to extended warranty
    description: "",
    provider: "",
    codeType: "same",
    codeValue: "",
    value: { amount: "", currency: "INR" },
  });

  function handleChange(e) {
    const { name, value, type: inputType, files } = e.target;
    if (name.startsWith("value.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        value: { ...prev.value, [key]: value },
      }));
    } else if (name === "csvFile") {
      setCsvFile(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: inputType === "checkbox" ? e.target.checked : value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let promotionData = {
        name: form.name,
        type: form.type,
        description: form.description,
        provider: form.provider || undefined,
        value: form.value.amount ? form.value : undefined,
        codeType: form.codeType,
        codeValue: form.codeValue,
      };

      let body, headers;
      if (form.codeType === "unique" && csvFile) {
        const formData = new FormData();
        formData.append(
          "promotionData",
          new Blob([JSON.stringify(promotionData)], {
            type: "application/json",
          })
        );
        formData.append("csvFile", csvFile);
        body = formData;
        headers = { Authorization: token };
      } else {
        body = JSON.stringify(promotionData);
        headers = { "Content-Type": "application/json", Authorization: token };
      }

      const res = await fetch(`${API_URL}/promotions`, {
        method: "POST",
        headers,
        body,
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
      value: "extended warranty",
      label: "📱 Extended Warranty",
      desc: "Give honest feedback to get a 3-month warranty extension (period customizable)",
    },
    {
      value: "discount code",
      label: "🏷️ Discount Coupon",
      desc: "Offer percentage or fixed amount discounts for future purchases",
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
          <div className="bg-white rounded-2xl shadow-xl">
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
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Promotion Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., ₹100 Paytm Cashback Offer"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Promotion Type */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
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
                      <div className="flex-1 flex items-center space-x-3">
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
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe what customers will receive and any terms & conditions..."
                />
                <p className="text-sm text-gray-500">
                  This description will be shown to customers when they view
                  this promotion
                </p>
              </div>

              {/* Provider & Value Amount */}
              {/* <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-1">
                    Provider
                  </label>
                  <select
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-1">
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div> */}

              {/* Code Configuration */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Code Configuration
                </label>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="codeType"
                        value="same"
                        checked={form.codeType === "same"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Coupon code</span>
                    </label>
                  </div>

                  {form.codeType === "same" && (
                    <input
                      type="text"
                      name="codeValue"
                      value={form.codeValue}
                      onChange={handleChange}
                      placeholder="Enter promo code (e.g., SAVE100)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <Link
                  to="/promotions"
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-semibold shadow text-white ${
                    loading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Creating..." : "Create Promotion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
