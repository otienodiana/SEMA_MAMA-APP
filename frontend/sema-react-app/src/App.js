import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import HomePage from "./components/HomePage";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import Register from "./components/Register";
import Resources from "./components/Resources";

import AdminDashboard from "./components/AdminDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import MomDashboard from "./components/MomDashboard";

import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Appointments from "./components/Appointments";
import Analytics from "./components/Analytics";
import SmsSetup from "./components/SmsSetup";
import EducationalContents from "./components/EducationalContents";
import Logout from "./components/Logout";
import Community from "./components/Community";
import AdminCommunity from "./components/AdminCommunity";
import ContentDetail from "./components/ContentDetail";
import ForumPosts from "./components/ForumPosts";  // ✅ Add this import

import RequireAuth from "./components/RequireAuth";
import AllowedUser from "./components/AllowedUser";
import { AuthProvider } from "./components/AuthContext";
import PostDetail from "./components/PostDetail";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="resources" element={<Resources />} />
          </Route>

          {/* ✅ Protected Routes (Require Authentication) */}
          <Route element={<RequireAuth />}>
            {/* ✅ Admin Dashboard */}
            <Route path="/dashboard/admin" element={<AdminDashboard />}>
              <Route index element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="sms-setup" element={<SmsSetup />} />
              <Route path="logout" element={<Logout />} />

              {/* ✅ Admin Access Only */}
              <Route element={<AllowedUser allowedRoles={["admin"]} />}>
                <Route path="community" element={<Community />} />
                <Route path="admin/community" element={<AdminCommunity />} />
                <Route path="educational-contents" element={<EducationalContents />} />
                <Route path="content/:id" element={<ContentDetail />} />
              </Route>
            </Route>

            {/* ✅ Healthcare Provider Dashboard */}
            <Route path="/dashboard/provider" element={<ProviderDashboard />}>
              <Route index element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="educational-contents" element={<EducationalContents />} />
              <Route path="content/:id" element={<ContentDetail />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            {/* ✅ Mom Dashboard */}
            <Route path="/dashboard/profile" element={<MomDashboard />}>
              <Route index element={<Community />} />
              <Route path="community" element={<Community />} /> 
              <Route path="resources" element={<Resources />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} /> 
              <Route path="educational-contents" element={<EducationalContents />} />
              <Route path="content/:id" element={<ContentDetail />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="logout" element={<Logout />} />
            </Route>
            <Route path="community/forums/:forumId/posts" element={<ForumPosts />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
