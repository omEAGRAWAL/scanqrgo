// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Don't show navbar on auth pages
//   const hideNavbarRoutes = ["/login", "/register"];
//   const isPublicCampaignRoute = location.pathname.startsWith("/campaign/");

//   if (hideNavbarRoutes.includes(location.pathname) || isPublicCampaignRoute) {
//     return null;
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     navigate("/login");
//   }

//   function isActive(path) {
//     return location.pathname.startsWith(path);
//   }

//   return (
//     <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2">
//               <div className="text-2xl">📱</div>
//               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 ScanQRGo
//               </span>
//             </Link>
//           </div>

//           {/* Navigation Links */}
//           {token && (
//             <div className="hidden md:flex items-center space-x-1">
//               <Link
//                 to="/"
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   location.pathname === "/"
//                     ? "bg-blue-100 text-blue-700"
//                     : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Dashboard
//               </Link>

//               <Link
//                 to="/products"
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   isActive("/products")
//                     ? "bg-green-100 text-green-700"
//                     : "text-gray-700 hover:text-green-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Products
//               </Link>

//               <Link
//                 to="/promotions"
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   isActive("/promotions")
//                     ? "bg-purple-100 text-purple-700"
//                     : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Promotions
//               </Link>

//               <Link
//                 to="/campaigns"
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   isActive("/campaigns")
//                     ? "bg-indigo-100 text-indigo-700"
//                     : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Campaigns
//               </Link>
//             </div>
//           )}

//           {/* User Actions */}
//           {token ? (
//             <div className="flex items-center space-x-3">
//               {/* Quick Actions Dropdown */}
//               <div className="hidden md:flex items-center space-x-2">
//                 <Link
//                   to="/campaigns/create"
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
//                 >
//                   + New Campaign
//                 </Link>
//               </div>

//               {/* User Menu */}
//               <div className="relative">
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                     />
//                   </svg>
//                   <span className="hidden sm:block">Logout</span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-3">
//               <Link
//                 to="/login"
//                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-colors"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//               >
//                 Register
//               </Link>
//             </div>
//           )}

//           {/* Mobile Menu Button */}
//           {token && (
//             <div className="md:hidden">
//               <button
//                 className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                 onClick={() => {
//                   // Toggle mobile menu - you can implement this state if needed
//                   console.log("Mobile menu toggle");
//                 }}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Menu - You can expand this with state management */}
//       <div className="md:hidden bg-white border-t">
//         <div className="px-2 pt-2 pb-3 space-y-1">
//           <Link
//             to="/"
//             className={`block px-3 py-2 rounded-lg font-medium ${
//               location.pathname === "/"
//                 ? "bg-blue-100 text-blue-700"
//                 : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
//             }`}
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/products"
//             className={`block px-3 py-2 rounded-lg font-medium ${
//               isActive("/products")
//                 ? "bg-green-100 text-green-700"
//                 : "text-gray-700 hover:text-green-600 hover:bg-gray-100"
//             }`}
//           >
//             Products
//           </Link>
//           <Link
//             to="/promotions"
//             className={`block px-3 py-2 rounded-lg font-medium ${
//               isActive("/promotions")
//                 ? "bg-purple-100 text-purple-700"
//                 : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
//             }`}
//           >
//             Promotions
//           </Link>
//           <Link
//             to="/campaigns"
//             className={`block px-3 py-2 rounded-lg font-medium ${
//               isActive("/campaigns")
//                 ? "bg-indigo-100 text-indigo-700"
//                 : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
//             }`}
//           >
//             Campaigns
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // Fetch user info on mount & when token changes
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: {
            // Usually APIs expect "Bearer <token>" for Authorization header
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setUser(null);
      }
    }

    fetchUser();
  }, [token]);

  const hideNavbarRoutes = ["/login", "/register"];
  const isPublicCampaignRoute = location.pathname.startsWith("/campaign/");
  if (hideNavbarRoutes.includes(location.pathname) || isPublicCampaignRoute) {
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setMenuOpen(false);
    setUser(null);
    navigate("/login");
  }

  const authLinks = (
    <ul className="flex flex-col md:flex-row md:items-center md:space-x-8">
      <li>
        <Link
          to="/home"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/products"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Products
        </Link>
      </li>
      <li>
        <Link
          to="/promotions"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Promotions
        </Link>
      </li>
      <li>
        <Link
          to="/campaigns"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Campaigns
        </Link>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className="w-full text-left nav-link text-red-600 md:text-red-500 md:ml-2"
        >
          Logout
        </button>
      </li>
      {user && (
        <li className="border-t border-gray-100 mt-3 pt-3 md:border-none md:mt-0 md:pt-0">
          <span className="block text-sm font-semibold text-blue-800 truncate">
            {user.name}{" "}
            <span className="block text-xs text-gray-500 truncate">
              {user.email}
            </span>
          </span>
        </li>
      )}
    </ul>
  );

  const guestLinks = (
    <ul className="flex flex-col md:flex-row md:items-center md:space-x-8">
      <li>
        <a
          href="#how-it-works"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          How It Works
        </a>
      </li>
      <li>
        <a
          href="#features"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Why It Works
        </a>
      </li>
      <li>
        <a
          href="#testimonials"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Testimonials
        </a>
      </li>
      <li>
        <Link
          to="/login"
          className="nav-link"
          onClick={() => setMenuOpen(false)}
        >
          Login
        </Link>
      </li>
      <li>
        <Link
          to="/register"
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors mt-3 md:mt-0"
          onClick={() => setMenuOpen(false)}
        >
          Start Free
        </Link>
      </li>
    </ul>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl" role="img" aria-label="QR Code icon">
            📱
          </span>
          <span className="text-xl font-bold text-gray-900">ScanQRGo</span>
        </Link>
        {/* Desktop menu */}
        <nav className="hidden md:block">{token ? authLinks : guestLinks}</nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="block md:hidden bg-white border-t border-blue-100 shadow">
          <nav className="px-6 py-4">{token ? authLinks : guestLinks}</nav>
        </div>
      )}

      {/* Small nav-link style */}
      <style>{`
        .nav-link {
          display: block;
          padding: 0.75rem 0.5rem;
          color: #374151;
          font-weight: 500;
          border-radius: 0.5rem;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover {
          color: #2563eb;
          background-color: #f1f5f9;
        }
      `}</style>
    </header>
  );
}
