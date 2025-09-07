import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";
import rev from "../assets/Reviu_Logo.png";

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
            Authorization: `${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        console.log("User data:", data);
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
            {user.name + " "}
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
          
          {/* <span className="text-xl font-bold text-gray-900"></span> */}
          <img src={rev} alt="Reviu Logo" className="h-8 w-auto" />
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
