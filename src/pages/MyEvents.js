import React, { useState, useEffect, useContext } from 'react';
import { EventContext } from '../context/EventContext';
import Navbar from '../Components/Navbar.js';
import Search from '../Components/Search.js';
import axios from 'axios';
import Card from '../Components/Card.js';
import '../styles/MyEvents.css';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.get('http://localhost:8000/events/my-organizer-events', {
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

  const handleDelete = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      const result = await deleteEvent(eventId);
      if (result.success) {
        setEvents(events.filter(event => event.id !== eventId));
        alert('Event deleted successfully! 🗑️');
      } else {
        alert(`Delete failed: ${result.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="my-events-container">
          <div className="loading-spinner">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="my-events-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <div className="text-header">
            <p className="welcome">My Events</p>
            <p className="info">Events you have organized</p>
          </div>

          <button
            className="create-event-btn"
            onClick={() => navigate('/create-event')}
          >
            + Create Event
          </button>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <Search />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="events-grid">
          {events.map((event) => (
            <Card
              key={event.id}
              event={event}
              showDelete={true}
              onDelete={handleDelete}
              onCardClick={() => navigate(`/my-events-details/${event.id}`)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyEvents;
