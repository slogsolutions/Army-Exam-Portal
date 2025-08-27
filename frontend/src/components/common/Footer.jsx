import React from 'react';
import '../../styles/components.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Army Exam Portal</h3>
            <p>A comprehensive platform for army examination management</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/exams">Exams</a></li>
              <li><a href="/results">Results</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@armyexamportal.in</p>
            <p>Phone: +91 XXXXX XXXXX</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 Army Examination Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;