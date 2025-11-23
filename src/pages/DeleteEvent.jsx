import React, { useContext } from 'react';
import { EventContext } from '../context/EventContext';

const DeleteEvent = () => {
  const { events, deleteEvent } = useContext(EventContext);

  return (
    <div className="delete-events-container">
      <h2>Delete Event</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((ev) => (
          <div key={ev.id} className="event-delete-card">
            <h3>{ev.title}</h3>
            <button onClick={() => deleteEvent(ev.id)} className="btn-danger">
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DeleteEvent;
