import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from "../config/api";
export default function EditPromotion() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    provider: "",
    deliveryType: "auto",
    status: "active",
    value: { amount: "", currency: "INR" }
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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

      setForm({
        name: data.name || "",
        type: data.type || "",
        description: data.description || "",
        provider: data.provider || "",
        deliveryType: data.deliveryType || "auto",
        status: data.status || "active",
        value: data.value || { amount: "", currency: "INR" }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const promotionData = {
        name: form.name,
        type: form.type,
        description: form.description,
        provider: form.provider || undefined,
        deliveryType: form.deliveryType,
        status: form.status,
        value: form.value.amount ? form.value : undefined
      };

      const res = await fetch(`${API_URL}/promotions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(promotionData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update promotion");

      navigate("/promotions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith('value.')) {
      const valueKey = name.split('.')[1];
      setForm({
        ...form,
        value: { ...form.value, [valueKey]: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading promotion...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            to="/promotions"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Promotions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Promotion</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promotion Name *
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g., ₹100 Paytm Cashback"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promotion Type *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="giftcard">Gift Card</option>
                <option value="discount code">Discount Code</option>
                <option value="extended warranty">Extended Warranty</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe what customers will receive..."
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider (Optional)
              </label>
              <input
                name="provider"
                type="text"
                placeholder="e.g., Paytm, PhonePe, Amazon"
                value={form.provider}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Optional)
                </label>
                <input
                  name="value.amount"
                  type="number"
                  placeholder="100"
                  value={form.value?.amount || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="value.currency"
                  value={form.value?.currency || "INR"}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Type
              </label>
              <select
                name="deliveryType"
                value={form.deliveryType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="auto">Automatic Delivery</option>
                <option value="manual">Manual Delivery</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Promotion"}
              </button>
              <Link
                to="/promotions"
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
