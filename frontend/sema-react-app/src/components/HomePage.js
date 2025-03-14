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

        {!isAuthenticated && <Link to="/login" className="join-button">Join Now</Link>}
      </section>

      {/* Floating Images with Descriptions */}
      <div className="image-container">
        <div className="image-box">
          <img src={floatingImage1} alt="Mother sharing advice" className="floating-image" />
          <p className="image-description">Mother and Baby Corner</p>
        </div>
        <div className="image-box">
          <img src={floatingImage2} alt="Community discussion" className="floating-image" />
          <p className="image-description">Feeling Depressed</p>
        </div>
        <div className="image-box">
          <img src={floatingImage3} alt="Healthcare expert guidance" className="floating-image" />
          <p className="image-description">Baby Health</p>
        </div>
      </div>

      {/* ✅ YouTube Videos Section (Added Below the Images) */}
      <div className="video-section">
        <h2>HEALTH CORNER</h2>
        <div className="video-container">
          {/* Video 1 */}
          <div className="video-box">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/Zx8zbTMTncs"
              title="Contraceptives"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p>Contraceptives</p>
          </div>

          {/* Video 2 */}
          <div className="video-box">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/CBbYbOni_Kg"
              title="What is Postpartum?"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p>What Is Postpartum?</p>
          </div>

          {/* Video 3 */}
          <div className="video-box">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/3jYYT_rf7Sw"
              title="Breastfeeding Tips"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p>Breastfeeding Tips</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
