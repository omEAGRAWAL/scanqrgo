import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
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
      const campaignRes = await fetch(`${API_URL}/campaigns/stats/dashboard`, {
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
// import React from "react";
// import { Link } from "react-router-dom";

// // Hero section graphics (optional: replace with your logo or custom SVGs)
// const HeroSVG = () => (
//   <svg viewBox="0 0 300 230" fill="none" className="w-full max-w-lg" aria-hidden>
//     <rect x="10" y="40" rx="24" width="280" height="65"
//       fill="url(#a)" opacity="0.8"/>
//     <rect x="25" y="120" rx="24" width="250" height="40"
//       fill="url(#b)" opacity="0.6"/>
//     <rect x="62" y="180" rx="12" width="175" height="30"
//       fill="#4f46e5" opacity="0.5"/>
//     <defs>
//       <linearGradient id="a" x1="0" y1="0" x2="280" y2="65" gradientUnits="userSpaceOnUse">
//         <stop stopColor="#6366f1"/><stop offset="1" stopColor="#c4b5fd"/>
//       </linearGradient>
//       <linearGradient id="b" x1="0" y1="0" x2="250" y2="40" gradientUnits="userSpaceOnUse">
//         <stop stopColor="#06b6d4"/><stop offset="1" stopColor="#f472b6"/>
//       </linearGradient>
//     </defs>
//   </svg>
// );

// export default function LandingHome() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-slate-800">
//       {/* NAVBAR */}
//       <header className="w-full px-8 py-6 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 z-20">
//         <div className="flex items-center space-x-2 font-bold text-2xl">
//           <span role="img" aria-label="QR">📱</span>
//           <span className="text-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ScanQRGo</span>
//         </div>
//         <nav className="space-x-7 hidden md:block">
//           <a href="#how-it-works" className="hover:text-blue-600 font-medium">How it Works</a>
//           <a href="#features" className="hover:text-blue-600 font-medium">Features</a>
//           <a href="#solution" className="hover:text-blue-600 font-medium">Our Solution</a>
//           <a href="#contact" className="hover:text-blue-600 font-medium">Contact</a>
//         </nav>
//         <div className="space-x-6">
//           <Link to="/login" className="text-blue-700 font-bold hover:underline">Log in</Link>
//           <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold hover:from-purple-600 hover:to-blue-700 transition">Sign Up</Link>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto pt-32 pb-24 px-6">
//         {/* HERO SECTION */}
//         <section className="flex flex-col-reverse lg:flex-row gap-12 items-center mb-20">
//           <div className="flex-1">
//             <h1 className="text-5xl font-extrabold mb-7 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
//               Effortless Review Collection & Customer Engagement
//             </h1>
//             <p className="text-xl mb-7 text-slate-700">
//               ScanQRGo empowers brands and sellers to boost reviews, collect leads, and reward buyers with just a scan.
//               <br /> <span className="font-semibold">From unboxing to happy review—inspired by the world's top D2C brands.</span>
//             </p>
//             <div className="flex space-x-4">
//               <Link to="/register" className="px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-blue-600 transition">
//                 Get Started Free
//               </Link>
//               <a href="#how-it-works" className="px-7 py-3 rounded-full border-2 font-semibold text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white transition">
//                 Learn More
//               </a>
//             </div>
//           </div>
//           <div className="flex-1 flex justify-center lg:justify-end">
//             <HeroSVG />
//           </div>
//         </section>

//         {/* PROBLEM & SOLUTION */}
//         <section id="solution" className="mb-24">
//           <div className="flex flex-col md:flex-row gap-12">
//             <div className="md:w-1/2">
//               <h2 className="text-2xl font-bold mb-4 text-blue-700">Frequent Seller Challenges</h2>
//               <ul className="space-y-4 text-lg">
//                 <li>❌ <b>Low Review Rates:</b> Most buyers never leave reviews, slowing your growth.</li>
//                 <li>❌ <b>No Direct Customer Contact:</b> Marketplaces keep buyers hidden—no way to follow up.</li>
//                 <li>❌ <b>Manual Rewards & Paper Coupons:</b> Painful to track, easy to ignore, easy to fake.</li>
//                 <li>❌ <b>No Post-Sale Automation:</b> Lost opportunity for upsells and real feedback.</li>
//               </ul>
//             </div>
//             <div className="md:w-1/2">
//               <h2 className="text-2xl font-bold mb-4 text-purple-700">How <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">ScanQRGo</span> Helps You</h2>
//               <ul className="space-y-4 text-lg">
//                 <li>✅ <b>One Scan, All Automated:</b> Customer scans your product QR, everything else happens for you.</li>
//                 <li>✅ <b>Collect Verified Reviews Effortlessly:</b> Smart funnel rewards only satisfied buyers who review.</li>
//                 <li>✅ <b>Grow Your Lead List:</b> Instantly capture real names, emails, and optional phone numbers.</li>
//                 <li>✅ <b>Instant Rewards & Coupons:</b> Gift cards, discounts, product freebies—delivered automatically or manually.</li>
//                 <li>✅ <b>Performance Analytics:</b> Track scans, completions, reviews, redemptions, conversion rates in one dashboard.</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section id="how-it-works" className="mb-20">
//           <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">
//             How Does ScanQRGo Work?
//           </h2>
//           <div className="grid md:grid-cols-4 gap-10 max-w-5xl mx-auto">
//             <div className="bg-white shadow-lg rounded-xl p-7 flex flex-col items-center">
//               <div className="text-4xl mb-3">📥</div>
//               <h3 className="text-xl font-semibold mb-2">1. Add Your Products</h3>
//               <p className="text-slate-600 text-center">List your SKUs, ASINs, or marketplace links. No limits—manage all products in one place.</p>
//             </div>
//             <div className="bg-white shadow-lg rounded-xl p-7 flex flex-col items-center">
//               <div className="text-4xl mb-3">🎁</div>
//               <h3 className="text-xl font-semibold mb-2">2. Set Up Your Promotion</h3>
//               <p className="text-slate-600 text-center">Select what to offer: gift cards, discount codes, free products, or custom rewards.</p>
//             </div>
//             <div className="bg-white shadow-lg rounded-xl p-7 flex flex-col items-center">
//               <div className="text-4xl mb-3">🚀</div>
//               <h3 className="text-xl font-semibold mb-2">3. Launch a Campaign</h3>
//               <p className="text-slate-600 text-center">Select products & reward, generate a QR code, add it to packaging or email. That's it!</p>
//             </div>
//             <div className="bg-white shadow-lg rounded-xl p-7 flex flex-col items-center">
//               <div className="text-4xl mb-3">⭐</div>
//               <h3 className="text-xl font-semibold mb-2">4. Get Reviews & Leads</h3>
//               <p className="text-slate-600 text-center">Buyers scan, complete funnel, get reward, and leave reviews on Amazon or your site—while you collect real customer data.</p>
//             </div>
//           </div>
//         </section>

//         {/* FEATURES */}
//         <section id="features" className="mb-24">
//           <h2 className="text-3xl font-bold text-center mb-12 text-purple-700">Features You'll Love</h2>
//           <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
//             <div className="flex space-x-5 items-start">
//               <div className="text-3xl">🔒</div>
//               <div>
//                 <h4 className="font-semibold text-lg">Privacy-Safe & Marketplace-Compliant</h4>
//                 <p className="text-slate-700">
//                   No fake reviews, no black-hat tricks. Only real, policy-compliant feedback from real buyers.
//                 </p>
//               </div>
//             </div>
//             <div className="flex space-x-5 items-start">
//               <div className="text-3xl">⚡</div>
//               <div>
//                 <h4 className="font-semibold text-lg">Lightning Fast Setup</h4>
//                 <p className="text-slate-700">Set up your first campaign in under 2 minutes, no tech knowledge needed.</p>
//               </div>
//             </div>
//             <div className="flex space-x-5 items-start">
//               <div className="text-3xl">📊</div>
//               <div>
//                 <h4 className="font-semibold text-lg">Instant Analytics</h4>
//                 <p className="text-slate-700">See performance at a glance: funnel scans, completions, redemptions, reviews, and conversion ratios.</p>
//               </div>
//             </div>
//             <div className="flex space-x-5 items-start">
//               <div className="text-3xl">🛡️</div>
//               <div>
//                 <h4 className="font-semibold text-lg">Flexible & Secure</h4>
//                 <p className="text-slate-700">No limits on team members or products. Data is protected with enterprise-grade encryption.</p>
//               </div>
//             </div>
//             <div className="flex space-x-5 items-start">
//               <div className="text-3xl">🔗</div>
//               <div>
//                 <h4 className="font-semibold text-lg">Integrates With Your Workflow</h4>
//                 <p className="text-slate-700">Download leads, connect campaigns to email, export reviews for further action, and more.</p>
//               </div>
//             </div>
//             <div className="flex space-x-5 items-start">
//               <div className="text-3xl">🌈</div>
//               <div>
//                 <h4 className="font-semibold text-lg">Customizable Branding</h4>
//                 <p className="text-slate-700">Make each public funnel page match your shop with custom logos, colors, and unique messages for every campaign.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CALL TO ACTION */}
//         <section id="cta" className="relative mb-32">
//           <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white rounded-3xl shadow-xl p-12 flex flex-col items-center gap-7">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center drop-shadow">
//               Start Collecting Reviews & Customers Today
//             </h2>
//             <div className="text-lg font-medium mb-6 text-center max-w-2xl">
//               Join <span className="font-bold">modern e-commerce sellers</span> who use ScanQRGo to increase reviews, lower support costs, and build customer relationships that win repeat business.
//             </div>
//             <Link to="/register" className="bg-white text-blue-700 px-8 py-4 rounded-full font-extrabold text-xl shadow-lg hover:bg-blue-50 hover:text-blue-900 transition">
//               Sign Up Free &rarr;
//             </Link>
//             <div className="mt-5 text-base font-medium text-white/90">
//               No credit card required. Cancel anytime.
//             </div>
//           </div>
//         </section>

//         {/* CONTACT / ABOUT */}
//         <footer id="contact" className="max-w-4xl mx-auto border-t pt-14 mt-20 pb-8 text-center text-slate-600">
//           <h3 className="text-lg font-semibold mb-3">About ScanQRGo</h3>
//           <p className="mb-7">
//             ScanQRGo is built by e-commerce professionals for sellers who want honest reviews, more loyal buyers, and growth without stress.
//             <br />
//             We're passionate about empowering you to <span className="text-blue-700 font-semibold">grow direct customer relationships</span> in the marketplace era.
//           </p>
//           <div className="flex flex-col md:flex-row items-center justify-center gap-5 text-base">
//             <span>&copy; {new Date().getFullYear()} ScanQRGo. All rights reserved.</span>
//             <span className="hidden md:inline">|</span>
//             <span>
//               Contact:{" "}
//               <a href="mailto:hello@scanqrgo.com" className="text-blue-700 hover:underline">
//                 hello@scanqrgo.com
//               </a>
//             </span>
//           </div>
//           <div className="mt-4 flex space-x-6 justify-center text-xl">
//             <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">🐦</a>
//             <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">💼</a>
//             <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black">💻</a>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// }
