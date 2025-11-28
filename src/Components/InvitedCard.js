import "../styles/Invited.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InvitedCard({ event, role, status, onCardClick }) {
  const navigate = useNavigate();
  const isOrganizerPending =
    role === "organizer" && status === "Pending";

  const handleAcceptInvitation = async (accept) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `http://localhost:8000/invitations/${event.id}/accept-invitation-organizer/${event.currentUserId}?accept=${accept}`,
        {},
        {
          headers: {  Authorization: `Bearer ${token}` },
        }
      );
      navigate("/my-events");
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };


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
            <button className="accept-btn" onClick={() => handleAcceptInvitation("true")}>Accept</button>
            <button className="decline-btn" onClick={() => handleAcceptInvitation("false")}>Decline</button>
          </div>
        )}
      </div>
    </div>
  );
}
