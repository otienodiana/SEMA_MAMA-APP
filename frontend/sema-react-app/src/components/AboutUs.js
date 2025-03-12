import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "0", backgroundColor: "#E3F2FD" }}>
      
      {/* Hero Section */}
      <section style={{ padding: "80px 20px", backgroundColor: "#0072C6", color: "white", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "20px" }}>About Sema Mama</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto", marginBottom: "30px" }}>
          Empowering mothers through community, knowledge, and support. Every mother deserves a safe space to share, learn, and grow.
        </p>
        <Link to="/create-forum">
          
        </Link>
      </section>

      {/* Mission Statement */}
      <section style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#FFFFFF", borderTop: "10px solidrgb(134, 186, 223)", borderBottom: "10px solid #0072C6" }}>
        <h2 style={{ color: "#0072C6", fontSize: "2.5rem", fontWeight: "600", marginBottom: "20px" }}>Our Mission</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto", color: "#6C757D" }}>
          Sema Mama is dedicated to creating a supportive network where mothers can find expert advice, share experiences, and receive guidance in their motherhood journey.
        </p>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "60px 20px", backgroundColor: "#E3F2FD", textAlign: "center" }}>
        <h2 style={{ color: "#0072C6", fontSize: "2.5rem", fontWeight: "600", marginBottom: "30px" }}>How It Works</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "250px" }}>
            <h3 style={{ color: "#0072C6" }}>Join a Community</h3>
            <p style={{ color: "#6C757D" }}>Become a part of a vibrant community of mothers and experts.</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "250px" }}>
            <h3 style={{ color: "#0072C6" }}>Get Real-Time Support</h3>
            <p style={{ color: "#6C757D" }}>Chat and interact in forums to receive instant help and support.</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "250px" }}>
            <h3 style={{ color: "#0072C6" }}>Access Expert Advice</h3>
            <p style={{ color: "#6C757D" }}>Access valuable educational content on parenting and health.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: "50px 20px", backgroundColor: "#FFFFFF", textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#0072C6", fontSize: "2.5rem", fontWeight: "600", marginBottom: "20px" }}>What Our Members Say</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto", fontStyle: "italic", color: "#6C757D" }}>
          "Sema Mama has been a game-changer for me. It’s more than just a forum — it's a family, a place where I feel heard and supported in my motherhood journey."
        </p>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "20px", color: "#0072C6" }}>- Sarah, Mother of 2</p>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "50px 20px", backgroundColor: "#BFD8FF", textAlign: "center" }}>
        <h2 style={{ color: "#0072C6", fontSize: "2.5rem", fontWeight: "600", marginBottom: "20px" }}>Get in Touch</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#6C757D" }}>We'd love to hear from you! Reach out to us for any questions, support, or suggestions.</p>
        <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Email: <a href="mailto:support@semamama.com" style={{ color: "#0072C6", textDecoration: "underline" }}>support@semamama.com</a></p>
        <p style={{ fontSize: "1.2rem", color: "#6C757D" }}>Phone: +123 456 7890</p>
      </section>
      
    </div>
  );
};

export default AboutUs;
