import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/Services.css';

const Services = ({ isAdmin }) => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ title: '', price: '', description: '', image: null });
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchServices();
    }, []);

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
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewService({ ...newService, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', newService.title);
        formData.append('price', newService.price);
        formData.append('description', newService.description);
        if (newService.image instanceof File) {
            formData.append('image', newService.image);
        }

        if (editMode) {
            axios.put(`${API_BASE_URL}/api/services/${editingId}`, formData, getAuthHeader())
                .then(() => {
                    fetchServices();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error updating service:', err);
                    alert('Failed to update service.');
                });
        } else {
            axios.post(`${API_BASE_URL}/api/services`, formData, getAuthHeader())
                .then(() => {
                    fetchServices();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error adding service:', err);
                    alert('Failed to add service.');
                });
        }
    };

    const resetForm = () => {
        setShowAddModal(false);
        setEditMode(false);
        setEditingId(null);
        setNewService({ title: '', price: '', description: '', image: null });
    };

    const handleEdit = (service) => {
        setEditMode(true);
        setEditingId(service.id);
        setNewService({
            title: service.title,
            price: service.price,
            description: service.description,
            image: service.image
        });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            axios.delete(`${API_BASE_URL}/api/services/${id}`, getAuthHeader())
                .then(() => fetchServices())
                .catch(err => console.error('Error deleting service:', err));
        }
    };

    const handleBook = (service) => {
        navigate('/booking', { state: { service } });
    };

    return (
        <div className="container services-page">
            <div className="services-header">
                <h2>Our Services</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>Add Service</button>
                )}
            </div>

            <div className="services-grid">
                {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                        <div key={service.id} className="service-card">
                            <img src={service.image} alt={service.title} className="service-image" />
                            <div className="service-content">
                                <div>
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-price">${service.price}</p>
                                    <p className="service-description">{service.description}</p>
                                </div>
                                <div className="service-actions">
                                    <button className="btn btn-primary btn-book" onClick={() => handleBook(service)}>Book Now</button>
                                    {isAdmin && (
                                        <>
                                            <button className="btn btn-edit" onClick={() => handleEdit(service)}>Edit</button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(service.id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No services found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editMode ? 'Edit Service' : 'Add New Service'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <input type="text" name="title" placeholder="Service Title" value={newService.title} onChange={handleInputChange} required className="form-input" />
                            <input type="number" name="price" placeholder="Price" value={newService.price} onChange={handleInputChange} required className="form-input" />
                            <textarea name="description" placeholder="Description" value={newService.description} onChange={handleInputChange} required className="form-textarea" />

                            {/* File Input */}
                            <label>Select Image {editMode && '(Optional)'}:</label>
                            <input type="file" name="image" onChange={handleFileChange} required={!editMode} className="form-input" />

                            <div className="modal-actions">
                                <button type="button" className="btn btn-cancel" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
