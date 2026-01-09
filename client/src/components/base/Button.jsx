import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A premium, responsive button component with various styles and states.
 * Supports primary (gradient), secondary (outline), danger, and ghost variants.
 */
const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon = null,
    onClick,
    to,
    fullWidth = false,
    ...props
}) => {
    // Base styles
    const baseStyles =
        "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden";

    // Size variants
    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    // Color/Style variants
    const variantStyles = {
        primary: "bg-blue-600  text-white hover:shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 border-transparent",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow",
        danger: "bg-red-500  text-white hover:shadow-lg shadow-red-500/30 hover:shadow-red-500/40 border-transparent",
        ghost: "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        success: "bg-green-500  text-white hover:shadow-lg shadow-green-500/30 hover:shadow-green-500/40 border-transparent",
        dark: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 border-transparent",
    };

    // Width style
    const widthStyle = fullWidth ? "w-full" : "";

    // Combine all styles
    const combinedClasses = `
    ${baseStyles} 
    ${sizeStyles[size] || sizeStyles.md} 
    ${variantStyles[variant] || variantStyles.primary} 
    ${widthStyle} 
    ${className}
  `.trim();

    // Loading spinner
    const LoadingSpinner = () => (
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-current"
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
    );

    const content = (
        <>
            {loading && <LoadingSpinner />}
            {!loading && icon && <span className="mr-2">{icon}</span>}
            {children}
        </>
    );

    // If 'to' prop is present, render as Link
    if (to && !disabled) {
        return (
            <Link to={to} className={combinedClasses} {...props}>
                {content}
            </Link>
        );
    }

    // If 'href' prop is present, render as anchor
    if (props.href && !disabled) {
        return (
            <a className={combinedClasses} {...props}>
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={combinedClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;
