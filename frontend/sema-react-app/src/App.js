import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Appointments from './components/Appointments';
import Analytics from './components/Analytics';
import SmsSetup from './components/SmsSetup';
import EducationalContents from './components/EducationalContents';
import Logout from './components/Logout';
import Forum from "./components/Forum";
import DashboardHome from "./components/DashboardHome";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes wrapped with PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Dashboard Routes with Sidebar */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sms-setup" element={<SmsSetup />} />
          <Route path="forum" element={<Forum />} />
          <Route path="educational-contents" element={<EducationalContents />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
