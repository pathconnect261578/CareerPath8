import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/landing';
import LoginRegister from './pages/login';
import Dashboard from './pages/Dashboard';
import SeniorStory from './pages/SeniorStory';
import Profile from './pages/Profile';
import GenerateRoadmap from './pages/GenerateRoadmap';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginRegister key="login" />} />
      <Route path="/register" element={<LoginRegister key="register" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/senior/:id" element={<SeniorStory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/generate-roadmap" element={<GenerateRoadmap />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
