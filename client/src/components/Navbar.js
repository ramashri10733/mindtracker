import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import NotificationBell from './NotificationBell';

function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const activeClassName = "nav-link active-link";

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
            MindTracker
          </NavLink>
        </div>
        {user && (
          <div className="navbar-menu">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              Dashboard
            </NavLink>
            <NavLink to="/journal" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              Journal
            </NavLink>
            <NavLink to="/goals" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              Goals
            </NavLink>
            <NavLink to="/reflection" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              New Reflection
            </NavLink>
            <NavLink to="/past-reflections" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              Past Reflections
            </NavLink>
            <NavLink to="/resources" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              Resource Library
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClassName : "nav-link"}>
              Profile
            </NavLink>
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
