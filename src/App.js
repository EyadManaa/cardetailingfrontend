import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Review from './pages/Review';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAdmin={isAdmin} handleLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route path="/adminlogin123" element={<Login setIsAdmin={setIsAdmin} />} />
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services isAdmin={isAdmin} />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/review" element={<Review isAdmin={isAdmin} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<AdminDashboard isAdmin={isAdmin} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
