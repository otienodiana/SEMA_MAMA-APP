import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div style={{
      background: "linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)",
      minHeight: "100vh",
      textAlign: "center",
      padding: "50px"
    }}>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "1200px", marginBottom: "50px" }}>
        <h2 style={{ color: "#102851" }}>SEMA MAMA</h2>
        <ul style={{ display: "flex", listStyle: "none", gap: "20px", padding: 0 }}>
          <li><Link to="/" style={{ textDecoration: "none", color: "#102851" }}>Home</Link></li>
          <li><Link to="/about" style={{ textDecoration: "none", color: "#102851" }}>About</Link></li>
          <li><Link to="/login" style={{ textDecoration: "none", color: "#102851" }}>Login</Link></li>
          <li><Link to="/register" style={{ textDecoration: "none", color: "#102851" }}>Register</Link></li>
        </ul>
      </nav>

      {/* This will render the page content */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
