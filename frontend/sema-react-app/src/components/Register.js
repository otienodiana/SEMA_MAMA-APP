import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config';
import "./Register.css";
import PrivacyPolicy from './PrivacyPolicy';

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("mom"); // Default role
  const [age, setAge] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null); // New state for file upload
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Check if current path is admin route
  const isAdminRoute = window.location.pathname.includes('/admin/');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!acceptedPrivacyPolicy) {
      setError("Please accept the privacy policy to continue");
      return;
    }

<<<<<<< HEAD
    if (!username || !email || !password) {
      setError("Username, email and password are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("role", isAdminRoute ? "admin" : role);
    
    if (phoneNumber) formData.append("phone_number", phoneNumber.trim());
    if (age) formData.append("age", age);
    if (profilePhoto) formData.append("profile_photo", profilePhoto);  

=======
>>>>>>> ce9985fb06e6a37a56a4eeac647c9fad339dc188
    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append('username', username.trim());
      formData.append('email', email.trim());
      formData.append('password', password);
      formData.append('role', isAdminRoute ? "admin" : role);
      
      if (phoneNumber) formData.append('phone_number', phoneNumber.trim());
      if (age) formData.append('age', age);
      if (profilePhoto) formData.append('profile_photo', profilePhoto);

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
        formData,
        {
<<<<<<< HEAD
=======
          headers: {
            'Content-Type': 'multipart/form-data',
          },
>>>>>>> ce9985fb06e6a37a56a4eeac647c9fad339dc188
          withCredentials: true
        }
      );
      

      if (response.data) {
        setSuccess("Registration successful!");
        // Add a small delay before redirecting
        setTimeout(() => {
          navigate(isAdminRoute ? '/admin/login' : '/login');
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response?.data) {
        // Handle specific error messages from backend
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          // Handle field-specific errors
          const errors = Object.entries(err.response.data)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          errorMessage = errors;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">
          {isAdminRoute ? t('register.adminTitle') : t('register.title')}
        </h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleRegister} className="register-form" encType="multipart/form-data">
          <div className="form-group">
            <input
              type="text"
              placeholder={t('register.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder={t('register.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder={t('register.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`form-input ${password && password.length < 8 ? 'error' : ''}`}
            />
            {password && password.length < 8 && (
              <small className="error-text">Password must be at least 8 characters long</small>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder={t('register.phoneNumber')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Show role selection only for non-admin registration */}
          {!isAdminRoute && (
            <div className="form-group">
              <label className="role-label">{t('register.role')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="mom">{t('register.role.mom')}</option>
                <option value="healthcare_provider">{t('register.role.provider')}</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <input
              type="number"
              placeholder={t('register.age')}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="role-label">{t('register.profilePhoto')}</label>
            <input
              type="file"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              accept="image/*"
              className="form-input"
            />
          </div>

          <div className="form-group privacy-group">
            <label className="privacy-label">
              <input
                type="checkbox"
                checked={acceptedPrivacyPolicy}
                onChange={() => setShowPrivacyPolicy(true)}
              />
              I accept the {' '}
              <span 
                className="privacy-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacyPolicy(true);
                }}
              >
                Privacy Policy
              </span>
            </label>
          </div>

          <button type="submit" className="submit-button">
            {t('register.button')}
          </button>
        </form>

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
    </div>
  );
}

export default Register;
