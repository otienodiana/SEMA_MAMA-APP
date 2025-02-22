import React from 'react';

const AboutUs = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "50px", textAlign: "center", backgroundColor: "#F5F5F5" }}>
      
      {/* Hero Section */}
      <section style={{ padding: "40px", backgroundColor: "#102851", color: "white", borderRadius: "10px", marginBottom: "30px" }}>
        <h1>About Sema Mama</h1>
        <p style={{ fontSize: "18px", maxWidth: "800px", margin: "auto" }}>
          Empowering mothers through community, knowledge, and support. We believe every mother deserves a safe space to share, learn, and grow.
        </p>
      </section>

      {/* Mission Statement */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#102851" }}>Our Mission</h2>
        <p style={{ fontSize: "18px", maxWidth: "800px", margin: "auto" }}>
          Sema Mama is dedicated to creating a supportive network where mothers can find expert advice, share experiences, and receive guidance in their motherhood journey.
        </p>
      </section>

      {/* How It Works */}
      <section style={{ marginBottom: "40px", padding: "30px", backgroundColor: "white", borderRadius: "10px" }}>
        <h2 style={{ color: "#102851" }}>How It Works</h2>
        <p style={{ fontSize: "18px", maxWidth: "800px", margin: "auto" }}>
          - Join a community of mothers and experts  
          - Get real-time support through forums and chat  
          - Access valuable educational content on parenting and health  
        </p>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: "#E7F0FF", padding: "20px", borderRadius: "10px" }}>
        <h2 style={{ color: "#102851" }}>Get in Touch</h2>
        <p>Email: support@semamama.com</p>
        <p>Phone: +123 456 7890</p>
      </section>
      
    </div>
  );
};

export default AboutUs;
