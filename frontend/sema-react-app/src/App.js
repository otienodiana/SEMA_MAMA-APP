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

function App() {
  return (
    <AuthProvider>
      <DataProvider> {/* ✅ Wrap the entire app with DataProvider */}
        <Router>
          <Routes>
            {/*  Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="resources" element={<Resources />} />
              <Route path="forums" element={<ForumList />} />
            </Route>

            {/*  Protected Routes (Require Authentication) */}
            <Route element={<RequireAuth />}>
              {/* ✅ Redirect "/dashboard" to "/dashboard/admin" */}
              <Route path="/dashboard" element={<Navigate to="/dashboard/admin" replace />} />

              {/*  Admin Dashboard */}
              <Route path="/dashboard/admin" element={<AdminDashboard />}>
                <Route index element={<Analytics />} />  {/* Default Page: Analytics */}
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="sms-setup" element={<SmsSetup />} />
                <Route path="logout" element={<Logout />} />

                {/*  Admin Access Only */}
                <Route element={<AllowedUser allowedRoles={["admin"]} />}>
                  <Route path="community" element={<Community />} />
                  <Route path="admin-community" element={<AdminCommunity />} />  {/* Changed from "admin/community" */}
                  <Route path="educational-contents" element={<EducationalContents />} />
                  <Route path="content/:id" element={<ContentDetail />} />
                </Route>
              </Route>

              {/*  Healthcare Provider Dashboard */}
              <Route path="/dashboard/provider" element={<ProviderDashboard />}>
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

              {/* ✅ Mom Dashboard */}
              <Route path="/dashboard/profile" element={<MomDashboard />}>
                <Route index element={<Profile />} /> {/* Default route */}
                <Route path="community" element={<Community />} />
                <Route path="resources" element={<Resources />} />
                <Route path="settings" element={<Settings />} />
                <Route path="appointments" element={<MomAppointments />} />
                <Route path="educational-contents" element={<EducationalContents />} />
                <Route path="logout" element={<Logout />} />
              </Route>

              {/* ✅ Forum Routes */}
              <Route path="community/forums/:forumId/posts" element={<ForumPosts />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/forums" element={<ForumList />} />
              <Route path="/community/*" element={<Community />} />
              <Route path="/dashboard/community" element={<Community />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;