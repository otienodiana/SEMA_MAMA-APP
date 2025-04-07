import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AboutUs.css';

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
    <div className="about-container">
      <section className="hero-section">
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
      </section>

      <section className="mission-section">
        <h2>{t('about.mission')}</h2>
        <p>{t('about.missionText')}</p>
      </section>

      <section className="how-it-works-section">
        <h2>{t('about.howItWorks')}</h2>
        <div className="cards-grid">
          {['community', 'support', 'expert'].map((card) => (
            <div key={card} className="info-card">
              <h3>{t(`about.cards.${card}.title`)}</h3>
              <p>{t(`about.cards.${card}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>{t('about.testimonials')}</h2>
        <div className="testimonial-container">
          <div className="testimonial-avatar">
            {testimonials[currentTestimonialIndex].initials}
          </div>
          <p className="testimonial-text">
            {testimonials[currentTestimonialIndex].text}
          </p>
          <p className="testimonial-author">
            - {testimonials[currentTestimonialIndex].author}, 
            {testimonials[currentTestimonialIndex].role}
          </p>
        </div>
      </section>

      <section className="contact-section">
        <h2>{t('about.contact')}</h2>
        <p>{t('about.contactText')}</p>
        <div className="contact-info">
          {t('about.email')} 
          <a href="mailto:support@semamama.com">support@semamama.com</a>
        </div>
        <div className="contact-info">
          {t('about.phone')} +123 456 7890
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
