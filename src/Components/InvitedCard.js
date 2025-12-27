import "../styles/Card.css"; // 👈 Use same style as the normal Card
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Invited.css";

export default function InvitedCard({ event, role, status, onCardClick }) {
  const navigate = useNavigate();

  const isOrganizerPending =
    role === "organizer" && status === "Pending";
  
  const userRole = role === "organizer" ? "Organizer" : "Attendee";

  const handleAcceptInvitation = async (accept) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${window._env_.REACT_APP_BACKEND_URL}/invitations/${event.id}/accept-invitation-organizer/${event.currentUserId}?accept=${accept}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (accept === "true") {
        navigate("/my-events");
      } else {
        navigate("/invited");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  return (
      <div className="card" onClick={onCardClick} style={{ cursor: "pointer" }}>
        
        {/* ---- SAME header as Card ---- */}
        <div className="card-header">
          <h4 className="card-title">{event.title}</h4>
        {userRole === "Organizer" ? (
          <span className="card-role-organizer">Organizer</span>
        ) : (
          <span className="card-role-attendee">Attendee</span>
        )}
        </div>

        {/* ---- SAME description ---- */}
        <p className="task-description">{event.description || "No description"}</p>

        {/* ---- SAME info section ---- */}
        <div className="card-info">
          <div className="info-item">
            <span className="icon">📅</span>
            <span className="card-date">{event.date} at {event.time}</span>
          </div>

          <div className="info-item">
            <span className="icon">📍</span>
            <span className="card-location">{event.location}</span>
          </div>

          <div className="info-item">
          <span className="icon">👤</span>
          <span className="card-organizer">
            By {event.participants.find(p => p.user_id === event.organizer_id)?.username}
          </span>
        </div>
        </div>

        {/* ---- SAME attendees text ---- */}
        <p className="card-attendees">{event.participants.length} attendees</p>
      

      {/* ---- Accept / Decline buttons ------- */}
      {isOrganizerPending && (
        <div className="card-actions-inline">
          <button className="accept-btn" onClick={() => handleAcceptInvitation("true")}>Accept</button>
          <button className="decline-btn" onClick={() => handleAcceptInvitation("false")}>Decline</button>
        </div>
      )}
    </div>
  );
}
