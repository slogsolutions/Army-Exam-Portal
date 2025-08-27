import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import '../../styles/components.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-star"></i>
            </div>
            <h1>ARMY EXAM PORTAL</h1>
          </div>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/exams" className="nav-link">Exams</Link>
            <Link to="/register" className="nav-link">Registration</Link>
            <Link to="/results" className="nav-link">Results</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            
            {currentUser ? (
              <div className="user-menu">
                <span className="user-welcome">Welcome, {currentUser.rank} {currentUser.name}</span>
                <button onClick={logout} className="btn btn-logout">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline">Login</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;