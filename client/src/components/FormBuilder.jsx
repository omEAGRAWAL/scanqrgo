import React, { useState, useCallback, useRef } from "react";

// ─── Default field templates ───────────────────────────────────────────
export const DEFAULT_FORM_FIELDS = [
    {
        id: "selectedProduct",
        type: "product_select",
        label: "Select Product",
        placeholder: "",
        required: true,
        options: [],
        step: 0,
        order: 0,
        isSystem: true,
        isRemovable: false,
    },
    {
        id: "marketplace",
        type: "marketplace_select",
        label: "Where did you purchase?",
        placeholder: "",
        required: false,
        options: [],
        step: 0,
        order: 1,
        isSystem: true,
        isRemovable: true,
    },
    {
        id: "orderNumber",
        type: "text",
        label: "Order ID",
        placeholder: "Found in your order history",
        required: true,
        options: [],
        step: 0,
        order: 2,
        isSystem: false,
        isRemovable: true,
    },
    {
        id: "satisfaction",
        type: "rating",
        label: "How would you rate your experience?",
        placeholder: "",
        required: true,
        options: [],
        step: 0,
        order: 3,
        isSystem: true,
        isRemovable: false,
    },
    {
        id: "usedMoreDays",
        type: "toggle",
        label: "Have you used this product for more than 7 days?",
        placeholder: "",
        required: true,
        options: ["Yes", "No"],
        step: 0,
        order: 4,
        isSystem: false,
        isRemovable: true,
    },
    {
        id: "customerName",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        options: [],
        step: 1,
        order: 0,
        isSystem: false,
        isRemovable: true,
    },
    {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
        options: [],
        step: 1,
        order: 1,
        isSystem: false,
        isRemovable: true,
    },
    {
        id: "phoneNumber",
        type: "tel",
        label: "Phone Number",
        placeholder: "+91",
        required: false,
        options: [],
        step: 1,
        order: 2,
        isSystem: false,
        isRemovable: true,
    },
    {
        id: "review",
        type: "textarea",
        label: "Write your review",
        placeholder: "What did you like? What could be improved?",
        required: true,
        options: [],
        step: 2,
        order: 0,
        isSystem: true,
        isRemovable: false,
    },
];

const FIELD_TYPE_OPTIONS = [
    { value: "text", label: "Short Text", icon: "Aa" },
    { value: "textarea", label: "Long Text", icon: "¶" },
    { value: "email", label: "Email", icon: "✉" },
    { value: "tel", label: "Phone", icon: "☎" },
    { value: "number", label: "Number", icon: "#" },
    { value: "select", label: "Dropdown", icon: "▼" },
    { value: "toggle", label: "Yes / No", icon: "⇌" },
];

const STEP_LABELS = ["Step 1 — Product Info", "Step 2 — Customer Details", "Step 3 — Review"];

