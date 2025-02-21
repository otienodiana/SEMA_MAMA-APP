import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.access); // Store token for future requests
        setSuccess("Login successful!");
        console.log("Login successful:", data);
      } else {
        setError(data.error || "Invalid username or password!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(239, 245, 254, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "500px",
        padding: "20px",
        maxWidth: "738px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#102851" }}>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
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
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
