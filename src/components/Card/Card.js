import './Card.css';

export default function Card() {
    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title">Team Meetup</h4>
                <span className="card-role">Attendee</span>
            </div>
            
            <p className="task-description">Monthly team gathering</p>
            
            <div className="card-info">
                <div className="info-item">
                    <span className="icon">📅</span>
                    <span className="card-date">11/15/2025 at 14:00</span>
                </div>
                
                <div className="info-item">
                    <span className="icon">📍</span>
                    <span className="card-location">Conference Room A</span>
                </div>
                
                <div className="info-item">
                    <span className="icon">👤</span>
                    <span className="card-organizer">By John Doe</span>
                </div>
            </div>
            
            <p className="card-attendees">2 attendees</p>
        </div>
    );
}