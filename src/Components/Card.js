export default function Card({ event, onCardClick }) {
  const attendeeCount = event.participants?.length || 0;

  const organizer = event.participants.find(p => p.role === "organizer");

  return (
    <div className="card" onClick={onCardClick} style={{ cursor: "pointer" }}>
      
      <div className="card-header">
        <h4 className="card-title">{event.title}</h4>

        <span className="card-role">
          {organizer ? "Organizer" : "Attendee"}
        </span>
      </div>

      <p className="task-description">{event.description || "No description"}</p>

      <div className="card-info">
        <div className="info-item">
          <span className="icon">📅</span>
          <span className="card-date">{event.date} — {event.time}</span>
        </div>

        <div className="info-item">
          <span className="icon">📍</span>
          <span className="card-location">{event.location}</span>
        </div>

        <div className="info-item">
          <span className="icon">👤</span>
          <span className="card-organizer">
            By {organizer?.username}
          </span>
        </div>
      </div>

      <p className="card-attendees">{attendeeCount} attendees</p>
    </div>
  );
}
