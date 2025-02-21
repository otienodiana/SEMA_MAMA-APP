import React from 'react';

const HomePage = () => {
  return (
    <div style={{
      backgroundColor: "linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)",
      paddingLeft: "80px",
      paddingTop: "99px",
      paddingBottom: "43px",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch"
    }}>
      {/* Hero Section */}
      <section style={{ display: "flex", flexDirection: "column", marginTop: "102px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "500", color: "#102851", lineHeight: "1.89", letterSpacing: "0.72px" }}>
          Welcome to SEMA MAMA APP
        </h1>
        <p style={{ fontSize: "20px", color: "rgba(92, 97, 105, 1)", marginTop: "133px" }}>
          We are to talk, listen, and feel your emotions
        </p>
        <p style={{ fontSize: "24px", color: "rgba(0, 0, 0, 1)", marginTop: "72px", textAlign: "center" }}>
          Join a community of mothers & experts for guidance, support, and health resources.
        </p>
        <button style={{
          backgroundColor: "rgba(232, 240, 255, 1)",
          width: "150px",
          height: "50px",
          marginTop: "72px",
        }}>
          Join Now
        </button>
      </section>

      {/* Image Section */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/da9739e375f142d6899159b05ba4abde/8a3fd9ff01e20e99927566be7e43c2ead07695af1d4d4a2ffdb6771685a99a4c?placeholderIfAbsent=true"
        alt="Pattern"
        style={{ width: "100%", height: "auto", objectFit: "contain" }}
      />
    </div>
  );
};

export default HomePage;
