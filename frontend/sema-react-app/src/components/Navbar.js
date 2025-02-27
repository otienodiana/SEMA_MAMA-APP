import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Ensure Navbar styles are applied

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">SEMA MAMA</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/community" className="nav-link">Community</Link>
        <Link to="/resources" className="nav-link">Resources</Link>
      </div>
      
    </nav>
  );
};

export default Navbar;
