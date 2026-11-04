import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaUserPlus, FaUsers, FaHome } from 'react-icons/fa';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: FaHome },
    { path: '/register', label: 'Register Student', icon: FaUserPlus },
    { path: '/students', label: 'Student List', icon: FaUsers },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FaGraduationCap className="logo-icon" />
            <h1 className="logo-text">
              <span className="logo-primary">CLOUDBLITZ</span>
              <span className="logo-secondary">Student Management</span>
            </h1>
          </div>
          <nav className="navigation">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActiveRoute(path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 CLOUDBLITZ Student Management System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 