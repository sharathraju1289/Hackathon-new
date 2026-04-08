import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UiProvider } from './context/UiContext';
import AuthGate from './components/AuthGate';
import Home from './components/Home';
import PropertyDetail from './components/PropertyDetail';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import Wishlist from './components/Wishlist';
import Schedules from './components/Schedules';
import { UserProvider } from './context/UserContext';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <UiProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={!isAuthenticated ? <AuthGate onLogin={handleLogin} /> : <Navigate to="/home" />} 
            />
            <Route
              path="/signup"
              element={!isAuthenticated ? <AuthGate initialView="register" onLogin={handleLogin} /> : <Navigate to="/home" />}
            />
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/property/:id" 
              element={isAuthenticated ? <PropertyDetail onLogout={handleLogout} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/wishlist" 
              element={isAuthenticated ? <Wishlist /> : <Navigate to="/" />} 
            />
            <Route 
              path="/schedules" 
              element={isAuthenticated ? <Schedules /> : <Navigate to="/" />} 
            />
          </Routes>
          {isAuthenticated && <Footer />}
          <ChatBot />
        </BrowserRouter>
      </UserProvider>
    </UiProvider>
  );
}

export default App;
