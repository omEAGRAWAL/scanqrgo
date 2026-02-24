import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { API_URL } from "../config/api";
import Button from "../components/base/Button";
import FormBuilder, { DEFAULT_FORM_FIELDS } from "../components/FormBuilder";
import PublicCampaignForm from "./PublicCampaignForm";

/* ─── Global styles injected once ─── */
const cfStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .cf-root * { box-sizing: border-box; }
  .cf-root { font-family: 'Inter', sans-serif; }

  .cf-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    overflow: visible;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
  }
  .cf-card:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.08); }

  .cf-card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cf-section-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: #dbeafe;
    color: #2563eb;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }

  .cf-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }

  .cf-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    color: #111827;
    background: #fff;
    font-family: 'Inter', sans-serif;
  }
  .cf-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .cf-input::placeholder { color: #9ca3af; }

  .cf-select {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 10px;
    outline: none;
    color: #111827;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
    font-family: 'Inter', sans-serif;
  }
  .cf-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .cf-select option { padding: 8px; font-size: 14px; }

  .cf-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    border-radius: 100px;
    font-size: 13px; font-weight: 600;
    border: 1.5px solid #d1d5db;
    cursor: pointer;
    transition: all 0.18s;
    color: #4b5563;
    background: #fff;
  }
  .cf-pill:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
  .cf-pill.active { background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,0.3); }

  .cf-pill-sm {
    padding: 5px 12px;
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    border: 1.5px solid #d1d5db;
    cursor: pointer;
    transition: all 0.18s;
    color: #4b5563;
    background: #fff;
  }
  .cf-pill-sm:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
  .cf-pill-sm.active { background: #dbeafe; color: #2563eb; border-color: #93c5fd; }

  .cf-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px;
    background: #2563eb;
    color: #fff;
    font-size: 14px; font-weight: 700;
    border: none; border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(37,99,235,0.3);
    font-family: 'Inter', sans-serif;
  }
  .cf-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 16px rgba(37,99,235,0.45); transform: translateY(-1px); }
  .cf-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .cf-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 16px;
    background: transparent;
    color: #6b7280;
    font-size: 14px; font-weight: 500;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'Inter', sans-serif;
  }
  .cf-btn-ghost:hover { color: #111827; border-color: #9ca3af; background: #f9fafb; }

  .cf-dashed-btn {
    width: 100%;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 12px;
    background: transparent;
    color: #6b7280;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Inter', sans-serif;
  }
  .cf-dashed-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

  .cf-cb-card {
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  .cf-cb-card:hover { border-color: #bfdbfe; }

  .cf-var-chip {
    display: inline-flex; align-items: center;
    padding: 3px 10px;
    background: #fff;
    border: 1px solid #bfdbfe;
    border-radius: 100px;
    font-size: 11px; font-weight: 600;
    color: #2563eb; font-family: monospace;
    cursor: pointer; transition: all 0.15s;
  }
  .cf-var-chip:hover { background: #dbeafe; }

  .cf-mono { font-family: 'SFMono-Regular', 'Fira Code', monospace; font-size: 12px; }

  /* React-select overrides */
  .cf-rs .react-select__control {
    border: 1.5px solid #d1d5db !important;
    border-radius: 10px !important;
    min-height: 42px !important;
    box-shadow: none !important;
    font-size: 14px;
  }
  .cf-rs .react-select__control--is-focused {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important;
  }
  .cf-rs .react-select__placeholder { color: #9ca3af; font-size: 14px; }
  .cf-rs .react-select__multi-value {
    background: #dbeafe; border-radius: 6px;
  }
  .cf-rs .react-select__multi-value__label { color: #1d4ed8; font-weight: 600; font-size: 12px; }
  .cf-rs .react-select__multi-value__remove { color: #3b82f6; }
  .cf-rs .react-select__multi-value__remove:hover { background: #bfdbfe; color: #1d4ed8; }
  .cf-rs .react-select__menu { border-radius: 12px; border: 1.5px solid #e5e7eb; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
  .cf-rs .react-select__option--is-focused { background: #eff6ff; color: #1d4ed8; }
  .cf-rs .react-select__option--is-selected { background: #2563eb; color: #fff; }

  .cf-error {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px;
    background: #fef2f2; border: 1.5px solid #fca5a5;
    border-radius: 10px; color: #dc2626; font-size: 13px;
    margin-bottom: 16px;
  }

  .cf-badge {
    font-size: 10px; font-weight: 700;
    padding: 2px 8px; border-radius: 100px;
    letter-spacing: 0.05em; text-transform: uppercase;
  }

  .cf-preview-banner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    background: #f8faff;
    border-bottom: 1px solid #e5e7eb;
  }
`;

/* ─── Section header component ─── */
function SectionHeader({ icon, title, subtitle }) {
    return (
        <div className="cf-card-header">
            <div className="cf-section-icon">{icon}</div>
            <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#090e1a" }}>{title}</div>
                {subtitle && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{subtitle}</div>}
            </div>
        </div>
    );
}

/* ─── Main export ─── */
export default function CampaignForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [copied, setCopied] = useState(null);
    const [offerType, setOfferType] = useState("extended-warranty");

    const [form, setForm] = useState({
        name: "",
        category: "promotion",
        products: [],
        reviewMinimumLength: 10,
        enableSmartFunnel: false,
        promotionSettings: { codeType: "same", codeValue: "", deliveryType: "auto", maxRedemptions: "" },
        customization: { primaryColor: "#2563eb", customMessage: "", backgroundStyle: "solid" },
        formFields: [...DEFAULT_FORM_FIELDS],
        inlinePromotion: {
            offerTitle: "", type: "extended warranty",
            warrantyPeriod: "3 months", customWarranty: "",
            couponCode: "", offering: "", expiryDate: "", termsAndConditions: "",
        },
        callbackUrls: [],
    });

    const token = localStorage.getItem("token");

    const handleTCChange = useCallback((value) => {
        setForm((prev) => ({ ...prev, inlinePromotion: { ...prev.inlinePromotion, termsAndConditions: value } }));
    }, []);

    const simpleMDEOptions = useMemo(() => ({
        spellChecker: false, autofocus: false,
        autosave: { enabled: false },
        placeholder: "Enter terms and conditions (Markdown supported)...",
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "preview"],
        status: false, minHeight: "120px",
    }), []);

    useEffect(() => {
        fetchProducts();
        if (isEditMode) fetchCampaign();
    }, [id]);

    async function fetchProducts() {
        try {
            const res = await fetch(`${API_URL}/products`, { headers: { Authorization: token } });
            const data = await res.json();
            if (res.ok) setProducts(data.products || []);
        } catch (err) { console.error("Failed to fetch products:", err); }
    }

    async function fetchCampaign() {
        try {
            const res = await fetch(`${API_URL}/campaigns/${id}`, { headers: { Authorization: token } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch campaign");
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
                    primaryColor: data.customization?.primaryColor || "#2563eb",
                    customMessage: data.customization?.customMessage || "",
                    backgroundStyle: data.customization?.backgroundStyle || "solid",
                },
                formFields: data.formFields?.length ? data.formFields : [...DEFAULT_FORM_FIELDS],
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
                    name: cb.name || "", url: cb.url || "", method: cb.method || "POST",
                    headers: cb.headers || {}, body: cb.body || "", order: cb.order ?? i,
                })),
            });
            const promoType = data.inlinePromotion?.type || data.promotion?.type || "extended warranty";
            setOfferType(promoType === "discount code" ? "discount-code" : promoType === "custom" ? "custom" : "extended-warranty");
        } catch (err) { setError(err.message); }
        finally { setFetchLoading(false); }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("promotionSettings.")) {
            setForm((p) => ({ ...p, promotionSettings: { ...p.promotionSettings, [name.split(".")[1]]: value } }));
        } else if (name.startsWith("customization.")) {
            setForm((p) => ({ ...p, customization: { ...p.customization, [name.split(".")[1]]: value } }));
        } else if (name.startsWith("inlinePromotion.")) {
            setForm((p) => ({ ...p, inlinePromotion: { ...p.inlinePromotion, [name.split(".")[1]]: value } }));
        } else {
            setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        }
    }

    function handleWarrantyPeriodChange(period) {
        setForm((p) => ({
            ...p, inlinePromotion: { ...p.inlinePromotion, warrantyPeriod: period, customWarranty: period !== "Custom" ? "" : p.inlinePromotion.customWarranty },
        }));
    }

    function copyVar(text) {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 1500);
    }

    function updateCallback(idx, patch) {
        const updated = [...form.callbackUrls];
        updated[idx] = { ...updated[idx], ...patch };
        setForm((p) => ({ ...p, callbackUrls: updated }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!form.inlinePromotion.offerTitle || !form.inlinePromotion.termsAndConditions) {
            setError("Offer Title and Terms & Conditions are required.");
            setLoading(false); return;
        }
        if (offerType === "extended-warranty" && form.inlinePromotion.warrantyPeriod === "Custom" && !form.inlinePromotion.customWarranty) {
            setError("Please specify the custom warranty period.");
            setLoading(false); return;
        }
        if (offerType === "discount-code" && !form.inlinePromotion.couponCode) {
            setError("Discount Code is required for this offer type.");
            setLoading(false); return;
        }
        if (offerType === "custom" && !form.inlinePromotion.offering) {
            setError("Offering is required for custom offer type.");
            setLoading(false); return;
        }

        try {
            const inlinePromotion = {
                offerTitle: form.inlinePromotion.offerTitle,
                type: offerType === "extended-warranty" ? "extended warranty" : offerType === "discount-code" ? "discount code" : "custom",
                termsAndConditions: form.inlinePromotion.termsAndConditions,
            };
            if (offerType === "extended-warranty") {
                inlinePromotion.warrantyPeriod = form.inlinePromotion.warrantyPeriod === "Custom" ? form.inlinePromotion.customWarranty : form.inlinePromotion.warrantyPeriod;
            } else if (offerType === "discount-code") {
                inlinePromotion.couponCode = form.inlinePromotion.couponCode;
                if (form.inlinePromotion.expiryDate) inlinePromotion.expiryDate = form.inlinePromotion.expiryDate;
            } else {
                inlinePromotion.offering = form.inlinePromotion.offering;
            }

            const campaignData = {
                name: form.name, category: form.category, products: form.products,
                inlinePromotion, customization: form.customization,
                formFields: form.formFields, callbackUrls: form.callbackUrls,
                ...(form.category === "review" && { reviewMinimumLength: form.reviewMinimumLength, enableSmartFunnel: form.enableSmartFunnel }),
            };

            const url = isEditMode ? `${API_URL}/campaigns/${id}` : `${API_URL}/campaigns`;
            const res = await fetch(url, {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify(campaignData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || `Failed to ${isEditMode ? "update" : "create"} campaign`);
            navigate("/campaigns");
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    /* ── Product options for react-select ── */
    const productOptions = useMemo(() => products.map((p) => ({ value: p._id, label: p.name, sku: p.sku })), [products]);
    const selectedProducts = useMemo(() =>
        form.products.map((pid) => {
            const p = products.find((x) => x._id === pid);
            return p ? { value: p._id, label: p.name } : null;
        }).filter(Boolean),
        [form.products, products]
    );

    if (fetchLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faff" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                    <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "Inter, sans-serif" }}>Loading campaign…</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="cf-root" style={{ minHeight: "100vh", background: "#f0f4f8" }}>
            <style>{cfStyles}</style>

            {/* ─── Sticky Top Bar ─── */}
            <div style={{
                position: "sticky", top: 0, zIndex: 100,
                background: "#fff",
                borderBottom: "1px solid #e5e7eb",
                padding: "0 24px",
                height: 56,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
                {/* Left: back + breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link to="/campaigns" style={{ color: "#9ca3af", display: "flex", alignItems: "center", padding: 4, borderRadius: 8, transition: "color 0.15s" }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#2563eb"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                        <Link to="/campaigns" style={{ color: "#6b7280", textDecoration: "none" }}>Campaigns</Link>
                        <span style={{ color: "#d1d5db" }}>/</span>
                        <span style={{ color: "#090e1a", fontWeight: 700 }}>{isEditMode ? "Edit Campaign" : "New Campaign"}</span>
                    </div>
                </div>

                {/* Right: cancel + save */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Link to="/campaigns" className="cf-btn-ghost">Cancel</Link>
                    <button
                        type="button"
                        className="cf-btn-primary"
                        onClick={handleSubmit}
                        disabled={loading || form.products.length === 0}
                    >
                        {loading ? (
                            <>
                                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                Saving…
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                {isEditMode ? "Update Campaign" : "Create Campaign"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ─── Main 2-column layout ─── */}
            <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>

                {/* Left: scrollable form */}
                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 60px" }}>
                    <div style={{ maxWidth: 720, margin: "0 auto" }}>

                        {/* Error banner */}
                        {error && (
                            <div className="cf-error">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                <span>{error}</span>
                                <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0 }}>✕</button>
                            </div>
                        )}

                        {/* ── Card 1: Basics ── */}
                        <div className="cf-card">
                            <SectionHeader icon="📋" title="Campaign Basics" subtitle="Name your campaign and link products" />
                            <div style={{ padding: "20px" }}>
                                <div style={{ marginBottom: 18 }}>
                                    <label className="cf-label">Campaign Name <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        className="cf-input"
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Summer Sale 2025"
                                    />
                                </div>

                                <div>
                                    <label className="cf-label">Products <span style={{ color: "#ef4444" }}>*</span></label>
                                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
                                        Select one or more products this campaign applies to
                                    </p>
                                    {products.length === 0 ? (
                                        <div style={{ padding: "16px", background: "#f8faff", borderRadius: 10, border: "1.5px dashed #bfdbfe", textAlign: "center" }}>
                                            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 4 }}>No products found</p>
                                            <Link to="/products/new" style={{ color: "#2563eb", fontSize: 12, fontWeight: 600 }}>Create your first product →</Link>
                                        </div>
                                    ) : (
                                        <div className="cf-rs">
                                            <Select
                                                isMulti
                                                options={productOptions}
                                                value={selectedProducts}
                                                onChange={(selected) => setForm((p) => ({ ...p, products: (selected || []).map((s) => s.value) }))}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                placeholder="Search and select products…"
                                                /* ── FIX: prevent dropdown from being clipped by parent overflow ── */
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                    menu: (base) => ({ ...base, borderRadius: 12, border: "1.5px solid #e5e7eb", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        background: state.isSelected ? "#2563eb" : state.isFocused ? "#eff6ff" : "#fff",
                                                        color: state.isSelected ? "#fff" : "#111827",
                                                        fontSize: 14, padding: "10px 14px",
                                                    }),
                                                    multiValue: (base) => ({ ...base, background: "#dbeafe", borderRadius: 6 }),
                                                    multiValueLabel: (base) => ({ ...base, color: "#1d4ed8", fontWeight: 600, fontSize: 12 }),
                                                    multiValueRemove: (base) => ({ ...base, color: "#3b82f6", cursor: "pointer", ":hover": { background: "#bfdbfe", color: "#1d4ed8" } }),
                                                    control: (base, state) => ({
                                                        ...base,
                                                        border: `1.5px solid ${state.isFocused ? "#2563eb" : "#d1d5db"}`,
                                                        boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
                                                        borderRadius: 10, minHeight: 42, fontSize: 14,
                                                    }),
                                                    placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: 14 }),
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Card 2: Promotion Details ── */}
                        <div className="cf-card">
                            <SectionHeader icon="🎁" title="Promotion Details" subtitle="Configure the offer shown to customers" />
                            <div style={{ padding: "20px" }}>

                                {/* Offer Title */}
                                <div style={{ marginBottom: 18 }}>
                                    <label className="cf-label">Offer Title <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        className="cf-input"
                                        type="text"
                                        name="inlinePromotion.offerTitle"
                                        value={form.inlinePromotion.offerTitle}
                                        onChange={handleChange}
                                        placeholder="e.g., Get 3-Month Extended Warranty"
                                        required
                                    />
                                </div>

                                {/* Offer Type Selector */}
                                <div style={{ marginBottom: 18 }}>
                                    <label className="cf-label">Offer Type</label>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {[
                                            { id: "extended-warranty", icon: "🛡️", label: "Extended Warranty" },
                                            { id: "discount-code", icon: "🏷️", label: "Discount Code" },
                                            { id: "custom", icon: "✨", label: "Custom Offer" },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                className={`cf-pill${offerType === t.id ? " active" : ""}`}
                                                onClick={() => {
                                                    setOfferType(t.id);
                                                    setForm((p) => ({
                                                        ...p, inlinePromotion: {
                                                            ...p.inlinePromotion,
                                                            type: t.id === "extended-warranty" ? "extended warranty" : t.id === "discount-code" ? "discount code" : "custom",
                                                        },
                                                    }));
                                                }}
                                            >
                                                {t.icon} {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conditional type fields */}
                                {offerType === "extended-warranty" && (
                                    <div style={{ marginBottom: 18 }}>
                                        <label className="cf-label">Warranty Duration</label>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            {["3 months", "6 months", "1 year", "Custom"].map((period) => (
                                                <button
                                                    key={period}
                                                    type="button"
                                                    className={`cf-pill-sm${form.inlinePromotion.warrantyPeriod === period ? " active" : ""}`}
                                                    onClick={() => handleWarrantyPeriodChange(period)}
                                                >
                                                    {period}
                                                </button>
                                            ))}
                                        </div>
                                        {form.inlinePromotion.warrantyPeriod === "Custom" && (
                                            <input
                                                className="cf-input"
                                                type="text"
                                                name="inlinePromotion.customWarranty"
                                                value={form.inlinePromotion.customWarranty}
                                                onChange={handleChange}
                                                placeholder="Specify custom duration, e.g. 2 years"
                                                style={{ marginTop: 10 }}
                                            />
                                        )}
                                    </div>
                                )}

                                {offerType === "discount-code" && (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                                        <div>
                                            <label className="cf-label">Discount Code <span style={{ color: "#ef4444" }}>*</span></label>
                                            <input
                                                className="cf-input cf-mono"
                                                type="text"
                                                name="inlinePromotion.couponCode"
                                                value={form.inlinePromotion.couponCode}
                                                onChange={handleChange}
                                                placeholder="SAVE10"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="cf-label">Expiry Date</label>
                                            <input
                                                className="cf-input"
                                                type="date"
                                                name="inlinePromotion.expiryDate"
                                                value={form.inlinePromotion.expiryDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                {offerType === "custom" && (
                                    <div style={{ marginBottom: 18 }}>
                                        <label className="cf-label">Offering <span style={{ color: "#ef4444" }}>*</span></label>
                                        <input
                                            className="cf-input"
                                            type="text"
                                            name="inlinePromotion.offering"
                                            value={form.inlinePromotion.offering}
                                            onChange={handleChange}
                                            placeholder="e.g., Free consultation, Gift voucher, Store credit"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Terms & Conditions */}
                                <div>
                                    <label className="cf-label">Terms & Conditions <span style={{ color: "#ef4444" }}>*</span></label>
                                    <SimpleMDE
                                        value={form.inlinePromotion.termsAndConditions}
                                        onChange={handleTCChange}
                                        options={simpleMDEOptions}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Card 3: Form Fields ── */}
                        <div className="cf-card">
                            <SectionHeader icon="📝" title="Form Fields" subtitle="Customize what customers fill out when submitting" />
                            <div style={{ padding: "20px" }}>
                                <FormBuilder
                                    fields={form.formFields}
                                    onChange={(newFields) => setForm((p) => ({ ...p, formFields: newFields }))}
                                />
                            </div>
                        </div>

                        {/* ── Card 4: Customization ── */}
                        <div className="cf-card">
                            <SectionHeader icon="🎨" title="Customization" subtitle="Brand the review form to match your store" />
                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                                    <div>
                                        <label className="cf-label">Primary Color</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <input
                                                type="color"
                                                name="customization.primaryColor"
                                                value={form.customization.primaryColor}
                                                onChange={handleChange}
                                                style={{ width: 40, height: 40, border: "1.5px solid #d1d5db", borderRadius: 8, cursor: "pointer", padding: 2 }}
                                            />
                                            <input
                                                className="cf-input cf-mono"
                                                type="text"
                                                value={form.customization.primaryColor}
                                                onChange={(e) => setForm((p) => ({ ...p, customization: { ...p.customization, primaryColor: e.target.value } }))}
                                                style={{ flex: 1, fontSize: 13 }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="cf-label">Background Style</label>
                                        <select
                                            className="cf-select"
                                            name="customization.backgroundStyle"
                                            value={form.customization.backgroundStyle}
                                            onChange={handleChange}
                                        >
                                            <option value="solid">⬜ Solid Color</option>
                                            <option value="gradient">🌅 Gradient</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="cf-label">Custom Message</label>
                                    <textarea
                                        className="cf-input"
                                        name="customization.customMessage"
                                        value={form.customization.customMessage}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Add a personal message for your customers…"
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Card 5: Callback URLs ── */}
                        <div className="cf-card">
                            <SectionHeader icon="🔗" title="Webhook / Callback URLs" subtitle="Run API calls automatically after form submission" />
                            <div style={{ padding: "20px" }}>

                                {/* Template variables helper */}
                                {form.callbackUrls.length > 0 && (
                                    <div style={{ background: "#f0f6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>
                                            📌 Available Template Variables — click to copy
                                        </p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {form.formFields.map((f) => (
                                                <button
                                                    key={f.id}
                                                    type="button"
                                                    className="cf-var-chip"
                                                    title="Click to copy"
                                                    onClick={() => copyVar(`{{${f.id}}}`)}
                                                    style={{ background: copied === `{{${f.id}}}` ? "#dbeafe" : "#fff" }}
                                                >
                                                    {`{{${f.id}}}`}
                                                    {copied === `{{${f.id}}}` && <span style={{ fontSize: 10, color: "#059669" }}> ✓</span>}
                                                </button>
                                            ))}
                                            {form.callbackUrls.length > 1 && (
                                                <span className="cf-var-chip" style={{ background: "#fffbeb", borderColor: "#fcd34d", color: "#92400e" }}>
                                                    {`{{$response[0].path}}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Callback cards */}
                                {form.callbackUrls.map((cb, idx) => (
                                    <div key={idx} className="cf-cb-card">
                                        {/* Card header */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#f8faff", borderBottom: "1px solid #e5e7eb" }}>
                                            <span style={{ width: 22, height: 22, background: "#2563eb", color: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                                {idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={cb.name}
                                                onChange={(e) => updateCallback(idx, { name: e.target.value })}
                                                className="cf-input"
                                                placeholder="Callback name (e.g., Create CRM Contact)"
                                                style={{ flex: 1, padding: "6px 10px", fontSize: 13 }}
                                            />
                                            <div style={{ display: "flex", gap: 2 }}>
                                                {idx > 0 && (
                                                    <button type="button" title="Move up" onClick={() => {
                                                        const u = [...form.callbackUrls];
                                                        [u[idx - 1], u[idx]] = [u[idx], u[idx - 1]];
                                                        u.forEach((c, i) => c.order = i);
                                                        setForm((p) => ({ ...p, callbackUrls: u }));
                                                    }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6 }}>▲</button>
                                                )}
                                                {idx < form.callbackUrls.length - 1 && (
                                                    <button type="button" title="Move down" onClick={() => {
                                                        const u = [...form.callbackUrls];
                                                        [u[idx], u[idx + 1]] = [u[idx + 1], u[idx]];
                                                        u.forEach((c, i) => c.order = i);
                                                        setForm((p) => ({ ...p, callbackUrls: u }));
                                                    }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6 }}>▼</button>
                                                )}
                                                <button type="button" title="Remove" onClick={() => {
                                                    const u = form.callbackUrls.filter((_, i) => i !== idx);
                                                    u.forEach((c, i) => c.order = i);
                                                    setForm((p) => ({ ...p, callbackUrls: u }));
                                                }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6 }}
                                                    onMouseOver={(e) => e.currentTarget.style.color = "#dc2626"}
                                                    onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}>
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                                            {/* Method + URL */}
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <select
                                                    value={cb.method}
                                                    onChange={(e) => updateCallback(idx, { method: e.target.value })}
                                                    className="cf-select cf-mono"
                                                    style={{
                                                        width: 110, fontSize: 12, fontWeight: 700, padding: "8px 28px 8px 10px",
                                                        color: cb.method === "GET" ? "#059669" : cb.method === "DELETE" ? "#dc2626" : cb.method === "POST" ? "#2563eb" : "#d97706",
                                                    }}
                                                >
                                                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={cb.url}
                                                    onChange={(e) => updateCallback(idx, { url: e.target.value })}
                                                    className="cf-input cf-mono"
                                                    placeholder="https://api.example.com/endpoint"
                                                    style={{ flex: 1, fontSize: 13 }}
                                                />
                                            </div>

                                            {/* Headers */}
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Request Headers</label>
                                                    <button type="button" onClick={() => {
                                                        const entries = Object.entries(cb.headers || {});
                                                        const key = `header${entries.length}`;
                                                        updateCallback(idx, { headers: { ...cb.headers, [key]: "" } });
                                                    }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontWeight: 600, padding: 0 }}>
                                                        + Add Header
                                                    </button>
                                                </div>
                                                {Object.entries(cb.headers || {}).map(([hKey, hVal], hIdx) => (
                                                    <div key={hIdx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                                        <input
                                                            type="text"
                                                            value={hKey}
                                                            onChange={(e) => {
                                                                const entries = Object.entries(cb.headers);
                                                                entries[hIdx] = [e.target.value, entries[hIdx][1]];
                                                                updateCallback(idx, { headers: Object.fromEntries(entries) });
                                                            }}
                                                            className="cf-input cf-mono"
                                                            placeholder="Header name"
                                                            style={{ width: "40%", fontSize: 12, padding: "7px 10px" }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={hVal}
                                                            onChange={(e) => {
                                                                const entries = Object.entries(cb.headers);
                                                                entries[hIdx] = [entries[hIdx][0], e.target.value];
                                                                updateCallback(idx, { headers: Object.fromEntries(entries) });
                                                            }}
                                                            className="cf-input cf-mono"
                                                            placeholder="Header value"
                                                            style={{ flex: 1, fontSize: 12, padding: "7px 10px" }}
                                                        />
                                                        <button type="button" onClick={() => {
                                                            const entries = Object.entries(cb.headers);
                                                            entries.splice(hIdx, 1);
                                                            updateCallback(idx, { headers: Object.fromEntries(entries) });
                                                        }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "0 4px" }}
                                                            onMouseOver={(e) => e.currentTarget.style.color = "#dc2626"}
                                                            onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}>✕</button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Body (non-GET) */}
                                            {cb.method !== "GET" && (
                                                <div>
                                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Request Body <span style={{ color: "#9ca3af", fontWeight: 400 }}>(JSON — supports {"{{variables}}"})</span></label>
                                                    <textarea
                                                        value={cb.body}
                                                        onChange={(e) => updateCallback(idx, { body: e.target.value })}
                                                        rows={4}
                                                        className="cf-input cf-mono"
                                                        placeholder={'{\n  "name": "{{customerName}}",\n  "email": "{{email}}"\n}'}
                                                        style={{ resize: "vertical", background: "#f8faff", fontSize: 12 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button type="button" className="cf-dashed-btn" onClick={() => {
                                    setForm((p) => ({
                                        ...p,
                                        callbackUrls: [...p.callbackUrls, {
                                            name: "", url: "", method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: "", order: p.callbackUrls.length,
                                        }],
                                    }));
                                }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Add Webhook / Callback
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right: sticky live preview */}
                <div style={{
                    width: 400, flexShrink: 0,
                    borderLeft: "1px solid #e5e7eb",
                    background: "#f8faff",
                    display: "flex", flexDirection: "column",
                    height: "calc(100vh - 56px)",
                    position: "sticky", top: 56,
                }} className="hidden lg:flex">
                    <div className="cf-preview-banner">
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>👁</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#090e1a" }}>Live Preview</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, background: "#dbeafe", color: "#2563eb", padding: "3px 10px", borderRadius: 100 }}>
                            Updates in real-time
                        </span>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                        <div style={{ transform: "scale(0.82)", transformOrigin: "top center" }}>
                            <PublicCampaignForm
                                previewMode={true}
                                previewData={{
                                    ...form,
                                    products: products.filter((p) => form.products.includes(p._id)),
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
