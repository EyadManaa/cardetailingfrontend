import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/Booking.css';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const service = location.state?.service;

    const [formData, setFormData] = useState({
        customer_name: '',
        email: '',
        booking_date: '',
        booking_time: '',
        location_type: 'shop',
        message: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const bookingData = {
            ...formData,
            service_title: service ? service.title : 'General Inquiry'
        };

        try {
            await axios.post(`${API_BASE_URL}/api/bookings`, bookingData);
            alert('Booking request submitted successfully!');
            navigate('/services');
        } catch (err) {
            console.error('Error submitting booking:', err);
            alert('Failed to submit booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!service) {
        // Optional: Redirect to services if accessed directly without selecting a service
        // navigate('/services');
        // return null;
        // For now, allow general booking
    }

    return (
        <div className="booking-container">
            <div className="booking-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h1 className="booking-main-title">Book Service</h1>
                <div className="spacer"></div>
            </div>

            <div className="booking-layout">
                <div className="booking-form-section">
                    <h2 className="booking-section-title">Enter your details</h2>
                    <form onSubmit={handleSubmit} className="booking-form">
                        <input
                            type="text"
                            name="customer_name"
                            placeholder="Full Name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            className="booking-input"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="booking-input"
                            required
                        />

                        <div className="booking-date-group">
                            <input
                                type="date"
                                name="booking_date"
                                value={formData.booking_date}
                                onChange={handleChange}
                                className="booking-input booking-date-input"
                                required
                            />
                            <input
                                type="time"
                                name="booking_time"
                                value={formData.booking_time}
                                onChange={handleChange}
                                className="booking-input booking-date-input"
                                required
                            />
                        </div>

                        <div className="location-box">
                            <label className="location-label">Service Location</label>
                            <div className="location-options">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="location_type"
                                        value="shop"
                                        checked={formData.location_type === 'shop'}
                                        onChange={handleChange}
                                    />
                                    In-Shop
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="location_type"
                                        value="mobile"
                                        checked={formData.location_type === 'mobile'}
                                        onChange={handleChange}
                                    />
                                    Mobile Service
                                </label>
                            </div>
                        </div>

                        <textarea
                            name="message"
                            placeholder="Any special requests or notes?"
                            value={formData.message}
                            onChange={handleChange}
                            className="booking-textarea"
                            rows="4"
                        ></textarea>

                        <button
                            type="submit"
                            className="login-submit-btn btn-confirm"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>

                <div className="summary-section">
                    <div className="summary-card">
                        <h3 className="summary-title">Order Summary</h3>
                        {service ? (
                            <>
                                <img
                                    src={service.image || 'https://via.placeholder.com/350x200?text=No+Image'}
                                    alt={service.title}
                                    className="summary-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/350x200?text=Error'; }}
                                />
                                <h4 className="summary-service-name">{service.title}</h4>
                                <p className="summary-description">{service.description}</p>
                                <div className="summary-total">
                                    <span className="total-label">Total</span>
                                    <span className="total-amount">${service.price}</span>
                                </div>
                            </>
                        ) : (
                            <p>No specific service selected. This will be a general inquiry.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
