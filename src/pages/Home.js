import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import banner from '../assets/banner3.png';
import exteriorIcon from '../assets/exteriorIcon.png';
import interiorIcon from '../assets/interiorIcon.png';
import mobileIcon from '../assets/mobileIcon.png';
import '../styles/Home.css';

const Home = () => {
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      const bookingId = localStorage.getItem('lastBookingId');
      if (bookingId) {
        axios.get(`${API_BASE_URL}/api/bookings/${bookingId}`)
          .then(res => setBookingStatus(res.data))
          .catch(err => {
            console.error('Error fetching status:', err);
            if (err.response && err.response.status === 404) {
              setBookingStatus(null);
              localStorage.removeItem('lastBookingId');
            }
          });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Pending') return '#FFC107'; // Amber
    if (status === 'In Progress') return '#2196F3'; // Blue
    if (status === 'Finished') return '#4CAF50'; // Green
    return '#777';
  };

  return (
    <div className="home-page">
      <div className="hero" style={{ backgroundImage: `url(${banner})` }}>
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>Premium Car Detailing Services</h1>
            <p>Restore your vehicle's shine with our professional care.</p>
            <Link to="/services" className="btn btn-primary">Book Now</Link>
          </div>
        </div>
      </div>

      {bookingStatus && (
        <div className="container" style={{ marginTop: '2rem' }}>
          <div className="status-widget" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow)',
            textAlign: 'center',
            borderLeft: `5px solid ${getStatusColor(bookingStatus.status)}`
          }}>
            <h3>Your Booking Status</h3>
            <p>Service: <strong>{bookingStatus.service_title}</strong></p>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: getStatusColor(bookingStatus.status),
              marginTop: '0.5rem'
            }}>
              {bookingStatus.status}
            </div>
          </div>
        </div>
      )}

      <div className="container features-section">
        <div className="feature-card">
          <img src={exteriorIcon} alt="Exterior Detailing" className="feature-icon" />
          <h3>Exterior Detailing</h3>
          <p>Restore your car's paint, trim and finish to a like-new shine with full exterior detailing.</p>
        </div>

        <div className="feature-card">
          <img src={interiorIcon} alt="Interior Cleaning" className="feature-icon" />
          <h3>Interior Cleaning</h3>
          <p>Deep-clean carpets, upholstery and surfaces — remove dirt, allergens and odors for a fresh cabin.</p>
        </div>

        <div className="feature-card">
          <img src={mobileIcon} alt="Mobile Service" className="feature-icon" />
          <h3>Mobile Service</h3>
          <p>Convenient on-site service: we come to your home or workplace to perform the work.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
