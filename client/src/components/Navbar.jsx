import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Don't show navbar on auth pages
  const hideNavbarRoutes = ["/login", "/register"];
  const isPublicCampaignRoute = location.pathname.startsWith("/campaign/");

  if (hideNavbarRoutes.includes(location.pathname) || isPublicCampaignRoute) {
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl">📱</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ScanQRGo
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {token && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  location.pathname === "/"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/products"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/products")
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-100"
                }`}
              >
                Products
              </Link>

              <Link
                to="/promotions"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/promotions")
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
                }`}
              >
                Promotions
              </Link>

              <Link
                to="/campaigns"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/campaigns")
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                }`}
              >
                Campaigns
              </Link>
            </div>
          )}

          {/* User Actions */}
          {token ? (
            <div className="flex items-center space-x-3">
              {/* Quick Actions Dropdown */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/campaigns/create"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  + New Campaign
                </Link>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {token && (
            <div className="md:hidden">
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => {
                  // Toggle mobile menu - you can implement this state if needed
                  console.log("Mobile menu toggle");
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - You can expand this with state management */}
      <div className="md:hidden bg-white border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg font-medium ${
              location.pathname === "/"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/products"
            className={`block px-3 py-2 rounded-lg font-medium ${
              isActive("/products")
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:text-green-600 hover:bg-gray-100"
            }`}
          >
            Products
          </Link>
          <Link
            to="/promotions"
            className={`block px-3 py-2 rounded-lg font-medium ${
              isActive("/promotions")
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
            }`}
          >
            Promotions
          </Link>
          <Link
            to="/campaigns"
            className={`block px-3 py-2 rounded-lg font-medium ${
              isActive("/campaigns")
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
            }`}
          >
            Campaigns
          </Link>
        </div>
      </div>
    </nav>
  );
}
