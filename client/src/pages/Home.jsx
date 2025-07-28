import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    promotions: 0,
    campaigns: 0,
    totalScans: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");

      // Fetch campaign stats
      const campaignRes = await fetch(
        "http://localhost:5000/api/campaigns/stats/dashboard",
        {
          headers: { Authorization: token },
        }
      );

      if (campaignRes.ok) {
        const campaignData = await campaignRes.json();
        setStats((prev) => ({
          ...prev,
          campaigns: campaignData.summary.total,
          totalScans: campaignData.analytics.totalScans,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">ScanQRGo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Products
              </Link>
              <Link
                to="/promotions"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Promotions
              </Link>
              <Link
                to="/campaigns"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Campaigns
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to ScanQRGo!
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl">
          Create campaigns, manage products, design promotions, and engage
          customers with QR code marketing
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
          {/* Products Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-3">Products</h3>
            <p className="text-gray-600 mb-6">
              Manage your product catalog and link them to marketing campaigns.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All
              </Link>
              <Link
                to="/products/create"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add New
              </Link>
            </div>
          </div>

          {/* Promotions Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold mb-3">Promotions</h3>
            <p className="text-gray-600 mb-6">
              Create attractive offers and rewards to incentivize customer
              engagement.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/promotions"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View All
              </Link>
              <Link
                to="/promotions/create"
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Create New
              </Link>
            </div>
          </div>

          {/* Campaigns Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-3">Campaigns</h3>
            <p className="text-gray-600 mb-6">
              Launch marketing campaigns that connect products with promotions.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/campaigns"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All
              </Link>
              <Link
                to="/campaigns/create"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Launch New
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.products}
            </div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.promotions}
            </div>
            <div className="text-sm text-gray-500">Promotions</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {stats.campaigns}
            </div>
            <div className="text-sm text-gray-500">Campaigns</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalScans}
            </div>
            <div className="text-sm text-gray-500">Total Scans</div>
          </div>
        </div>
      </div>
    </div>
  );
}
