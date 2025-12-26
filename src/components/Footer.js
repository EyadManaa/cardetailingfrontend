import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Car Detailing Center. All rights reserved.</p>
        <p>Email: info@cardetailingcenter.com</p>
      </div>
      <style>{`
        .footer {
          background-color: var(--dark-bg);
          color: var(--text-light);
          padding: 0.5rem 0;
          text-align: center;
          margin-top: auto;
        }
        .footer p {
          margin: 0.5rem 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
