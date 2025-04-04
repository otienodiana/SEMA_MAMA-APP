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

    // Validation logging
    console.log('Form Data:', {
      username,
      email,
      password: password ? '****' : 'missing',
      phoneNumber,
      role,
      age,
      hasProfilePhoto: !!profilePhoto,
      acceptedPrivacyPolicy
    });

    // Basic validation
    if (!username || !email || !password) {
      const missingFields = [];
      if (!username) missingFields.push('username');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      
      const errorMsg = `Required fields missing: ${missingFields.join(', ')}`;
      console.error('Validation Error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      console.log('Making registration request to:', `${API_BASE_URL}/api/users/register/`);

      const registrationData = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: isAdminRoute ? "admin" : role,
        ...(phoneNumber && { phone_number: phoneNumber.trim() }),
        ...(age && { age: parseInt(age, 10) })
      };

      console.log('Registration payload:', {
        ...registrationData,
        password: '****' // Hide password in logs
      });

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

      console.log('Server Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 201 || response.status === 200) {
        // Handle profile photo upload if exists
        if (profilePhoto && response.data.id) {
          console.log('Uploading profile photo for user:', response.data.id);
          const photoForm = new FormData();
          photoForm.append('profile_photo', profilePhoto);

          try {
            const photoResponse = await axios.patch(
              `${API_BASE_URL}/api/users/${response.data.id}/`,
              photoForm,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
            console.log('Photo upload response:', photoResponse.data);
          } catch (photoErr) {
            console.error('Photo upload failed:', photoErr);
            // Continue since main registration succeeded
          }
        }

        setSuccess("Registration successful!");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Registration Error Details:', {
        message: err.message,
        response: {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        },
        request: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });

      let errorMessage = 'Registration failed - ';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage += err.response.data;
        } else if (err.response.data.detail) {
          errorMessage += err.response.data.detail;
        } else if (typeof err.response.data === 'object') {
          errorMessage += Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
      } else {
        errorMessage += err.message || 'Unknown error occurred';
      }
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
