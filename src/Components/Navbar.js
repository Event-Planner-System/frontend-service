import React, { useContext } from 'react';
import '../styles/Navbar.css';
import { AuthContext } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
    logout();
    navigate('/login');
  };
    return (
        <div id="navbar">
            <h2 className="title">Event Planner</h2>

            <div id="center-buttons">
            <button className="nav-btn">Dashboard</button>
            <button className="nav-btn">My Events</button>
            <button className="nav-btn">Invited</button>
            </div>

            <button className="logout" onClick={handleLogout}>Logout</button>

        </div>


    );

}