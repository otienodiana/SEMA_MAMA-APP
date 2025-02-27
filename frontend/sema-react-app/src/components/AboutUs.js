import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "0", backgroundColor: "#f8f9fa" }}>
      
      {/* Hero Section */}
      <section style={{ padding: "80px 20px", backgroundColor: "#102851", color: "white", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "20px" }}>About Sema Mama</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto", marginBottom: "30px" }}>
          Empowering mothers through community, knowledge, and support. Every mother deserves a safe space to share, learn, and grow.
        </p>
        <Link to="/create-forum">
          <button style={{
            backgroundColor: "#FF8C00", color: "white", padding: "15px 30px", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer", transition: "background-color 0.3s ease"
          }} 
          onMouseEnter={e => e.target.style.backgroundColor = '#FF6A00'}
          onMouseLeave={e => e.target.style.backgroundColor = '#FF8C00'}
          >
            Join the Community
          </button>
        </Link>
      </section>

      {/* Mission Statement */}
      <section style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderTop: "10px solid #FF8C00", borderBottom: "10px solid #FF8C00" }}>
        <h2 style={{ color: "#102851", fontSize: "2.5rem", fontWeight: "600", marginBottom: "20px" }}>Our Mission</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto" }}>
          Sema Mama is dedicated to creating a supportive network where mothers can find expert advice, share experiences, and receive guidance in their motherhood journey.
        </p>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "60px 20px", backgroundColor: "#F4F6F9", textAlign: "center" }}>
        <h2 style={{ color: "#102851", fontSize: "2.5rem", fontWeight: "600", marginBottom: "30px" }}>How It Works</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "250px" }}>
            <h3 style={{ color: "#FF8C00" }}>Join a Community</h3>
            <p>Become a part of a vibrant community of mothers and experts.</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "250px" }}>
            <h3 style={{ color: "#FF8C00" }}>Get Real-Time Support</h3>
            <p>Chat and interact in forums to receive instant help and support.</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "250px" }}>
            <h3 style={{ color: "#FF8C00" }}>Access Expert Advice</h3>
            <p>Access valuable educational content on parenting and health.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: "50px 20px", backgroundColor: "#fff", textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#102851", fontSize: "2.5rem", fontWeight: "600", marginBottom: "20px" }}>What Our Members Say</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto", fontStyle: "italic" }}>
          "Sema Mama has been a game-changer for me. It’s more than just a forum — it's a family, a place where I feel heard and supported in my motherhood journey."
        </p>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "20px" }}>- Sarah, Mother of 2</p>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "50px 20px", backgroundColor: "#E7F0FF", textAlign: "center" }}>
        <h2 style={{ color: "#102851", fontSize: "2.5rem", fontWeight: "600", marginBottom: "20px" }}>Get in Touch</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>We'd love to hear from you! Reach out to us for any questions, support, or suggestions.</p>
        <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Email: <a href="mailto:support@semamama.com" style={{ color: "#102851", textDecoration: "underline" }}>support@semamama.com</a></p>
        <p style={{ fontSize: "1.2rem" }}>Phone: +123 456 7890</p>
      </section>
      
    </div>
  );
};

export default AboutUs;
