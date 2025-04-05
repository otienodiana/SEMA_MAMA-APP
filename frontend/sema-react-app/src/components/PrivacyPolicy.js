import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = ({ onClose, onAccept }) => {
  return (
    <div className="privacy-policy-modal">
      <div className="privacy-policy-content">
        <h2>Privacy Policy</h2>
        <div className="policy-text">
          <p>Welcome to SEMA MAMA. We are committed to protecting your privacy.</p>
          
          <h3>Information We Collect</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Healthcare provider credentials (if applicable)</li>
            <li>Usage data and interactions with our platform</li>
          </ul>

          <h3>How We Use Your Information</h3>
          <ul>
            <li>To provide and improve our services</li>
            <li>To communicate with you about our services</li>
            <li>To protect the security of our platform</li>
          </ul>

          <h3>Data Protection</h3>
          <p>We implement security measures to protect your personal information.</p>
        </div>
        
        <div className="privacy-policy-actions">
          <button className="accept-button" onClick={onAccept}>
            Accept
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
