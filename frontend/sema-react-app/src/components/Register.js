import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("mom"); // Default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize navigate

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
        role, // ✅ Send role instead of is_healthcare_provider
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess("Registration successful! Redirecting to login...");
      console.log("Registration successful:", data);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(data.error || JSON.stringify(data)); // Show detailed errors
    }
  };

  return (
    <div style={{
      backgroundColor: "rgba(239, 245, 254, 1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "500px",
      padding: "20px",
      maxWidth: "738px",
      margin: "0 auto",
    }}>
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

        {/* ✅ Add a dropdown for selecting the user role */}
        <div style={{ marginBottom: "16px" }}>
          <label>Select your role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="mom">Mom</option>
            <option value="healthcare_provider">Healthcare Provider</option>
            <option value="admin">Admin</option>
          </select>
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
  );
}

export default Register;
