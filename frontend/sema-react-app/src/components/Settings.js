import React, { useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleAvatarChange = (e) => setAvatar(URL.createObjectURL(e.target.files[0]));

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: darkMode ? "#34495e" : "#ecf0f1", color: darkMode ? "white" : "black" }}>
        <h1>Settings</h1>
        
        {/* Language Selection */}
        <div>
          <label>Language: </label>
          <select value={language} onChange={handleLanguageChange} style={{ padding: "8px", marginLeft: "10px" }}>
            <option value="English">English</option>
            <option value="Swahili">Swahili</option>
          </select>
        </div>

        {/* Avatar Upload */}
        <div style={{ marginTop: "20px" }}>
          <label>Avatar: </label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatar && <img src={avatar} alt="Avatar Preview" style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }} />}
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ marginTop: "20px" }}>
          <label>Dark Mode: </label>
          <button onClick={toggleDarkMode} style={{ padding: "8px", marginLeft: "10px", background: darkMode ? "#f39c12" : "#3498db", color: "white", border: "none", cursor: "pointer" }}>
            {darkMode ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
