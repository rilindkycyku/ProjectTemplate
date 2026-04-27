import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";

import ProtectedRoute from "./Components/layout/ProtectedRoute";
import ScrollToTop from "./Components/layout/ScrollToTop";
import FaturatPage from "./Pages/Faturat";
import BankatPage from "./Pages/Bankat";
import KlientetPage from "./Pages/Klientet";
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
        <Route path="/Faturat" element={
            <ProtectedRoute requiredRole={['Admin', 'Menaxher']}>
              <FaturatPage />
            </ProtectedRoute>
          } />
          <Route path="/Bankat" element={
            <ProtectedRoute requiredRole={['Admin']}>
              <BankatPage />
            </ProtectedRoute>
          } />
          <Route path="/Klientet" element={
            <ProtectedRoute requiredRole={['Admin']}>
              <KlientetPage />
            </ProtectedRoute>
          } />
        {/* Error pages */}
        <Route path="/403" element={<NukKeniAkses />} />
        <Route path="*" element={<NukUGjet />} />
      </Routes>
    </div>
  );
}

export default App;
