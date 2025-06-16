import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import GoalTracker from './pages/GoalTracker';
import DailyReflection from './pages/DailyReflection';
import PastReflections from './pages/PastReflections';
import ResourceLibrary from './pages/ResourceLibrary';
import Profile from './pages/Profile';
import { authService } from './services/api';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Create router with future flags
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/journal',
        element: (
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        )
      },
      {
        path: '/goals',
        element: (
          <ProtectedRoute>
            <GoalTracker />
          </ProtectedRoute>
        )
      },
      {
        path: '/reflection',
        element: (
          <ProtectedRoute>
            <DailyReflection />
          </ProtectedRoute>
        )
      },
      {
        path: '/past-reflections',
        element: (
          <ProtectedRoute>
            <PastReflections />
          </ProtectedRoute>
        )
      },
      {
        path: '/resources',
        element: (
          <ProtectedRoute>
            <ResourceLibrary />
          </ProtectedRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App; 