import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar.js';
import axios from 'axios';
import InvitedCard from '../Components/InvitedCard.js';
import Search from '../Components/Search.js';
import { useNavigate } from 'react-router-dom';
import '../styles/Invited.css';

export default function Invited() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvitedEvents();
  }, []);

  const fetchInvitedEvents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(
        'http://localhost:8000/events/invited-events',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invited events:', err);
      setError('Failed to load invited events');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="my-events-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="my-events-container">

        <div className="dashboard-header">
          <div className="text-header">
            <p className="welcome">Invited Events</p>
            <p className="info">Events you are invited to</p>
          </div>

          <button
            className="create-event-btn"
            onClick={() => navigate('/create-event')}
          >
            + Create Event
          </button>
        </div>

        <div className="search-container">
          <Search />
        </div>

        {error && <div className="error-message">{error}</div>}

        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">🎉</div>
            <h3>No event invitations</h3>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => {
              const me = event.participants.find(
                (p) => p.user_id === event.currentUserId
              );

              const role = me?.role;
              const status = me?.attendance_status;

              return (
                <InvitedCard
                  key={event.id}
                  event={event}
                  role={role}
                  status={status}
                  onCardClick={() => navigate(`/my-events-details/${event.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
