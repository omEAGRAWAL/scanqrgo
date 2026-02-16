import React, { useState, useEffect, useCallback, useMemo } from "react";
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
        callbackUrls: [],
    });

    const token = localStorage.getItem("token");

    // Memoize SimpleMDE props to prevent re-renders
    const handleTCChange = useCallback((value) => {
        setForm((prev) => ({
            ...prev,
            inlinePromotion: {
                ...prev.inlinePromotion,
                termsAndConditions: value,
            },
        }));
    }, []);

    const simpleMDEOptions = useMemo(() => ({
        spellChecker: false,
        autofocus: false,
        autosave: { enabled: false },
        placeholder: "Enter terms and conditions (Markdown supported)...",
        renderingConfig: { singleLineBreaks: false, codeSyntaxHighlighting: true },
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "preview", "guide"],
        status: false,
        minHeight: "120px",
    }), []);

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
            const existingPromo = data.inlinePromotion || data.promotion || {};
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
                inlinePromotion: {
                    offerTitle: existingPromo.offerTitle || "",
                    type: existingPromo.type || "extended warranty",
                    warrantyPeriod: existingPromo.warrantyPeriod || "3 months",
                    customWarranty: "",
                    couponCode: existingPromo.couponCode || "",
                    offering: existingPromo.offering || "",
                    expiryDate: existingPromo.expiryDate || "",
                    termsAndConditions: existingPromo.termsAndConditions || "",
                },
                callbackUrls: (data.callbackUrls || []).map((cb, i) => ({
                    name: cb.name || "",
                    url: cb.url || "",
                    method: cb.method || "POST",
                    headers: cb.headers || {},
                    body: cb.body || "",
                    order: cb.order ?? i,
                })),
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
                inlinePromotion,
                ...(form.category === "review" && {
                    reviewMinimumLength: form.reviewMinimumLength,
                    enableSmartFunnel: form.enableSmartFunnel,
                }),
                customization: form.customization,
                formFields: form.formFields,
                callbackUrls: form.callbackUrls,
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
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link
                        to="/campaigns"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {isEditMode ? "Edit Campaign" : "New Campaign"}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/campaigns"
                        className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || form.products.length === 0}
                        loading={loading}
                        variant="primary"
                        className="px-5 py-1.5 text-sm shadow-sm"
                    >
                        {isEditMode ? "Update" : "Create Campaign"}
                    </Button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex">
                {/* Left Column - Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6 pb-20" style={{ maxHeight: "calc(100vh - 53px)" }}>
                    <div className="max-w-2xl mx-auto space-y-5">

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                {error}
                            </div>
                        )}

                        {/* Section 1: Campaign Basics */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Campaign Basics</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Summer Sale 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
                                    {products.length === 0 ? (
                                        <div className="text-center py-4 bg-gray-50 rounded-lg text-sm">
                                            <p className="text-gray-500 mb-1">No products found</p>
                                            <Link to="/products/new" className="text-blue-600 hover:underline text-xs">
                                                Create your first product →
                                            </Link>
                                        </div>
                                    ) : (
                                        <Select
                                            isMulti
                                            name="products"
                                            options={products.map((p) => ({ value: p._id, label: p.name }))}
                                            value={form.products.map((pid) => {
                                                const product = products.find((p) => p._id === pid);
                                                return product ? { value: product._id, label: product.name } : null;
                                            }).filter(Boolean)}
                                            onChange={(selected) => setForm({ ...form, products: selected.map((s) => s.value) })}
                                            className="react-select-container text-sm"
                                            classNamePrefix="react-select"
                                            placeholder="Choose products..."
                                            styles={{
                                                control: (base) => ({ ...base, minHeight: '36px' }),
                                                valueContainer: (base) => ({ ...base, padding: '0 8px' }),
                                                input: (base) => ({ ...base, margin: 0, padding: 0 }),
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Promotion */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <span>🎁</span> Promotion Details
                                </h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                                    <input
                                        type="text"
                                        name="inlinePromotion.offerTitle"
                                        value={form.inlinePromotion.offerTitle}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Get 3 Months Extended Warranty"
                                        required
                                    />
                                </div>

                                {/* Offer Type Tabs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Offer Type</label>
                                    <div className="inline-flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                                        {[
                                            { id: "extended-warranty", label: "Warranty", icon: "🛡️" },
                                            { id: "discount-code", label: "Discount", icon: "🏷️" },
                                            { id: "custom", label: "Custom", icon: "✨" },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                    setOfferType(t.id);
                                                    setForm({
                                                        ...form,
                                                        inlinePromotion: {
                                                            ...form.inlinePromotion,
                                                            type: t.id === "extended-warranty" ? "extended warranty" : t.id === "discount-code" ? "discount code" : "custom",
                                                        },
                                                    });
                                                }}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${offerType === t.id
                                                    ? "bg-white text-gray-900 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700"
                                                    }`}
                                            >
                                                {t.icon} {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conditional Fields */}
                                {offerType === "extended-warranty" ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Warranty Duration</label>
                                        <div className="flex gap-2">
                                            {["3 months", "6 months", "Custom"].map((period) => (
                                                <button
                                                    key={period}
                                                    type="button"
                                                    onClick={() => handleWarrantyPeriodChange(period)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.inlinePromotion.warrantyPeriod === period
                                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {period}
                                                </button>
                                            ))}
                                        </div>
                                        {form.inlinePromotion.warrantyPeriod === "Custom" && (
                                            <input
                                                type="text"
                                                name="inlinePromotion.customWarranty"
                                                value={form.inlinePromotion.customWarranty}
                                                onChange={handleChange}
                                                className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., 1 year"
                                            />
                                        )}
                                    </div>
                                ) : offerType === "discount-code" ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                                            <input
                                                type="text"
                                                name="inlinePromotion.couponCode"
                                                value={form.inlinePromotion.couponCode}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                                placeholder="e.g., SAVE10"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                            <input
                                                type="date"
                                                name="inlinePromotion.expiryDate"
                                                value={form.inlinePromotion.expiryDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Offering</label>
                                        <input
                                            type="text"
                                            name="inlinePromotion.offering"
                                            value={form.inlinePromotion.offering}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Free consultation, Gift voucher, etc."
                                            required
                                        />
                                    </div>
                                )}

                                {/* Terms and Conditions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                                    <SimpleMDE
                                        value={form.inlinePromotion.termsAndConditions}
                                        onChange={handleTCChange}
                                        options={simpleMDEOptions}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Form Fields */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <span>📋</span> Form Fields
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">Customize what customers fill out</p>
                            </div>
                            <div className="p-5">
                                <FormBuilder
                                    fields={form.formFields}
                                    onChange={(newFields) => setForm({ ...form, formFields: newFields })}
                                />
                            </div>
                        </section>

                        {/* Section 4: Customization */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <span>🎨</span> Customization
                                </h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                name="customization.primaryColor"
                                                value={form.customization.primaryColor}
                                                onChange={handleChange}
                                                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={form.customization.primaryColor}
                                                onChange={(e) => setForm({ ...form, customization: { ...form.customization, primaryColor: e.target.value } })}
                                                className="flex-1 px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                                        <select
                                            name="customization.backgroundStyle"
                                            value={form.customization.backgroundStyle}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="solid">Solid Color</option>
                                            <option value="gradient">Gradient</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message</label>
                                    <textarea
                                        name="customization.customMessage"
                                        value={form.customization.customMessage}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add a custom message for your customers..."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Callback URLs */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <span>🔗</span> Callback URLs
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">Execute API calls after form submission</p>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Available Variables Helper */}
                                {form.callbackUrls.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-blue-700 mb-1.5">Available Template Variables</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {form.formFields.map((f) => (
                                                <span key={f.id} className="inline-flex items-center px-2 py-0.5 bg-white border border-blue-200 rounded text-xs font-mono text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors" title={`Click to copy {{${f.id}}}`} onClick={() => navigator.clipboard.writeText(`{{${f.id}}}`)}>{'{{' + f.id + '}}'}</span>
                                            ))}
                                            {form.callbackUrls.length > 1 && (
                                                <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-xs font-mono text-amber-700">{'{{'}<span className="text-amber-500">$response[0].path</span>{'}}'}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Callback List */}
                                {form.callbackUrls.map((cb, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Callback Header */}
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                                            <span className="text-xs text-gray-400 font-bold w-5">#{idx + 1}</span>
                                            <input
                                                type="text"
                                                value={cb.name}
                                                onChange={(e) => {
                                                    const updated = [...form.callbackUrls];
                                                    updated[idx] = { ...updated[idx], name: e.target.value };
                                                    setForm({ ...form, callbackUrls: updated });
                                                }}
                                                className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                placeholder="Callback name (e.g., Create User)"
                                            />
                                            <div className="flex items-center gap-1">
                                                {idx > 0 && (
                                                    <button type="button" onClick={() => {
                                                        const updated = [...form.callbackUrls];
                                                        [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                        updated.forEach((c, i) => c.order = i);
                                                        setForm({ ...form, callbackUrls: updated });
                                                    }} className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title="Move up">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                    </button>
                                                )}
                                                {idx < form.callbackUrls.length - 1 && (
                                                    <button type="button" onClick={() => {
                                                        const updated = [...form.callbackUrls];
                                                        [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                                        updated.forEach((c, i) => c.order = i);
                                                        setForm({ ...form, callbackUrls: updated });
                                                    }} className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title="Move down">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => {
                                                    const updated = form.callbackUrls.filter((_, i) => i !== idx);
                                                    updated.forEach((c, i) => c.order = i);
                                                    setForm({ ...form, callbackUrls: updated });
                                                }} className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50" title="Remove">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Callback Body */}
                                        <div className="p-4 space-y-3">
                                            {/* Method + URL row */}
                                            <div className="flex gap-2">
                                                <select
                                                    value={cb.method}
                                                    onChange={(e) => {
                                                        const updated = [...form.callbackUrls];
                                                        updated[idx] = { ...updated[idx], method: e.target.value };
                                                        setForm({ ...form, callbackUrls: updated });
                                                    }}
                                                    className="w-28 px-2 py-2 text-sm border border-gray-300 rounded-lg font-mono bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={cb.url}
                                                    onChange={(e) => {
                                                        const updated = [...form.callbackUrls];
                                                        updated[idx] = { ...updated[idx], url: e.target.value };
                                                        setForm({ ...form, callbackUrls: updated });
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="https://api.example.com/endpoint"
                                                />
                                            </div>

                                            {/* Headers */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-xs font-medium text-gray-500">Headers</label>
                                                    <button type="button" onClick={() => {
                                                        const updated = [...form.callbackUrls];
                                                        const newHeaders = { ...updated[idx].headers, "": "" };
                                                        // Use a unique key for empty header
                                                        const emptyCount = Object.keys(newHeaders).filter(k => k.startsWith("header")).length;
                                                        const key = `header${emptyCount}`;
                                                        newHeaders[key] = "";
                                                        delete newHeaders[""];
                                                        updated[idx] = { ...updated[idx], headers: newHeaders };
                                                        setForm({ ...form, callbackUrls: updated });
                                                    }} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                                        + Add Header
                                                    </button>
                                                </div>
                                                {Object.entries(cb.headers || {}).map(([hKey, hVal], hIdx) => (
                                                    <div key={hIdx} className="flex gap-2 mb-1.5">
                                                        <input
                                                            type="text"
                                                            value={hKey}
                                                            onChange={(e) => {
                                                                const updated = [...form.callbackUrls];
                                                                const entries = Object.entries(updated[idx].headers);
                                                                entries[hIdx] = [e.target.value, entries[hIdx][1]];
                                                                updated[idx] = { ...updated[idx], headers: Object.fromEntries(entries) };
                                                                setForm({ ...form, callbackUrls: updated });
                                                            }}
                                                            className="w-2/5 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Header name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={hVal}
                                                            onChange={(e) => {
                                                                const updated = [...form.callbackUrls];
                                                                const entries = Object.entries(updated[idx].headers);
                                                                entries[hIdx] = [entries[hIdx][0], e.target.value];
                                                                updated[idx] = { ...updated[idx], headers: Object.fromEntries(entries) };
                                                                setForm({ ...form, callbackUrls: updated });
                                                            }}
                                                            className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Header value (supports {{variables}})"
                                                        />
                                                        <button type="button" onClick={() => {
                                                            const updated = [...form.callbackUrls];
                                                            const entries = Object.entries(updated[idx].headers);
                                                            entries.splice(hIdx, 1);
                                                            updated[idx] = { ...updated[idx], headers: Object.fromEntries(entries) };
                                                            setForm({ ...form, callbackUrls: updated });
                                                        }} className="p-1 text-gray-400 hover:text-red-500 rounded">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Body */}
                                            {cb.method !== "GET" && (
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Request Body (JSON)</label>
                                                    <textarea
                                                        value={cb.body}
                                                        onChange={(e) => {
                                                            const updated = [...form.callbackUrls];
                                                            updated[idx] = { ...updated[idx], body: e.target.value };
                                                            setForm({ ...form, callbackUrls: updated });
                                                        }}
                                                        rows={4}
                                                        className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                        placeholder={'{\n  "name": "{{customerName}}",\n  "email": "{{email}}"\n}'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Callback Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm({
                                            ...form,
                                            callbackUrls: [
                                                ...form.callbackUrls,
                                                {
                                                    name: "",
                                                    url: "",
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: "",
                                                    order: form.callbackUrls.length,
                                                },
                                            ],
                                        });
                                    }}
                                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all font-medium text-sm flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Callback
                                </button>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Right Column - Fixed Preview */}
                <div
                    className="hidden lg:block border-l border-gray-200 bg-gray-100/50"
                    style={{ width: "420px", height: "calc(100vh - 53px)", position: "sticky", top: "53px" }}
                >
                    <div className="h-full overflow-y-auto">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <span>👁</span> Live Preview
                                </h3>
                                <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Updates in real-time</span>
                            </div>
                            <div className="transform scale-[0.82] origin-top">
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
        </div>
    );
}
