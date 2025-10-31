import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'http://localhost:8000/auth';
const TEST_API_URL = 'http://localhost:8000/test-connection';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
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
      const res = await axios.post(`${API_URL}/register`, {  // Fixed: parentheses instead of backticks
        username,
        email,
        password
      });
      
      // Backend returns { message: "User registered successfully" }
      // After registration, automatically log in
      return await login(email, password);
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {  // Fixed: parentheses instead of backticks
        email,
        password
      });
      
      // Backend returns { access_token, token_type }
      const token = res.data.access_token;
      
      // Store token
      localStorage.setItem('access_token', token);
      
      // Create user object from token data (you can decode JWT if needed)
      const userObj = { email };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed' 
      };
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
    <AuthContext.Provider value={{ user, loading, register, login, logout, checkBackendConnection }}>
      {children}
    </AuthContext.Provider>
  );
};