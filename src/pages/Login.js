import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ setIsAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Sending email as 'username' to match backend expectation
            const res = await axios.post(`${API_BASE_URL}/api/login`, { username: email, password });
            const { token } = res.data;
            localStorage.setItem('adminToken', token);
            setIsAdmin(true);
            navigate('/services'); // Redirect to dashboard or services
        } catch (err) {
            setError(err.response?.data?.details || 'Invalid credentials');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-header-section">
                <h1 className="main-title">Log in to your account</h1>
                <p className="sub-subtitle">Welcome back! Please enter your details.</p>
            </div>

            <div className="login-card-new">
                <button className="close-btn-new" onClick={() => navigate('/')} aria-label="Close">
                    &times;
                </button>

                {error && <div className="error-message-new">{error}</div>}

                <form onSubmit={handleLogin} className="login-form-new">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input-new"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input-new"
                            required
                        />
                    </div>

                    <div className="form-options">
                        <span className="placeholder-check"></span>
                        <button type="button" className="forgot-password" onClick={() => alert('Feature coming soon!')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Forgot password</button>
                    </div>

                    <button type="submit" className="login-submit-btn">Sign in</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
