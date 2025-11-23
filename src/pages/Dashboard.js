import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1>Welcome to Your Dashboard! 👋</h1>

          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <div className="dashboard-actions">
            <div className="action-card" onClick={() => navigate('/create-event')}>
              <div className="action-icon">➕</div>
              <h3>Create Event</h3>
              <p>Organize a new event and invite attendees</p>
            </div>

            <div className="action-card" onClick={() => navigate('/my-events')}>
              <div className="action-icon">📅</div>
              <h3>My Events</h3>
              <p>View and manage all your events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;