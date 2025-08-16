import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar"; // your existing top navbar (Tailwind)

export default function PublicLayout() {
  const location = useLocation();
  // Show the old top navbar only on the exact root "/"
  const showNavbar = location.pathname === "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
