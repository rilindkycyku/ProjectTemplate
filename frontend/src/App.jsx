import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Public/Home";
import LogIn from "./Pages/Auth/LogIn";
import SignUp from "./Pages/Auth/SignUp";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import AboutUs from "./Pages/Public/AboutUs";
import ContactUs from "./Pages/Public/ContactUs";

import ProtectedRoute from "./Components/KontrolliAksesit/ProtectedRoute";
import ScrollToTop from "./Components/layout/ScrollToTop";
import NukKeniAkses from "./Components/ErrorPages/403";
import NukUGjet from "./Components/ErrorPages/404";
import "./App.css";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route 
          path="/Dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        {/* Error pages */}
        <Route path="/403" element={<NukKeniAkses />} />
        <Route path="*" element={<NukUGjet />} />
      </Routes>
    </div>
  );
}

export default App;
