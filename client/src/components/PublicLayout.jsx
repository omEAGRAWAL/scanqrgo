import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Outlet />
    </>
  );
}
