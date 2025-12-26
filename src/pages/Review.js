import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/Review.css';

const Review = ({ isAdmin }) => {
    // ... (keep state)
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [newReview, setNewReview] = useState({
        service_id: '',
        rating: 0,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
        fetchServices();
    }, []);

    const fetchReviews = () => {
        axios.get(`${API_BASE_URL}/api/reviews`)
            .then(res => setReviews(res.data))
            .catch(err => console.error('Error fetching reviews:', err));
    };

    const fetchServices = () => {
        axios.get(`${API_BASE_URL}/api/services`)
            .then(res => setServices(res.data))
            .catch(err => console.error('Error fetching services:', err));
    };

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleInputChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newReview.service_id) {
            alert('Please select a service.');
            return;
        }
        if (newReview.rating === 0) {
            alert('Please select a star rating.');
            return;
        }

        axios.post(`${API_BASE_URL}/api/reviews`, newReview)
            .then(() => {
                fetchReviews();
                setNewReview({ service_id: '', rating: 0, comment: '' });
            })
            .catch(err => {
                console.error('Error posting review:', err);
                alert('Failed to post review.');
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            axios.delete(`${API_BASE_URL}/api/reviews/${id}`, getAuthHeader())
                .then(() => fetchReviews())
                .catch(err => console.error('Error deleting review:', err));
        }
    };

    // ... (keep helpers renderStars and renderInteractiveStars)
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className="static-star" style={{ color: i < rating ? '#FFD700' : '#e4e5e9' }}>
                &#9733;
            </span>
        ));
    };

    const renderInteractiveStars = () => {
        return [...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
                <label key={i} className="star-label">
                    <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => handleRatingChange(ratingValue)}
                        className="star-input"
                    />
                    <span
                        className="star-icon"
                        style={{
                            color: ratingValue <= newReview.rating ? '#FFD700' : '#cfd8dc',
                        }}
                    >
                        &#9733;
                    </span>
                </label>
            );
        });
    };

    return (
        <div className="container review-page">


            {/* Review Form */}
            <div className="review-form-container">
                <h3 className="review-form-title">Write a Review</h3>
                <form onSubmit={handleSubmit} className="review-form">

                    {/* Service Selection */}
                    <select
                        name="service_id"
                        value={newReview.service_id}
                        onChange={handleInputChange}
                        required
                        className="review-select"
                    >
                        <option value="">Select a Service</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>{service.title}</option>
                        ))}
                    </select>

                    {/* Star Rating Box */}
                    <div className="star-rating-box">
                        {renderInteractiveStars()}
                    </div>

                    <textarea
                        name="comment"
                        placeholder="Tell us about your experience..."
                        value={newReview.comment}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        className="review-textarea"
                    ></textarea>

                    <button type="submit" className="btn btn-primary">Post Review</button>
                </form>
            </div>

            {/* Reviews List */}
            <div className="review-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-card-header">
                            <h4 className="review-service-title">{review.service_title || 'General Review'}</h4>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="btn-delete-review"
                                    title="Delete Review"
                                >
                                    &#10060;
                                </button>
                            )}
                        </div>
                        <div className="review-stars">
                            {renderStars(review.rating)}
                        </div>
                        <p className="review-comment">"{review.comment}"</p>
                        <small className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                        </small>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
        </div>
    );
};

export default Review;
