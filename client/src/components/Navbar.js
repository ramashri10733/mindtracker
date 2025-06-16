import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import NotificationBell from './NotificationBell';

function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">MindTracker</Link>
        </div>
        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/goals">Goals</Link>
            <Link to="/reflection">New Reflection</Link>
            <Link to="/past-reflections" className="nav-link">
              Past Reflections
            </Link>
            <Link to="/resources" className="nav-link">
              Resource Library
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <NotificationBell />
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Navbar; 
