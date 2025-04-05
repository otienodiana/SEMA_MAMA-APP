import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      id: "testimonial1",
      text: "Sema Mama has been a game-changer for me. It's more than just a forum — it's a family, a place where I feel heard and supported in my motherhood journey.",
      author: "Sarah",
      role: "Mother of 2",
      initials: "SA"
    },
    {
      id: "testimonial2",
      text: "The support I've received here during my pregnancy journey has been incredible. The healthcare providers are so responsive and caring. I feel much more confident now.",
      author: "Janet",
      role: "Mother-to-be",
      initials: "JM"
    },
    {
      id: "testimonial3",
      text: "As a first-time mom, I had so many questions. The community here is amazing - always ready to share experiences and advice. It's like having a village of supportive mothers.",
      author: "Lisa",
      role: "First-time Mom",
      initials: "LW"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      fontFamily: "Arial, sans-serif", 
      padding: "0", 
      backgroundColor: "#E3F2FD",
      marginTop: "100px" // Add margin to push content down from navbar
    }}>
      
      {/* Hero Section */}
      <section style={{ padding: "80px 20px", backgroundColor: "#0072C6", color: "white", textAlign: "center" }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: "bold", 
          marginBottom: "20px",
          color: "#FFFFFF"  // Changed to white
        }}>{t('about.title')}</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "auto", marginBottom: "30px" }}>
          {t('about.subtitle')}
        </p>
        <Link to="/create-forum">
          
        </Link>
      </section>

      {/* Mission Statement */}
      <section style={{ 
        textAlign: "center", 
        padding: "60px 20px", 
        backgroundColor: "#0072C6", // Changed to match testimonials blue
        borderTop: "10px solid rgb(134, 186, 223)", 
        borderBottom: "10px solid #0072C6" 
      }}>
        <h2 style={{ 
          color: "#FFFFFF", // Changed to white
          fontSize: "2.5rem", 
          fontWeight: "600", 
          marginBottom: "20px" 
        }}>{t('about.mission')}</h2>
        <p style={{ 
          fontSize: "1.2rem", 
          maxWidth: "800px", 
          margin: "auto", 
          color: "#FFFFFF" // Changed to white
        }}>
          {t('about.missionText')}
        </p>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        padding: "60px 20px", 
        backgroundColor: "#0072C6",
        textAlign: "center" 
      }}>
        <h2 style={{ 
          color: "#FFFFFF",
          fontSize: "2.5rem", 
          fontWeight: "600", 
          marginBottom: "30px" 
        }}>{t('about.howItWorks')}</h2>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "40px",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {['community', 'support', 'expert'].map((card, index) => (
            <div 
              key={card}
              style={{ 
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                maxWidth: "300px",
                flex: "1",
                minWidth: "250px",
                animation: "float 6s ease-in-out infinite",
                animationDelay: `${index * 2}s`
              }}
            >
              <h3 style={{ color: "#0072C6" }}>{t(`about.cards.${card}.title`)}</h3>
              <p style={{ color: "#6C757D" }}>{t(`about.cards.${card}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: "50px 20px", backgroundColor: "#FFFFFF", textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#0072C6", fontSize: "2.5rem", fontWeight: "600", marginBottom: "40px" }}>
          {t('about.testimonials')}
        </h2>
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
          <div style={{ 
            opacity: 1,
            transition: 'opacity 0.5s ease-in-out'
          }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                borderRadius: "50%", 
                backgroundColor: "#E3F2FD", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "2rem",
                color: "#0072C6",
                border: "3px solid #0072C6"
              }}>
                {testimonials[currentTestimonialIndex].initials}
              </div>
            </div>
            <p style={{ fontSize: "1.1rem", fontStyle: "italic", color: "#6C757D", marginBottom: "15px" }}>
              {testimonials[currentTestimonialIndex].text}
            </p>
            <p style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0072C6" }}>
              - {testimonials[currentTestimonialIndex].author}, {testimonials[currentTestimonialIndex].role}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: currentTestimonialIndex === index ? "#0072C6" : "#E3F2FD",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ 
        padding: "50px 20px", 
        backgroundColor: "#0072C6", // Changed from #BFD8FF to match the testimonials color
        textAlign: "center" 
      }}>
        <h2 style={{ 
          color: "#FFFFFF", // Changed from #0072C6 to white
          fontSize: "2.5rem", 
          fontWeight: "600", 
          marginBottom: "20px" 
        }}>{t('about.contact')}</h2>
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "20px", 
          color: "#FFFFFF" // Changed from #6C757D to white
        }}>{t('about.contactText')}</p>
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "10px",
          color: "#FFFFFF" // Changed to white
        }}>{t('about.email')} <a href="mailto:support@semamama.com" style={{ 
          color: "#E3F2FD", // Changed to light blue for better contrast
          textDecoration: "underline" 
        }}>support@semamama.com</a></p>
        <p style={{ 
          fontSize: "1.2rem", 
          color: "#FFFFFF" // Changed from #6C757D to white
        }}>{t('about.phone')} +123 456 7890</p>
      </section>
      
    </div>
  );
};

export default AboutUs;
