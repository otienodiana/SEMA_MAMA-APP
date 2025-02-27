import React from "react";
import { Link } from "react-router-dom";
import "./HomePageStyles.css";
import Navbar from "./Navbar";  
import floatingImage1 from "../assets/dep1.jpg";
import floatingImage2 from "../assets/dep2.jpg";
import floatingImage3 from "../assets/dep3.jpg";



const HomePage = () => {
  const isAuthenticated = localStorage.getItem("userToken"); // Check if user is logged in

  return (
    <div className="home-container">
      {/* ✅ Add Navbar Here */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="title">Welcome to SEMA MAMA APP</h1>
        <p className="description">We are here to talk, listen, and feel your emotions.</p>
        <p className="highlight-text">
          Join a community of mothers & experts for guidance, support, and health resources.
        </p>

        {!isAuthenticated && <Link to="/register" className="join-button">Join Now</Link>}
      </section>

      {/* Floating Images with Descriptions */}
      <div className="image-container">
        <div className="image-box">
          <img src={floatingImage1} alt="Mother sharing advice" className="floating-image" />
          <p className="image-description">Mother sharing advice</p>
        </div>
        <div className="image-box">
          <img src={floatingImage2} alt="Community discussion" className="floating-image" />
          <p className="image-description">Community discussion</p>
        </div>
        <div className="image-box">
          <img src={floatingImage3} alt="Healthcare expert guidance" className="floating-image" />
          <p className="image-description">Healthcare expert guidance</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
