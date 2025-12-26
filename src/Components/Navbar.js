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
            <h2 className="title" onClick={() => navigate('/dashboard')}>Event Planner</h2>

            <div id="center-buttons">
                <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button className="nav-btn" onClick={() => navigate('/my-events')}> My Events </button>
                <button className="nav-btn" onClick={() => navigate('/invited')}>Invited</button>

            </div>

            <button className="logout" onClick={handleLogout}>Logout</button>

        </div>


    );

}