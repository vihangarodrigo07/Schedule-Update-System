import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/LoginPage';
import RegisterPage from "./components/Registerpage";
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';
import ResetPasswordPage from './components/ResetPasswordPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? <Navigate to="/profile" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated() ? "/profile" : "/login"} replace />
            } 
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}

export default App;