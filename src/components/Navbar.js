import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';

const Navbar = ({ isAdmin, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Car Detailing Center" className="logo" />
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/review">Review</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {isAdmin ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>
                <button onClick={handleLogout} className="btn-link" title="Logout" style={{ display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: '#ffffffff', cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
      <style>{`
        .navbar {
          background-color: var(--dark-bg);
          box-shadow: var(--shadow);
          padding: 0.2rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 3rem; /* "Far left" with some padding */
          box-sizing: border-box;
        }
        .logo {
          height: 85px; /* Bigger logo */
          filter: brightness(0) invert(1); /* Make logo white if it's black */
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-links a {
          font-weight: 600;
          color: white;
          opacity: 0.9;
        }
        .nav-links a:hover {
          color: var(--hover-color);
          opacity: 1;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
