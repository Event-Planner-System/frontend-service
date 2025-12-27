import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = `${process.env.REACT_APP_BACKEND_URL || "REACT_APP_BACKEND_URL_PLACEHOLDER"}/auth`;
const TEST_API_URL = `${process.env.REACT_APP_BACKEND_URL || "REACT_APP_BACKEND_URL_PLACEHOLDER"}/test-connection`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password
      });
      
      // Backend returns { message: "User registered successfully" }
      console.log('✅ Registration successful:', res.data.message);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      
      let errorMessage = 'Registration failed';
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map(err => {
              const field = err.loc[err.loc.length - 1];
              return `${field}: ${err.msg}`;
            })
            .join(', ');
        }
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        username: email,  // 👈 Backend expects User object with username field
        email,
        password
      });
      
      console.log('✅ Login response:', res.data);
      
      // Backend returns { access_token, token_type }
      // We need to create a user object manually
      const token = res.data.access_token;
      localStorage.setItem('access_token', token);
      
      // Create user object from email
      const userObj = { email };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      
      console.log('✅ User logged in:', userObj);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      let errorMessage = 'Login failed';
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map(err => {
              const field = err.loc[err.loc.length - 1];
              return `${field}: ${err.msg}`;
            })
            .join(', ');
        }
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

 const getUserByEmail = async (email) =>{
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${API_URL}/user/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const checkBackendConnection = async () => {
    try {
      const res = await axios.get(TEST_API_URL);
      console.log('✅ Backend connected:', res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return { status: 'error', message: 'Failed to connect to backend' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, getUserByEmail, checkBackendConnection }}>
      {children}
    </AuthContext.Provider>
  );
};