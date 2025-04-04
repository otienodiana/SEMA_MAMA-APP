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
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate(); // Initialize navigate

  // Check if current path is admin route
  const isAdminRoute = window.location.pathname.includes('/admin/');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!username || !email || !password) {
      setError("Username, email and password are required");
      setLoading(false);
      return;
    }

    try {
      // Create registration data
      const registrationData = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: isAdminRoute ? "admin" : role
      };

      // Add optional fields only if they have values
      if (phoneNumber) registrationData.phone_number = phoneNumber.trim();
      if (age) registrationData.age = age;

      // First, make the user registration request
      const response = await axios.post(
        `${API_BASE_URL}/api/users/register/`,
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Registration response:', response.data);

      // If registration successful and there's a profile photo, upload it
      if (response.status === 201 && profilePhoto) {
        const userId = response.data.id;
        const photoForm = new FormData();
        photoForm.append('profile_photo', profilePhoto);

        await axios.patch(
          `${API_BASE_URL}/api/users/${userId}/`,
          photoForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      setSuccess("Registration successful!");
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error('Registration error:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Registration failed - Please try again';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
        {loading && <p className="loading-message">Loading...</p>}

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

          <button type="submit" className="submit-button" disabled={loading}>
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
