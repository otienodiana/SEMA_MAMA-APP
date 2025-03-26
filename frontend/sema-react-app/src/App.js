import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import HomePage from "./components/HomePage";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import Register from "./components/Register";
import Resources from "./components/Resources";
import MomAppointments from "./components/MomAppointments";
import AdminDashboard from "./components/AdminDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import MomDashboard from "./components/MomDashboard";
import { Navigate } from "react-router-dom"; 
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Appointments from "./components/Appointments";
import Analytics from "./components/Analytics";
import SmsSetup from "./components/Messages";
import EducationalContents from "./components/EducationalContents";
import Logout from "./components/Logout";
import Community from "./components/Community";
import AdminCommunity from "./components/AdminCommunity";
import ContentDetail from "./components/ContentDetail";
import ForumPosts from "./components/ForumPosts";
import PatientMessages from "./components/PatientMessages";
import RequireAuth from "./components/RequireAuth";
import AllowedUser from "./components/AllowedUser";
import { AuthProvider } from "./components/AuthContext";
import PostDetail from "./components/PostDetail";
import ProviderAppointments from "./components/ProviderAppointments";
import ForumList from './components/ForumList';
import { DataProvider } from "./components/DataContext"; 
import SelfAssessment from "./components/SelfAssessment";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from './components/UserManagement';
import AdminEducationalContents from './components/AdminEducationalContents';
import ForumDetail from './components/ForumDetail';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="login" element={<Login />} />
              <Route path="admin/login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="admin/register" element={<Register />} />
              <Route path="resources" element={<Resources />} />
            </Route>

            {/* Admin redirect */}
            <Route 
              path="/admin" 
              element={<Navigate to="/admin/login" replace />} 
            />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="dashboard/admin" element={<AdminDashboard />}>
                <Route index element={<Analytics />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="sms-setup" element={<SmsSetup />} />
                <Route path="logout" element={<Logout />} />
                <Route path="community" element={<AdminCommunity />} />
                <Route path="educational-contents" element={<AdminEducationalContents />} />
                <Route path="content/:id" element={<ContentDetail />} />
                <Route path="users/*" element={<UserManagement />} />
                <Route path="community/forums/:forumId" element={<ForumDetail />} />
              </Route>
            </Route>

            {/* Protected Provider Routes */}
            <Route element={<ProtectedRoute allowedRoles={["healthcare_provider"]} />}>
              <Route path="/dashboard/provider/*" element={<ProviderDashboard />}>
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="appointments" element={<ProviderAppointments />} />
                <Route path="educational-contents" element={<EducationalContents />} />
                <Route path="content/:id" element={<ContentDetail />} />
                <Route path="community/forums/:forumId/posts" element={<ForumPosts />} />
                <Route path="community" element={<Community />} />
                <Route path="messages" element={<PatientMessages />} />
                <Route path="settings" element={<Settings />} />
                <Route path="logout" element={<Logout />} />
              </Route>
            </Route>

            {/* Protected Mom Routes */}
            <Route element={<ProtectedRoute allowedRoles={["mom"]} />}>
              <Route path="/dashboard/profile/*" element={<MomDashboard />}>
                <Route index element={<Profile />} />
                <Route path="community" element={<Community />} />
                <Route path="educational-contents" element={<AdminEducationalContents />} />
                <Route path="settings" element={<Settings />} />
                <Route path="appointments" element={<MomAppointments />} />
                <Route path="self-assessment" element={<SelfAssessment />} />
                <Route path="logout" element={<Logout />} />
              </Route>
            </Route>

            {/* Protected Community Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/community/*" element={<Community />} />
              <Route path="/forums" element={<ForumList />} />
            </Route>

          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;