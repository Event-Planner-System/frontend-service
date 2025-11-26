import React, { useState, useEffect, useContext } from 'react';
import { EventContext } from '../context/EventContext';
import Navbar from '../Components/Navbar.js';
import axios from 'axios';
import '../styles/MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { deleteEvent } = useContext(EventContext);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:8000/events/my-events', {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
        // Remove event from state
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
        <div className="my-events-header">
          <h1>My Events</h1>
          <p>Events you have organized</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📅</div>
            <h3>No events yet</h3>
            <p>Create your first event to get started!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className="event-badge">Organizer</span>
                </div>

                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}

                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕐</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="event-participants">
                  <span className="participants-label">Participants:</span>
                  <span className="participants-count">
                    {event.participants?.length || 0} attendee(s)
                  </span>
                </div>

                <div className="event-actions">
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(event.id, event.title)}
                  >
                    🗑️ Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;