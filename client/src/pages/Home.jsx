import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [stats, setStats] = useState({
    products: 0,
    promotions: 0,
    campaigns: 0,
    totalScans: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch campaign stats
      const campaignRes = await fetch("http://localhost:5000/api/campaigns/stats/dashboard", {
        headers: { Authorization: token },
      });
      
      if (campaignRes.ok) {
        const campaignData = await campaignRes.json();
        setStats(prev => ({
          ...prev,
          campaigns: campaignData.summary.total,
          totalScans: campaignData.analytics.totalScans
        }));
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  return (
    // Remove the min-h-screen and bg-gradient classes since they're now in App.jsx
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to ScanQRGo!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create campaigns, manage products, design promotions, and engage customers with QR code marketing
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Products Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-3">Products</h3>
            <p className="text-gray-600 mb-6">Manage your product catalog and link them to marketing campaigns.</p>
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
            <p className="text-gray-600 mb-6">Create attractive offers and rewards to incentivize customer engagement.</p>
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
            <p className="text-gray-600 mb-6">Launch marketing campaigns that connect products with promotions.</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.products}</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.promotions}</div>
            <div className="text-sm text-gray-500">Promotions</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600">{stats.campaigns}</div>
            <div className="text-sm text-gray-500">Campaigns</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.totalScans}</div>
            <div className="text-sm text-gray-500">Total Scans</div>
          </div>
        </div>
      </div>
    </div>
  );
}
