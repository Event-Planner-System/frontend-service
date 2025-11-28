import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import Invited from './pages/Invited';   // 



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
    <Route path="/dashboard" element={<Dashboard />} />

      <Route 
  path="/create-event" 
    element={
    <ProtectedRoute>
      <CreateEvent />
    </ProtectedRoute>
           }
    />

      <Route 
        path="/my-events" 
        element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        } 
      />
     
       <Route 
  path="/invited" 
  element={
    <ProtectedRoute>
      <Invited />
    </ProtectedRoute>
  } 
/>

    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <div className="App">

            <AppRoutes />
          </div>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;