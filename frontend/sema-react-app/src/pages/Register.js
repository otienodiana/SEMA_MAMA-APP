import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PrivacyPolicy from '../components/PrivacyPolicy';
// ...existing imports...

const Register = () => {
  // ...existing state variables...
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedPrivacyPolicy) {
      alert("Please accept the privacy policy to continue");
      return;
    }
    // ...existing submit logic...
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* ...existing form fields... */}
        
        <div className="privacy-checkbox">
          <input
            type="checkbox"
            id="privacyPolicy"
            checked={acceptedPrivacyPolicy}
            onChange={() => setShowPrivacyPolicy(true)}
          />
          <label htmlFor="privacyPolicy">
            I accept the <span 
              className="privacy-link"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              Privacy Policy
            </span>
          </label>
        </div>

        <button type="submit" className="auth-button">
          Register
        </button>

        {/* ...existing bottom links... */}
      </div>

      {showPrivacyPolicy && (
        <PrivacyPolicy
          onClose={() => setShowPrivacyPolicy(false)}
          onAccept={() => {
            setAcceptedPrivacyPolicy(true);
            setShowPrivacyPolicy(false);
          }}
        />
      )}
    </div>
  );
};

export default Register;
