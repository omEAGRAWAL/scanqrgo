import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from "../config/api";
import * as XLSX from "xlsx";
import Button from "../components/base/Button";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

const PREDEFINED_MARKETPLACES = [
    "Amazon India",
    "Flipkart",
    "Meesho",
    "Snapdeal",
    "Myntra",
    "Ajio",
    "Other"
];

export default function ProductForm() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        imageurl: "",
    });

    const [marketplaceSources, setMarketplaceSources] = useState([
        { marketplace: "", productId: "", customMarketplace: "", isPrimary: true }
    ]);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    async function fetchProduct() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/products/${id}`, {
                headers: { Authorization: token },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch product");

            setForm({
                name: data.name || "",
                imageurl: data.imageurl || "",
            });

            // Migrate legacy fields to new format
            const sources = [];
            if (data.amazonAsin) {
                sources.push({
                    marketplace: "Amazon India",
                    productId: data.amazonAsin,
                    customMarketplace: "",
                    isPrimary: true
                });
            }
            if (data.flipkartFsn) {
                sources.push({
                    marketplace: "Flipkart",
                    productId: data.flipkartFsn,
                    customMarketplace: "",
                    isPrimary: sources.length === 0
                });
            }

            // Add new marketplace sources
            if (data.marketplaceSources && data.marketplaceSources.length > 0) {
                data.marketplaceSources.forEach(source => {
                    const isCustom = !PREDEFINED_MARKETPLACES.slice(0, -1).includes(source.marketplace);
                    sources.push({
                        marketplace: isCustom ? "Other" : source.marketplace,
                        productId: source.productId,
                        customMarketplace: isCustom ? source.marketplace : "",
                        isPrimary: source.isPrimary || false
                    });
                });
            }

            if (sources.length > 0) {
                setMarketplaceSources(sources);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setFetchLoading(false);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleMarketplaceChange(index, field, value) {
        const updated = [...marketplaceSources];
        updated[index][field] = value;

        // If setting as primary, unset others
        if (field === "isPrimary" && value === true) {
            updated.forEach((source, i) => {
                if (i !== index) source.isPrimary = false;
            });
        }

        setMarketplaceSources(updated);
    }

    function addMarketplaceSource() {
        setMarketplaceSources([
            ...marketplaceSources,
            { marketplace: "", productId: "", customMarketplace: "", isPrimary: false }
        ]);
    }

    function removeMarketplaceSource(index) {
        if (marketplaceSources.length === 1) {
            setError("At least one marketplace source is required");
            return;
        }
        const updated = marketplaceSources.filter((_, i) => i !== index);
        // If removed item was primary, make first item primary
        if (marketplaceSources[index].isPrimary && updated.length > 0) {
            updated[0].isPrimary = true;
        }
        setMarketplaceSources(updated);
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

    function validateForm() {
        if (!form.name.trim()) {
            setError("Product name is required");
            return false;
        }

        // Check if at least one marketplace source is filled
        const validSources = marketplaceSources.filter(
            source => source.marketplace && source.productId
        );

        if (validSources.length === 0) {
            setError("At least one marketplace source with product ID is required");
            return false;
        }

        // Validate custom marketplace names
        for (const source of validSources) {
            if (source.marketplace === "Other" && !source.customMarketplace.trim()) {
                setError("Please enter a custom marketplace name for 'Other' selections");
                return false;
            }
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            // Prepare marketplace sources
            const validSources = marketplaceSources
                .filter(source => source.marketplace && source.productId)
                .map(source => ({
                    marketplace: source.marketplace === "Other"
                        ? source.customMarketplace
                        : source.marketplace,
                    productId: source.productId,
                    isPrimary: source.isPrimary || false
                }));

            // Ensure at least one is marked as primary
            if (!validSources.some(s => s.isPrimary)) {
                validSources[0].isPrimary = true;
            }

            const payload = {
                name: form.name,
                imageurl: form.imageurl || undefined,
                marketplaceSources: validSources,
            };

            const url = isEditMode ? `${API_URL}/products/${id}` : `${API_URL}/products`;
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);

            navigate("/products");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Bulk upload handlers (create mode only)
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
                    header[1] !== "marketplace" ||
                    header[2] !== "productId" ||
                    header[3] !== "imageurl"
                ) {
                    setError(
                        "Invalid Excel headers. Must be: name, marketplace, productId, imageurl."
                    );
                    setUploading(false);
                    return;
                }

                const products = body
                    .filter((r) => r[0] && r[1] && r[2])
                    .map(([name, marketplace, productId, imageurl]) => ({
                        name,
                        marketplaceSources: [{
                            marketplace,
                            productId,
                            isPrimary: true
                        }],
                        imageurl,
                    }));

                if (products.length === 0) {
                    setError("No valid products found in the Excel file");
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

    const handleDownloadSample = () => {
        const sampleData = [
            ["name", "marketplace", "productId", "imageurl"],
            ["Sample Product 1", "Amazon India", "B08XXXXX12", "https://example.com/image1.jpg"],
            ["Sample Product 2", "Flipkart", "ACCEYZTGF12345", "https://example.com/image2.jpg"],
            ["Sample Product 3", "Meesho", "MESH123456", "https://example.com/image3.jpg"],
        ];

        const ws = XLSX.utils.aoa_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "sample_products.xlsx");
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading product...</div>
            </div>
        );
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
                        {isEditMode ? "Edit Product" : "Create New Product"}
                    </h1>

                    {/* Bulk Upload Section (Create mode only) */}
                    {!isEditMode && (
                        <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-gray-50">
                            <h2 className="text-xl font-semibold mb-2">
                                📦 Bulk Product Upload
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Excel headers must be:{" "}
                                <b>name, marketplace, productId, imageurl</b>.
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
                        </div>
                    )}

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

                        {/* Marketplace Sources */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Marketplace Sources *
                                </label>
                                <Button
                                    type="button"
                                    onClick={addMarketplaceSource}
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <PlusCircleIcon className="w-4 h-4" />
                                    Add Marketplace
                                </Button>
                            </div>

                            {marketplaceSources.map((source, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="text-sm font-medium text-gray-600">
                                            Source #{index + 1}
                                        </span>
                                        {marketplaceSources.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMarketplaceSource(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XCircleIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Marketplace
                                            </label>
                                            <select
                                                value={source.marketplace}
                                                onChange={(e) =>
                                                    handleMarketplaceChange(index, "marketplace", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Marketplace</option>
                                                {PREDEFINED_MARKETPLACES.map((mp) => (
                                                    <option key={mp} value={mp}>
                                                        {mp}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {source.marketplace === "Other" && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Custom Marketplace Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., My Shopify Store"
                                                    value={source.customMarketplace}
                                                    onChange={(e) =>
                                                        handleMarketplaceChange(index, "customMarketplace", e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        )}

                                        <div className={source.marketplace === "Other" ? "sm:col-span-2" : ""}>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Product ID
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., B08XXXXX (ASIN) or FSN123456"
                                                value={source.productId}
                                                onChange={(e) =>
                                                    handleMarketplaceChange(index, "productId", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`primary-${index}`}
                                            checked={source.isPrimary}
                                            onChange={(e) =>
                                                handleMarketplaceChange(index, "isPrimary", e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`primary-${index}`}
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            Mark as primary source
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
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
                                {isEditMode ? "Update Product" : "Create Product"}
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
