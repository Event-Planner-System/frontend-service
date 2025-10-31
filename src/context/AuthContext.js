// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// const API_URL = 'http://localhost:8000/auth';
// const TEST_API_URL = 'http://localhost:8000/test-connection'; // 👈 new demo API

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem('token');
//     if (token) {
//       loadUser(token);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const loadUser = async (token) => {
//     try {
//       const res = await axios.get(`${API_URL}/user`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUser(res.data);
//     } catch (error) {
//       console.error('Error loading user:', error);
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (username, email, password) => {
//     try {
//       const res = await axios.post(`${API_URL}/register`, {
//         username,
//         email,
//         password
//       });
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Registration failed' 
//       };
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post(`${API_URL}/login`, {
//         email,
//         password
//       });
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };


//   // 👇 New demo API to check backend connection
//   const checkBackendConnection = async () => {
//     try {
//       const res = await axios.get(TEST_API_URL);
//       console.log('✅ Backend connected:', res.data);
//       return res.data;
//     } catch (error) {
//       console.error('❌ Backend connection failed:', error);
//       return { status: 'error', message: 'Failed to connect to backend' };
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, register, login, logout, checkBackendConnection }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



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
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password
      });
      
      // Backend returns { token, user }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      
      return { success: true };
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
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      // Backend returns { token, user }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      
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
    localStorage.removeItem('token');
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