import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <FaExclamationTriangle />
        </div>
        
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn primary">
            <FaHome />
            Go to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="not-found-btn secondary"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
        
        <div className="not-found-help">
          <p>Need help? Try these links:</p>
          <div className="help-links">
            <Link to="/register">Register Student</Link>
            <Link to="/students">View Students</Link>
            <Link to="/">Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 