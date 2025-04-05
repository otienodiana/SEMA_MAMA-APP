import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
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
        <h1>{t('settings.title')}</h1>
        
        {/* Language Selection */}
        <div>
          <label>{t('settings.language')}</label>
          <select value={language} onChange={handleLanguageChange} style={{ padding: "8px", marginLeft: "10px" }}>
            <option value="English">{t('settings.languageOptions.english')}</option>
            <option value="Swahili">{t('settings.languageOptions.swahili')}</option>
            <option value="French">{t('settings.languageOptions.french')}</option>
          </select>
        </div>

        {/* Avatar Upload */}
        <div style={{ marginTop: "20px" }}>
          <label>{t('settings.avatar')}</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatar && <img src={avatar} alt={t('settings.avatar')} style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }} />}
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ marginTop: "20px" }}>
          <label>{t('settings.darkMode')}</label>
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} style={{ marginLeft: "10px" }} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
