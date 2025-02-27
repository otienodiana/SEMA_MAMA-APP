import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css"; // Import the CSS file

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isHealthcareProvider, setIsHealthcareProvider] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        phone_number: phoneNumber,
        is_healthcare_provider: isHealthcareProvider,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess("Registration successful! Redirecting to login...");
      console.log("Registration successful:", data);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(data.error || JSON.stringify(data));
    }
  };

  return (
    <div className="auth-container">
      <div className="register-box">
        <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#102851" }}>Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ padding: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isHealthcareProvider}
              onChange={(e) => setIsHealthcareProvider(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <label>Are you a healthcare provider?</label>
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(232, 240, 255, 1)",
              width: "100%",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              color: "#102851",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
