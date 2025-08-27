import React from 'react';
import '../../styles/components.css';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Indian Army Examination Portal</h1>
            <p className="hero-subtitle">
              A comprehensive platform for conducting and managing army examinations 
              with efficiency and security
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-title">
            <h2>Examination System Features</h2>
            <p>Our platform provides all the tools needed for efficient exam management</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Question Paper Generation</h3>
              <p>Generate question papers from question banks with mapping to Trade, Level and Skill</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Registration Module</h3>
              <p>Register candidates with all necessary details prior to exam conduction</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-check-double"></i>
              </div>
              <h3>Evaluation Module</h3>
              <p>Evaluate answers, upload marks, and calculate totals for theory, practical and viva</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;