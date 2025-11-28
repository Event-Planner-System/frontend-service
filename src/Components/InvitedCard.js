import "../styles/Invited.css";

export default function InvitedCard({ event, role, status, onCardClick }) {
  const isOrganizerPending =
    role === "organizer" && status === "Pending";


  return (
    <div className="invited-card">
      <div className="card-wrapper">

        <div className="card" onClick={onCardClick} style={{ cursor: "pointer" }}>
          <div className="card-header">
            <h4 className="card-title">{event.title}</h4>
            <span className="card-role">{role}</span>
          </div>

          {event.description && (
            <p className="task-description">{event.description}</p>
          )}

          <div className="card-info">
            <div className="info-item">
              <span className="icon">📅</span>
              <span className="card-date">{event.date} — {event.time}</span>
            </div>

            <div className="info-item">
              <span className="icon">📍</span>
              <span className="card-location">{event.location}</span>
            </div>
          </div>

          <p className="card-attendees">
            {event.participants.length} attendees
          </p>
        </div>

        {isOrganizerPending && (
          <div className="card-actions-inline">
            <button className="accept-btn" >Accept</button>
            <button className="decline-btn">Decline</button>
          </div>
        )}
      </div>
    </div>
  );
}
