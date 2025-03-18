import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Register.css";

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
  const navigate = useNavigate(); // Initialize navigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(); // Using FormData to handle file uploads

    // Append data to FormData
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phoneNumber);
    formData.append("role", role);
    formData.append("age", age);
    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto); // Append profile photo if selected
    }

    try {
      const response = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration response:", errorData);
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">{t('register.title')}</h2>

      {error && <p className="error-message">{t('register.error')}</p>}
      {success && <p className="success-message">{t('register.success')}</p>}

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
            className="form-input"
          />
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

        <div className="form-group">
          <label className="role-label">{t('register.role')}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="mom">{t('register.role.mom')}</option>
            <option value="healthcare_provider">{t('register.role.provider')}</option>
            <option value="admin">{t('register.role.admin')}</option>
          </select>
        </div>

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

        <button type="submit" className="submit-button">
          {t('register.button')}
        </button>
      </form>
    </div>
  );
}

export default Register;
