import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm"; // For tables, strikethrough, lists, etc.
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Button from "../components/base/Button";

export default function PromotionForm() {
  const { id } = useParams(); // If present, it’s edit mode
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState("");
  // const [previewMode, setPreviewMode] = useState(false);

  const [offerType, setOfferType] = useState("extended-warranty");
  const [form, setForm] = useState({
    name: "",
    offerTitle: "",
    warrantyPeriod: "3 months",
    customWarranty: "",
    couponCode: "",
    expiryDate: "",
    termsAndConditions: "",
  });

  // 🧠 Fetch existing promotion if editing
  useEffect(() => {
    if (!id) return;
    const fetchPromotion = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/promotions/${id}`, {
          headers: { Authorization: `${token}` },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch promotion");

        // Populate form
        setForm({
          name: data.name || "",
          offerTitle: data.offerTitle || "",
          warrantyPeriod: data.warrantyPeriod || "3 months",
          customWarranty: data.customWarranty || "",
          couponCode: data.couponCode || "",
          expiryDate: data.expiryDate || "",
          termsAndConditions: data.termsAndConditions || "",
        });

        setOfferType(
          data.type === "discount code" ? "discount-code" : "extended-warranty"
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  // 🔄 Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarrantyPeriodChange = (period) => {
    setForm((prev) => ({
      ...prev,
      warrantyPeriod: period,
      customWarranty: period !== "Custom" ? "" : prev.customWarranty,
    }));
  };

  // 🚀 Create or Update Promotion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.offerTitle || !form.termsAndConditions) {
      setError("Promotion Name, Offer Title, and Terms are required.");
      setLoading(false);
      return;
    }

    let payload = {
      name: form.name,
      offerTitle: form.offerTitle,
      type:
        offerType === "extended-warranty"
          ? "extended warranty"
          : "discount code",
      termsAndConditions: form.termsAndConditions,
    };

    if (offerType === "extended-warranty") {
      if (form.warrantyPeriod === "Custom" && !form.customWarranty) {
        setError("Please specify custom warranty period.");
        setLoading(false);
        return;
      }
      payload.warrantyPeriod =
        form.warrantyPeriod === "Custom"
          ? form.customWarranty
          : form.warrantyPeriod;
    } else {
      if (!form.couponCode) {
        setError("Discount Code is required for this offer type.");
        setLoading(false);
        return;
      }
      payload.couponCode = form.couponCode;
      if (form.expiryDate) payload.expiryDate = form.expiryDate;
    }

    try {
      const token = localStorage.getItem("token");
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/promotions/${id}` : `${API_URL}/promotions`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save promotion");

      alert(id ? "Promotion updated successfully!" : "Promotion created!");
      navigate("/promotions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Loading Screen
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700 text-lg animate-pulse">
          Loading promotion details...
        </div>
      </div>
    );
  }

  // 🧱 Form UI
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? "Edit Promotion" : "Create Promotion"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Name */}
          <Input
            label="Promotion Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="e.g., 3months_EW"
          />

          {/* Offer Title */}
          <Input
            label="Offer Title"
            name="offerTitle"
            value={form.offerTitle}
            onChange={handleInputChange}
            placeholder="Enter Offer Title"
          />

          {/* Offer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Type
            </label>
            <div className="flex space-x-2">
              {[
                { id: "extended-warranty", label: "Extended Warranty" },
                { id: "discount-code", label: "Discount Code" },
              ].map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  onClick={() => setOfferType(t.id)}
                  variant={offerType === t.id ? "primary" : "secondary"}
                  className="flex-1"
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Conditional Fields */}
          {offerType === "extended-warranty" ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Warranty Duration
              </label>
              <div className="flex space-x-2">
                {["3 months", "6 months", "Custom"].map((period) => (
                  <Button
                    key={period}
                    type="button"
                    onClick={() => handleWarrantyPeriodChange(period)}
                    variant={form.warrantyPeriod === period ? "primary" : "secondary"}
                    className="flex-1"
                  >
                    {period}
                  </Button>
                ))}
              </div>
              {form.warrantyPeriod === "Custom" && (
                <Input
                  label="Custom Warranty Period"
                  name="customWarranty"
                  value={form.customWarranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 year"
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Discount Code"
                name="couponCode"
                value={form.couponCode}
                onChange={handleInputChange}
                placeholder="e.g., SAVE10"
              />
              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Terms and Conditions */}
          {/* 
          <div>
            <label
              htmlFor="termsAndConditions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Terms and Conditions
            </label>
            <textarea
              id="termsAndConditions"
              name="termsAndConditions"
              rows="4"
              value={form.termsAndConditions}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter terms with line breaks..."
            ></textarea>
          </div> */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Terms and Conditions
            </label>

            <SimpleMDE
              value={form.termsAndConditions}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, termsAndConditions: value }))
              }
              options={{
                spellChecker: false,
                autofocus: true,
                autosave: {
                  enabled: false,
                },
                placeholder:
                  offerType === "extended-warranty"
                    ? "Enter your extended warranty terms and conditions..."
                    : "Enter your coupon code terms and conditions...",
                renderingConfig: {
                  singleLineBreaks: false,
                  codeSyntaxHighlighting: true,
                },
                toolbar: [
                  "bold",
                  "italic",
                  "heading",
                  "|",
                  "quote",
                  "unordered-list",
                  "ordered-list",
                  "|",
                  "link",
                  "code",
                  "preview",
                  "guide",
                ],
                status: false,
                minHeight: "200px",
              }}
            />
            <div>press Shift+Enter to get a new line</div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            fullWidth
            className="w-full"
          >
            {id ? "Update Promotion" : "Create Promotion"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// 🔹 Reusable input field
function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
