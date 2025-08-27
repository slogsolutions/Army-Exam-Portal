import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>User Management</h3>
          <p>Manage users and permissions</p>
        </div>
        <div className="dashboard-card">
          <h3>Exam Management</h3>
          <p>Create and manage exams</p>
        </div>
        <div className="dashboard-card">
          <h3>Question Bank</h3>
          <p>Manage question database</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;