// ─── Field Card ────────────────────────────────────────────────────────
function FieldCard({
    field,
    index,
    onUpdate,
    onRemove,
    onDragStart,
    onDragOver,
    onDrop,
    isDragTarget,
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            draggable={true}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            className={`group border rounded-xl bg-white transition-all duration-200 ${isDragTarget
                ? "border-blue-400 shadow-lg ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
        >
            {/* Header Row */}
            <div className="flex items-center gap-3 px-4 py-3">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm8-16a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </div>

                {/* Field Type Badge */}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm font-bold flex-shrink-0">
                    {FIELD_TYPE_OPTIONS.find((t) => t.value === field.type)?.icon ||
                        (field.type === "rating" ? "★" : field.type === "product_select" ? "📦" : field.type === "marketplace_select" ? "🏪" : "?")}
                </span>

                {/* Label */}
                <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-800 truncate block">{field.label}</span>
                    <span className="text-xs text-gray-400">
                        {field.type === "product_select"
                            ? "Product Select"
                            : field.type === "marketplace_select"
                                ? "Marketplace Select"
                                : FIELD_TYPE_OPTIONS.find((t) => t.value === field.type)?.label || field.type}
                        {field.required && <span className="ml-1 text-red-400">• Required</span>}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {field.isSystem && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">System</span>
                    )}
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit field"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    {field.isRemovable && (
                        <button
                            type="button"
                            onClick={() => onRemove(field.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove field"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Edit Panel */}
            {expanded && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50 space-y-3 rounded-b-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                            <input
                                type="text"
                                value={field.label}
                                onChange={(e) => onUpdate(field.id, "label", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={field.placeholder}
                                onChange={(e) => onUpdate(field.id, "placeholder", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    {!field.isSystem && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Field Type</label>
                                <select
                                    value={field.type}
                                    onChange={(e) => onUpdate(field.id, "type", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {FIELD_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.icon} {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Step</label>
                                <select
                                    value={field.step}
                                    onChange={(e) => onUpdate(field.id, "step", parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {STEP_LABELS.map((label, i) => (
                                        <option key={i} value={i}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {(field.type === "select" || field.type === "toggle") && !field.isSystem && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Options (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={(field.options || []).join(", ")}
                                onChange={(e) =>
                                    onUpdate(
                                        field.id,
                                        "options",
                                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Option 1, Option 2, Option 3"
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => onUpdate(field.id, "required", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm text-gray-600">Required</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Preview Component ─────────────────────────────────────────────────
function FormPreview({ fields, activeStep, onStepChange }) {
    const stepFields = fields
        .filter((f) => f.step === activeStep)
        .sort((a, b) => a.order - b.order);

    const renderPreviewField = (field) => {
        switch (field.type) {
            case "product_select":
                return (
                    <div key={field.id} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400 text-sm" disabled>
                            <option>Select a product...</option>
                        </select>
                    </div>
                );
            case "marketplace_select":
                return (
                    <div key={field.id} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 border-2 border-orange-300 bg-orange-50 rounded-lg p-2 text-center text-sm text-orange-600 font-medium">Amazon</div>
                            <div className="flex-1 border-2 border-gray-200 rounded-lg p-2 text-center text-sm text-gray-400">Flipkart</div>
                        </div>
                    </div>
                );
            case "rating":
                return (
                    <div key={field.id} className="space-y-1 text-center">
                        <label className="text-sm font-medium text-gray-700 block">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex justify-center gap-1 text-2xl">
                            {"★★★★★".split("").map((s, i) => (
                                <span key={i} className={i < 3 ? "text-yellow-400" : "text-gray-300"}>{s}</span>
                            ))}
                        </div>
                    </div>
                );
            case "toggle":
                return (
                    <div key={field.id} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            {(field.options?.length ? field.options : ["Yes", "No"]).map((opt, i) => (
                                <div
                                    key={opt}
                                    className={`flex-1 text-center py-2 text-sm font-medium ${i === 0 ? "bg-blue-50 text-blue-600 border-r border-gray-300" : "text-gray-500"
                                        }`}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "textarea":
                return (
                    <div key={field.id} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-400 resize-none"
                            rows={3}
                            placeholder={field.placeholder || "Type here..."}
                            disabled
                        />
                    </div>
                );
            case "select":
                return (
                    <div key={field.id} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400 text-sm" disabled>
                            <option>Select...</option>
                            {(field.options || []).map((opt) => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            default:
                return (
                    <div key={field.id} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={field.type || "text"}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-400"
                            placeholder={field.placeholder || "Type here..."}
                            disabled
                        />
                    </div>
                );
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-sm mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-6 text-center"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)" }}>
                <p className="text-lg font-bold">Claim Your Offer</p>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center gap-4 px-6 pt-4">
                {STEP_LABELS.map((label, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onStepChange(i)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${activeStep === i
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {i + 1}. {label.split(" — ")[1]}
                    </button>
                ))}
            </div>

            {/* Fields */}
            <div className="px-6 py-5 space-y-4 min-h-[240px]">
                {stepFields.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                        No fields in this step
                    </div>
                ) : (
                    stepFields.map(renderPreviewField)
                )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-2 border-t border-gray-100 flex justify-between">
                <button
                    type="button"
                    disabled={activeStep === 0}
                    className="text-sm text-gray-400"
                    onClick={() => onStepChange(Math.max(0, activeStep - 1))}
                >
                    ← Back
                </button>
                <button
                    type="button"
                    className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full font-medium"
                    onClick={() => onStepChange(Math.min(2, activeStep + 1))}
                >
                    {activeStep === 2 ? "Submit" : "Next →"}
                </button>
            </div>
            <div className="bg-gray-50 text-center py-2 text-xs text-gray-400 border-t">
                Powered by <strong>Reviu</strong>
            </div>
        </div>
    );
}

// ─── Main FormBuilder ──────────────────────────────────────────────────
export default function FormBuilder({ fields, onChange }) {
    const [activePreviewStep, setActivePreviewStep] = useState(0);
    const [showAddField, setShowAddField] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [activeBuilderStep, setActiveBuilderStep] = useState(null); // null = all steps
    const addFieldRef = useRef(null);

    // Ensure we always work with valid fields
    const formFields = fields?.length ? fields : DEFAULT_FORM_FIELDS;

    const updateFields = useCallback(
        (newFields) => {
            onChange(newFields);
        },
        [onChange]
    );

    const handleUpdateField = useCallback(
        (fieldId, key, value) => {
            updateFields(
                formFields.map((f) => (f.id === fieldId ? { ...f, [key]: value } : f))
            );
        },
        [formFields, updateFields]
    );

    const handleRemoveField = useCallback(
        (fieldId) => {
            updateFields(formFields.filter((f) => f.id !== fieldId));
        },
        [formFields, updateFields]
    );

    const handleAddField = useCallback(
        (type) => {
            const step = activeBuilderStep !== null ? activeBuilderStep : 0;
            const stepFields = formFields.filter((f) => f.step === step);
            const maxOrder = stepFields.length > 0 ? Math.max(...stepFields.map((f) => f.order)) : -1;

            const newField = {
                id: `custom_${Date.now()}`,
                type,
                label: `${FIELD_TYPE_OPTIONS.find((o) => o.value === type)?.label || "New"} Field`,
                placeholder: "",
                required: false,
                options: type === "select" ? ["Option 1", "Option 2"] : type === "toggle" ? ["Yes", "No"] : [],
                step,
                order: maxOrder + 1,
                isSystem: false,
                isRemovable: true,
            };
            updateFields([...formFields, newField]);
            setShowAddField(false);
        },
        [formFields, activeBuilderStep, updateFields]
    );

    // Drag & Drop handlers
    const handleDragStart = useCallback((e, index) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    }, []);

    const handleDragOver = useCallback((e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverIndex(index);
    }, []);

    const handleDrop = useCallback(
        (e, dropIndex) => {
            e.preventDefault();
            if (dragIndex === null || dragIndex === dropIndex) {
                setDragIndex(null);
                setDragOverIndex(null);
                return;
            }
            // Get visible fields (filtered by current step if any)
            const displayFields = activeBuilderStep !== null
                ? formFields.filter((f) => f.step === activeBuilderStep).sort((a, b) => a.order - b.order)
                : formFields.sort((a, b) => a.step - b.step || a.order - b.order);

            const draggedField = displayFields[dragIndex];
            const targetField = displayFields[dropIndex];

            if (!draggedField || !targetField) {
                setDragIndex(null);
                setDragOverIndex(null);
                return;
            }

            // Swap steps and orders
            const updated = formFields.map((f) => {
                if (f.id === draggedField.id) return { ...f, step: targetField.step, order: targetField.order };
                if (f.id === targetField.id) return { ...f, step: draggedField.step, order: draggedField.order };
                return f;
            });

            updateFields(updated);
            setDragIndex(null);
            setDragOverIndex(null);
        },
        [dragIndex, formFields, activeBuilderStep, updateFields]
    );

    // Get fields to display in builder
    const displayFields =
        activeBuilderStep !== null
            ? formFields.filter((f) => f.step === activeBuilderStep).sort((a, b) => a.order - b.order)
            : formFields.sort((a, b) => a.step - b.step || a.order - b.order);

    return (
        <div className="space-y-6">
            {/* ─── Builder Panel ─── */}
            <div className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-xl">📋</span> Form Builder
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Drag to reorder • Click edit to configure • Add new fields below
                                </p>
                            </div>
                            <span className="text-sm bg-white text-gray-600 px-3 py-1 rounded-full border border-gray-200 font-medium">
                                {formFields.length} fields
                            </span>
                        </div>
                    </div>

                    {/* Step Filter Tabs */}
                    <div className="px-6 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setActiveBuilderStep(null)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${activeBuilderStep === null
                                ? "bg-gray-900 text-white"
                                : "text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            All Steps
                        </button>
                        {STEP_LABELS.map((label, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setActiveBuilderStep(i)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${activeBuilderStep === i
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {label.split(" — ")[1]} ({formFields.filter((f) => f.step === i).length})
                            </button>
                        ))}
                    </div>

                    {/* Field Cards */}
                    <div className="p-4 space-y-2 min-h-[200px]"
                        onDragOver={(e) => e.preventDefault()}>
                        {displayFields.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-4xl mb-2">📝</p>
                                <p className="font-medium">No fields in this step</p>
                                <p className="text-sm">Click "Add Field" to get started</p>
                            </div>
                        ) : (
                            displayFields.map((field, index) => (
                                <FieldCard
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    onUpdate={handleUpdateField}
                                    onRemove={handleRemoveField}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    isDragTarget={dragOverIndex === index}
                                />
                            ))
                        )}
                    </div>

                    {/* Add Field Button */}
                    <div className="px-4 pb-4" ref={addFieldRef}>
                        {!showAddField ? (
                            <button
                                type="button"
                                onClick={() => setShowAddField(true)}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Field
                            </button>
                        ) : (
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">Choose field type</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddField(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {FIELD_TYPE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleAddField(opt.value)}
                                            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                                        >
                                            <span className="text-lg">{opt.icon}</span>
                                            <span className="font-medium">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
