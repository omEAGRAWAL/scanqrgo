// // import React from "react";
// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   Navigate,
// // } from "react-router-dom";

// // import Navbar from "./components/Navbar"; // Add this import

// // import Register from "./pages/Register";
// // import Login from "./pages/Login";
// // import Home from "./pages/Home";
// // import Products from "./pages/Products";
// // import CreateProduct from "./pages/CreateProduct";
// // import EditProduct from "./pages/EditProduct";
// // import ProductDetail from "./pages/ProductDetail";
// // import Promotions from "./pages/Promotions";
// // import CreatePromotion from "./pages/CreatePromotion";
// // import EditPromotion from "./pages/EditPromotion";
// // import PromotionDetail from "./pages/PromotionDetail";
// // import Campaigns from "./pages/Campaigns";
// // import CreateCampaign from "./pages/CreateCampaign";
// // import EditCampaign from "./pages/EditCampaign";
// // import CampaignDetail from "./pages/CampaignDetail";
// // import PublicCampaignForm from "./pages/PublicCampaignForm";
// // import LandingPage from "./pages/LandingPage"; // Import your landing page
// // function App() {
// //   return (
// //     <Router>
// //       <div className="min-h-screen bg-gray-50">
// //         <Navbar /> {/* Add the navbar here */}
// //         <Routes>
// //           {/* Protected Routes */}
// //           <Route
// //             path="/home"
// //             element={
// //               <RequireAuth>
// //                 <Home />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/products"
// //             element={
// //               <RequireAuth>
// //                 <Products />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/products/create"
// //             element={
// //               <RequireAuth>
// //                 <CreateProduct />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/products/:id"
// //             element={
// //               <RequireAuth>
// //                 <ProductDetail />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/products/:id/edit"
// //             element={
// //               <RequireAuth>
// //                 <EditProduct />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/promotions"
// //             element={
// //               <RequireAuth>
// //                 <Promotions />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/promotions/create"
// //             element={
// //               <RequireAuth>
// //                 <CreatePromotion />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/promotions/:id"
// //             element={
// //               <RequireAuth>
// //                 <PromotionDetail />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/promotions/:id/edit"
// //             element={
// //               <RequireAuth>
// //                 <EditPromotion />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/campaigns"
// //             element={
// //               <RequireAuth>
// //                 <Campaigns />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/campaigns/create"
// //             element={
// //               <RequireAuth>
// //                 <CreateCampaign />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/campaigns/:id"
// //             element={
// //               <RequireAuth>
// //                 <CampaignDetail />
// //               </RequireAuth>
// //             }
// //           />
// //           <Route
// //             path="/campaigns/:id/edit"
// //             element={
// //               <RequireAuth>
// //                 <EditCampaign />
// //               </RequireAuth>
// //             }
// //           />

// //           {/* Public Routes */}
// //           <Route path="/campaign/:id" element={<PublicCampaignForm />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/" element={<LandingPage />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // // Simple auth check for protected pages
// // function RequireAuth({ children }) {
// //   const token = localStorage.getItem("token");
// //   if (!token) {
// //     return <Navigate to="/login" />;
// //   }
// //   return children;
// // }

// // export default App;

// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import DashboardLayout from "./components/DashboardLayout";
// import PublicLayout from "./components/PublicLayout";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import CreateProduct from "./pages/CreateProduct";
// import EditProduct from "./pages/EditProduct";
// import ProductDetail from "./pages/ProductDetail";
// import Promotions from "./pages/Promotions";
// import CreatePromotion from "./pages/CreatePromotion";
// import EditPromotion from "./pages/EditPromotion";
// import PromotionDetail from "./pages/PromotionDetail";
// import Campaigns from "./pages/Campaigns";
// import CreateCampaign from "./pages/CreateCampaign";
// import EditCampaign from "./pages/EditCampaign";
// import CampaignDetail from "./pages/CampaignDetail";
// import PublicCampaignForm from "./pages/PublicCampaignForm";
// import LandingPage from "./pages/LandingPage";
// import { API_URL } from "./config/api";
// import TermsAndConditions from "./pages/T&C";
// import AdminUsers from "./pages/AdminUsers";
// import Profile from "./pages/Profile";
// import { Analytics } from "@vercel/analytics/react";

// function RequireAuth({ children }) {
//   const token = localStorage.getItem("token");
//   const location = useLocation();
//   if (!token)
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   return children;
// }

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setUser(null);
//       return;
//     }
//     (async () => {
//       try {
//         const res = await fetch(`${API_URL}/users/profile`, {
//           headers: { Authorization: `${token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch user profile");
//         const data = await res.json();
//         setUser(data);
//       } catch (e) {
//         setUser(null);
//         console.error(e);
//       }
//     })();
//   }, []);

//   return (
//     <Routes>
//       {/* Public root with old navbar */}
//       <Route element={<PublicLayout />}>
//         <Route path="/" element={<LandingPage />} />
//       </Route>

//       {/* Other public routes (no navbar) */}
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/campaign/:id" element={<PublicCampaignForm />} />

//       {/* Private dashboard with left nav */}
//       <Route element={<DashboardLayout user={user} />}>
//         <Route
//           path="/home"
//           element={
//             <RequireAuth>
//               <Home />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <RequireAuth>
//               <Profile />
//             </RequireAuth>
//           }
//         />

//         <Route
//           path="/products"
//           element={
//             <RequireAuth>
//               <Products />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/products/create"
//           element={
//             <RequireAuth>
//               <CreateProduct />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/admin/users"
//           element={
//             <RequireAuth>
//               <AdminUsers />
//             </RequireAuth>
//           }
//         />

//         <Route
//           path="/products/:id"
//           element={
//             <RequireAuth>
//               <ProductDetail />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/products/:id/edit"
//           element={
//             <RequireAuth>
//               <EditProduct />
//             </RequireAuth>
//           }
//         />

//         <Route
//           path="/promotions"
//           element={
//             <RequireAuth>
//               <Promotions />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/promotions/create"
//           element={
//             <RequireAuth>
//               <CreatePromotion />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/promotions/:id"
//           element={
//             <RequireAuth>
//               <PromotionDetail />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/promotions/:id/edit"
//           element={
//             <RequireAuth>
//               <EditPromotion />
//             </RequireAuth>
//           }
//         />

//         <Route
//           path="/campaigns"
//           element={
//             <RequireAuth>
//               <Campaigns />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/campaigns/create"
//           element={
//             <RequireAuth>
//               <CreateCampaign />
//             </RequireAuth>
//           }
//         />

//         <Route
//           path="/campaigns/:id"
//           element={
//             <RequireAuth>
//               <CampaignDetail />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/campaigns/:id/edit"
//           element={
//             <RequireAuth>
//               <EditCampaign />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/tc"
//           element={
//             // <RequireAuth>
//             <TermsAndConditions />
//             // </RequireAuth>
//           }
//         />
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import PublicLayout from "./components/PublicLayout";
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
import LandingPage from "./pages/LandingPage";
import { API_URL } from "./config/api";
import TermsAndConditions from "./pages/T&C";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
        console.error(e);
      }
    })();
  }, []);

  return (
    <>
      <Routes>
        {/* Public root with old navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Other public routes (no navbar) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaign/:id" element={<PublicCampaignForm />} />

        {/* Private dashboard with left nav */}
        <Route element={<DashboardLayout user={user} />}>
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
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
            path="/admin/users"
            element={
              <RequireAuth>
                <AdminUsers />
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
          <Route
            path="/tc"
            element={
              // <RequireAuth>
              <TermsAndConditions />
              // </RequireAuth>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Vercel Analytics added here */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
