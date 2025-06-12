import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Journal</h3>
          <p>Record your thoughts and feelings</p>
          <Link to="/journal" className="dashboard-link">Go to Journal</Link>
        </div>

        <div className="dashboard-card">
          <h3>Goals</h3>
          <p>Track your mental wellness goals</p>
          <Link to="/goals" className="dashboard-link">View Goals</Link>
        </div>

        <div className="dashboard-card">
          <h3>Daily Reflection</h3>
          <p>Take a moment to reflect on your day</p>
          <Link to="/reflection" className="dashboard-link">Start Reflection</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 