import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const styles = {
    select: {
      padding: '8px 12px',
      border: '1px solid #008DC9',
      borderRadius: '4px',
      color: '#008DC9',
      marginLeft: '10px'
    }
  };

  return (
    <select 
      value={i18n.language} 
      onChange={changeLanguage}
      style={styles.select}
    >
      <option value="en">English</option>
      <option value="sw">Kiswahili</option>
      <option value="fr">Français</option>
    </select>
  );
};

export default LanguageSelector;
