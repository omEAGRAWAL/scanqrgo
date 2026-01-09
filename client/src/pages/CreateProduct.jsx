import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";
import * as XLSX from "xlsx";
import Button from "../components/base/Button";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    amazonAsin: "",
    flipkartFsn: "",
    imageurl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  // 🔹 Handle Excel Upload
  const handleFileUpload = async (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        setUploading(true);
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        const [header, ...body] = rows;
        if (
          !header ||
          header[0] !== "name" ||
          header[1] !== "flipkart-fsn" ||
          header[2] !== "amazon-asin" ||
          header[3] !== "imageurl"
        ) {
          setError(
            "Invalid Excel headers. Must be: name, flipkart-fsn, amazon-asin, imageurl."
          );
          setUploading(false);
          return;
        }

        const products = body
          .filter((r) => r[0] || r[1] || r[2])
          .map(([name, flipkartFsn, amazonAsin, imageurl]) => ({
            name,
            flipkartFsn,
            amazonAsin,
            imageurl,
          }));

        const allValid = products.every(
          (p) =>
            p.name &&
            ((p.flipkartFsn && p.flipkartFsn.length >= 5) ||
              (p.amazonAsin && p.amazonAsin.length === 10))
        );
        if (!allValid) {
          setError(
            "Each row must have a product name and at least one valid Flipkart FSN or Amazon ASIN."
          );
          setUploading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/products/bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ products }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Bulk upload failed.");
        alert("✅ Bulk upload successful!");
        navigate("/products");
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 🔹 Download sample Excel file from assets
  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "/assets/sample_products.xlsx"; // ensure file is placed in /public/assets/
    link.download = "sample_products.xlsx";
    link.click();
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      setForm((prev) => ({ ...prev, imageurl: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function validateMarketplaceIds() {
    if (!form.amazonAsin && !form.flipkartFsn) {
      setError(
        "Provide at least one marketplace ID (Amazon ASIN or Flipkart FSN)."
      );
      return false;
    }
    if (form.amazonAsin && form.amazonAsin.length !== 10) {
      setError("Amazon ASIN must be exactly 10 characters.");
      return false;
    }
    if (form.flipkartFsn && form.flipkartFsn.length < 5) {
      setError("Flipkart FSN must be at least 5 characters.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validateMarketplaceIds()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: form.name,
        amazonAsin: form.amazonAsin || undefined,
        flipkartFsn: form.flipkartFsn || undefined,
        imageurl: form.imageurl || undefined,
      };

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/products" className="text-blue-600 hover:underline">
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Product
          </h1>

          {/* Bulk Upload Section */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">
              📦 Bulk Product Upload
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Excel headers must be:{" "}
              <b>name, flipkart-fsn, amazon-asin, imageurl</b>.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full sm:w-auto border border-gray-300 rounded-md p-2 text-sm"
                disabled={uploading}
              />

              <Button
                onClick={handleDownloadSample}
                type="button"
                variant="success"
                size="sm"
                className="whitespace-nowrap"
              >
                ⬇ Download Sample Excel
              </Button>
            </div>

            {fileName && (
              <p className="my-2 text-gray-700 text-sm">
                📂 Selected: {fileName}
              </p>
            )}
            {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
            {uploading && (
              <div className="text-gray-500 mt-2 text-sm">Uploading...</div>
            )}
          </div>

          {/* Single Product Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amazon ASIN
                </label>
                <input
                  name="amazonAsin"
                  type="text"
                  placeholder="10-char ASIN (e.g. B08XXXXX)"
                  value={form.amazonAsin}
                  maxLength={10}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional — must be exactly 10 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flipkart FSN
                </label>
                <input
                  name="flipkartFsn"
                  type="text"
                  placeholder="e.g. ACCEYZTGF..."
                  value={form.flipkartFsn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional — must be at least 5 characters
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>

              <input
                //add border to input

                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className=" border border-gray-300 "
              />
              {uploading && (
                <p className="text-gray-500 mt-2 text-sm">Uploading image...</p>
              )}
              {form.imageurl && (
                <img
                  src={form.imageurl}
                  alt="Product Preview"
                  className="mt-4 h-32 object-contain rounded border"
                />
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || uploading}
                loading={loading}
                variant="primary"
                className="flex-1"
              >
                Create Product
              </Button>
              <Link
                to="/products"
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 text-center transition font-semibold flex items-center justify-center"
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
