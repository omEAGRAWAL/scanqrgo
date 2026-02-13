import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { API_URL } from "../config/api";
import Button from "../components/base/Button";
import FormBuilder, { DEFAULT_FORM_FIELDS } from "../components/FormBuilder";
import PublicCampaignForm from "./PublicCampaignForm";

export default function CampaignForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // If present, it's edit mode
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);

    const [offerType, setOfferType] = useState("extended-warranty");
    const [form, setForm] = useState({
        name: "",
        category: "promotion",
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
        formFields: [...DEFAULT_FORM_FIELDS],
        // Inline promotion fields
        inlinePromotion: {
            offerTitle: "",
            type: "extended warranty",
            warrantyPeriod: "3 months",
            customWarranty: "",
            couponCode: "",
            offering: "",
            expiryDate: "",
            termsAndConditions: "",
        },
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts();
        if (isEditMode) {
            fetchCampaign();
        }
    }, [id]);

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

    async function fetchCampaign() {
        try {
            const res = await fetch(`${API_URL}/campaigns/${id}`, {
                headers: { Authorization: token },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");

            // Populate form with existing data
            setForm({
                name: data.name || "",
                category: data.category || "promotion",
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
                formFields: data.formFields?.length
                    ? data.formFields
                    : [...DEFAULT_FORM_FIELDS],
                // Load inline promotion or convert from referenced promotion
                inlinePromotion: data.inlinePromotion || {
                    offerTitle: data.promotion?.offerTitle || "",
                    type: data.promotion?.type || "extended warranty",
                    warrantyPeriod: data.promotion?.warrantyPeriod || "3 months",
                    customWarranty: "",
                    couponCode: data.promotion?.couponCode || "",
                    offering: data.promotion?.offering || "",
                    expiryDate: data.promotion?.expiryDate || "",
                    termsAndConditions: data.promotion?.termsAndConditions || "",
                },
            });

            // Set offer type based on promotion type
            const promoType =
                data.inlinePromotion?.type || data.promotion?.type || "extended warranty";
            setOfferType(
                promoType === "discount code" ? "discount-code" : promoType === "custom" ? "custom" : "extended-warranty"
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setFetchLoading(false);
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
        } else if (name.startsWith("inlinePromotion.")) {
            const promoKey = name.split(".")[1];
            setForm({
                ...form,
                inlinePromotion: { ...form.inlinePromotion, [promoKey]: value },
            });
        } else {
            setForm({
                ...form,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    }

    function handleWarrantyPeriodChange(period) {
        setForm((prev) => ({
            ...prev,
            inlinePromotion: {
                ...prev.inlinePromotion,
                warrantyPeriod: period,
                customWarranty: period !== "Custom" ? "" : prev.inlinePromotion.customWarranty,
            },
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate inline promotion
        if (!form.inlinePromotion.offerTitle || !form.inlinePromotion.termsAndConditions) {
            setError("Offer Title and Terms & Conditions are required.");
            setLoading(false);
            return;
        }

        if (offerType === "extended-warranty") {
            if (
                form.inlinePromotion.warrantyPeriod === "Custom" &&
                !form.inlinePromotion.customWarranty
            ) {
                setError("Please specify custom warranty period.");
                setLoading(false);
                return;
            }
        } else if (offerType === "discount-code") {
            if (!form.inlinePromotion.couponCode) {
                setError("Discount Code is required for this offer type.");
                setLoading(false);
                return;
            }
        } else if (offerType === "custom") {
            if (!form.inlinePromotion.offering) {
                setError("Offering is required for custom offer type.");
                setLoading(false);
                return;
            }
        }

        try {
            // Prepare inline promotion data
            const inlinePromotion = {
                offerTitle: form.inlinePromotion.offerTitle,
                type: offerType === "extended-warranty" ? "extended warranty" : offerType === "discount-code" ? "discount code" : "custom",
                termsAndConditions: form.inlinePromotion.termsAndConditions,
            };

            if (offerType === "extended-warranty") {
                inlinePromotion.warrantyPeriod =
                    form.inlinePromotion.warrantyPeriod === "Custom"
                        ? form.inlinePromotion.customWarranty
                        : form.inlinePromotion.warrantyPeriod;
            } else if (offerType === "discount-code") {
                inlinePromotion.couponCode = form.inlinePromotion.couponCode;
                if (form.inlinePromotion.expiryDate) {
                    inlinePromotion.expiryDate = form.inlinePromotion.expiryDate;
                }
            } else if (offerType === "custom") {
                inlinePromotion.offering = form.inlinePromotion.offering;
            }

            const campaignData = {
                name: form.name,
                category: form.category,
                products: form.products,
                inlinePromotion, // Send inline promotion data
                ...(form.category === "review" && {
                    reviewMinimumLength: form.reviewMinimumLength,
                    enableSmartFunnel: form.enableSmartFunnel,
                }),
                customization: form.customization,
                formFields: form.formFields,
            };

            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode
                ? `${API_URL}/campaigns/${id}`
                : `${API_URL}/campaigns`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(campaignData),
            });

            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || `Failed to ${isEditMode ? "update" : "create"} campaign`);

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
                <div className="text-lg animate-pulse">Loading campaign...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <Link
                    to="/campaigns"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                >
                    <span className="mr-2">←</span>
                    Back to Campaigns
                </Link>

                {/* Two Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form (2/3 width) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {isEditMode ? "Edit Campaign" : "Create New Campaign"}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {isEditMode
                                        ? "Update your campaign settings and promotion details"
                                        : "Set up a campaign with an embedded promotion offer"}
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

                                {/* Products Selection */}
                                <div className="space-y-4">
                                    <label className="text-lg font-semibold text-gray-800 block">
                                        Select Products *
                                    </label>
                                    {products.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                                            <p className="text-gray-500 mb-4">No products found</p>
                                            <Link
                                                to="/products/new"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Create your first product
                                            </Link>
                                        </div>
                                    ) : (
                                        <Select
                                            isMulti
                                            name="products"
                                            options={products.map((p) => ({
                                                value: p._id,
                                                label: `${p.name}`,
                                            }))}
                                            value={form.products.map((id) => {
                                                const product = products.find((p) => p._id === id);
                                                return product
                                                    ? {
                                                        value: product._id,
                                                        label: `${product.name}`,
                                                    }
                                                    : null;
                                            })}
                                            onChange={(selected) =>
                                                setForm({
                                                    ...form,
                                                    products: selected.map((s) => s.value),
                                                })
                                            }
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            placeholder="Choose products..."
                                        />
                                    )}
                                </div>

                                {/* Inline Promotion Section */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6 border-2 border-purple-200">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">🎁</span>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Promotion Details
                                        </h2>
                                    </div>

                                    {/* Offer Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Offer Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="inlinePromotion.offerTitle"
                                            value={form.inlinePromotion.offerTitle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="e.g., Get 3 Months Extended Warranty"
                                            required
                                        />
                                    </div>

                                    {/* Offer Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Offer Type *
                                        </label>
                                        <div className="flex space-x-2">
                                            {[
                                                { id: "extended-warranty", label: "Extended Warranty" },
                                                { id: "discount-code", label: "Discount Code" },
                                                { id: "custom", label: "Custom" },
                                            ].map((t) => (
                                                <Button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setOfferType(t.id);
                                                        setForm({
                                                            ...form,
                                                            inlinePromotion: {
                                                                ...form.inlinePromotion,
                                                                type:
                                                                    t.id === "extended-warranty"
                                                                        ? "extended warranty"
                                                                        : t.id === "discount-code"
                                                                            ? "discount code"
                                                                            : "custom",
                                                            },
                                                        });
                                                    }}
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
                                                Warranty Duration *
                                            </label>
                                            <div className="flex space-x-2">
                                                {["3 months", "6 months", "Custom"].map((period) => (
                                                    <Button
                                                        key={period}
                                                        type="button"
                                                        onClick={() => handleWarrantyPeriodChange(period)}
                                                        variant={
                                                            form.inlinePromotion.warrantyPeriod === period
                                                                ? "primary"
                                                                : "secondary"
                                                        }
                                                        className="flex-1"
                                                    >
                                                        {period}
                                                    </Button>
                                                ))}
                                            </div>
                                            {form.inlinePromotion.warrantyPeriod === "Custom" && (
                                                <input
                                                    type="text"
                                                    name="inlinePromotion.customWarranty"
                                                    value={form.inlinePromotion.customWarranty}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="e.g., 1 year"
                                                />
                                            )}
                                        </div>
                                    ) : offerType === "discount-code" ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Discount Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="inlinePromotion.couponCode"
                                                    value={form.inlinePromotion.couponCode}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="e.g., SAVE10"
                                                    required={offerType === "discount-code"}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="inlinePromotion.expiryDate"
                                                    value={form.inlinePromotion.expiryDate}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Offering *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="inlinePromotion.offering"
                                                    value={form.inlinePromotion.offering}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="e.g., Free consultation, Gift voucher, etc."
                                                    required={offerType === "custom"}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Terms and Conditions */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Terms and Conditions *
                                        </label>
                                        <SimpleMDE
                                            value={form.inlinePromotion.termsAndConditions}
                                            onChange={(value) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    inlinePromotion: {
                                                        ...prev.inlinePromotion,
                                                        termsAndConditions: value,
                                                    },
                                                }))
                                            }
                                            options={{
                                                spellChecker: false,
                                                autofocus: false,
                                                autosave: { enabled: false },
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
                                        <div className="text-xs text-gray-500">
                                            Press Shift+Enter to get a new line
                                        </div>
                                    </div>
                                </div>

                                {/* Form Builder */}
                                <div className="space-y-3">
                                    <label className="text-lg font-semibold text-gray-800 block">
                                        Form Fields
                                    </label>
                                    <p className="text-gray-500 text-sm">
                                        Customize the fields customers see when filling out the
                                        campaign form. Drag to reorder, add or remove fields.
                                    </p>
                                    <FormBuilder
                                        fields={form.formFields}
                                        onChange={(newFields) =>
                                            setForm({ ...form, formFields: newFields })
                                        }
                                    />
                                </div>

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
                                                placeholder="Add a custom message for your customers..."
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
                                    <Button
                                        type="submit"
                                        disabled={loading || form.products.length === 0}
                                        loading={loading}
                                        variant="primary"
                                        className="px-8 shadow-lg"
                                    >
                                        {isEditMode ? "Update Campaign" : "Create Campaign"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Live Preview (1/3 width) */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="transform scale-75 origin-top">
                            <PublicCampaignForm
                                previewMode={true}
                                previewData={{
                                    ...form,
                                    products: products.filter(p => form.products.includes(p._id)),
                                    seller: { logoUrl: "" },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
