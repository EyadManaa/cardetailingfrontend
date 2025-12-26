import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ isAdmin }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredBookings = bookings.filter(booking =>
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!isAdmin) {
            navigate('/adminlogin123');
            return;
        }

        fetchBookings();
    }, [isAdmin, navigate]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/bookings`, getAuthHeader());
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/bookings/${id}`, { status: newStatus }, getAuthHeader());
            // Update local state to reflect change immediately
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        console.log('Attempting to delete booking with ID:', id);
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/bookings/${id}`, getAuthHeader());
                console.log('Delete successful');
                setBookings(bookings.filter(b => b.id !== id));
            } catch (err) {
                console.error('Error deleting booking:', err);
                alert('Failed to delete booking.');
            }
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="container dashboard-container">

            {loading ? (
                <div className="loading">Loading bookings...</div>
            ) : (
                <>
                    <div className="dashboard-actions">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Contact</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="no-bookings">
                                            {searchTerm ? `No bookings found matching "${searchTerm}"` : 'No bookings found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                                            <td>{booking.booking_time}</td>
                                            <td>{booking.customer_name}</td>
                                            <td>{booking.service_title}</td>
                                            <td>
                                                <span className={`badge badge-${booking.location_type}`}>
                                                    {booking.location_type === 'mobile' ? 'Mobile' : 'In-Shop'}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={booking.status || 'Pending'}
                                                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                    className={`status-select status-${(booking.status || 'Pending').toLowerCase().replace(' ', '-')}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Finished">Finished</option>
                                                </select>
                                            </td>
                                            <td>{booking.email}</td>
                                            <td>{booking.message || '-'}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="btn btn-delete-sm"
                                                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
