import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const isAuthenticated = localStorage.getItem("userToken"); // Check if user is logged in

  return (
    <div style={{
      background: "linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "50px"
    }}>
     

      {/* Hero Section */}
      <section style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "600", color: "#102851", lineHeight: "1.5" }}>
          Welcome to SEMA MAMA APP
        </h1>
        <p style={{ fontSize: "20px", color: "rgba(92, 97, 105, 1)", marginTop: "20px" }}>
          We are here to talk, listen, and feel your emotions.
        </p>
        <p style={{ fontSize: "24px", color: "#333", marginTop: "20px" }}>
          Join a community of mothers & experts for guidance, support, and health resources.
        </p>
        {!isAuthenticated && (
          <Link to="/register">
            <button style={{
              backgroundColor: "#102851",
              color: "white",
              border: "none",
              padding: "12px 24px",
              fontSize: "18px",
              borderRadius: "5px",
              marginTop: "20px",
              cursor: "pointer"
            }}>
              Join Now
            </button>
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
