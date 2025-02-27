import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom"; // Renders the current page

const PublicLayout = () => {
  return (
    <>
      <Navbar /> {/* Fixed Navbar */}
      <Outlet /> {/* Dynamic content (Home, About, etc.) */}
    </>
  );
};

export default PublicLayout;
