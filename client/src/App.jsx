import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar"; // Add this import

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetail from "./pages/ProductDetail";
import Promotions from "./pages/Promotions";
import CreatePromotion from "./pages/CreatePromotion";
import EditPromotion from "./pages/EditPromotion";
import PromotionDetail from "./pages/PromotionDetail";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import EditCampaign from "./pages/EditCampaign";
import CampaignDetail from "./pages/CampaignDetail";
import PublicCampaignForm from "./pages/PublicCampaignForm";
import LandingPage from "./pages/LandingPage"; // Import your landing page
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar /> {/* Add the navbar here */}
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <Products />
              </RequireAuth>
            }
          />
          <Route
            path="/products/create"
            element={
              <RequireAuth>
                <CreateProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/products/:id"
            element={
              <RequireAuth>
                <ProductDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <RequireAuth>
                <EditProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/promotions"
            element={
              <RequireAuth>
                <Promotions />
              </RequireAuth>
            }
          />
          <Route
            path="/promotions/create"
            element={
              <RequireAuth>
                <CreatePromotion />
              </RequireAuth>
            }
          />
          <Route
            path="/promotions/:id"
            element={
              <RequireAuth>
                <PromotionDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/promotions/:id/edit"
            element={
              <RequireAuth>
                <EditPromotion />
              </RequireAuth>
            }
          />
          <Route
            path="/campaigns"
            element={
              <RequireAuth>
                <Campaigns />
              </RequireAuth>
            }
          />
          <Route
            path="/campaigns/create"
            element={
              <RequireAuth>
                <CreateCampaign />
              </RequireAuth>
            }
          />
          <Route
            path="/campaigns/:id"
            element={
              <RequireAuth>
                <CampaignDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/campaigns/:id/edit"
            element={
              <RequireAuth>
                <EditCampaign />
              </RequireAuth>
            }
          />

          {/* Public Routes */}
          <Route path="/campaign/:id" element={<PublicCampaignForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Simple auth check for protected pages
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default App;
