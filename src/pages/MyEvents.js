import React, { useState, useEffect, useContext } from 'react';
import { EventContext } from '../context/EventContext';
import DashboardLayout from '../Components/DashboardLayout.js';
import Card from '../Components/Card.js';
import '../styles/MyEvents.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { deleteEvent } = useContext(EventContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events/my-organizer-events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        welcome="My Events"
        info="Events you have organized"
        showSearch={false}
      >
        <div className="loading-spinner">Loading events...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      welcome="My Events"
      info="Events you have organized"
    >
      <div className="events-section">
        <h2 className="section-title">Your Organized Events</h2>

        {events.length === 0 ? (
          error ? (
            <div className="error-message">{error}</div>
          ) : (
            <p>No events found</p>
          )
        ) : (
          <div className="cards-container">
            {events.map((event) => (
              <Card
                key={event.id}
                event={event}
                onCardClick={() => navigate(`/my-events-details/${event.id}`)}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MyEvents;