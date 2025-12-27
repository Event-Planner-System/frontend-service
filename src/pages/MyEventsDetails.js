// EventDetails.jsx
import React from 'react';
import '../styles/MyEventsDetails.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { EventContext } from '../context/EventContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { InvitationsContext } from '../context/InvitationsContext';



export default function EventDetails() {
    const navigate = useNavigate();
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { deleteEvent } = useContext(EventContext);
    const { id } = useParams();
    const [role, setRole] = useState("attendee");
    const goingCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Going').length : 0;
    const maybeCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Maybe').length : 0;
    const notGoingCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Not Going').length : 0;
    const pendingCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Pending').length : 0;
    const { inviteAttendees } = useContext(InvitationsContext);

    useEffect(() => {
        fetchMyEvent();
    }, []);

    const fetchMyEvent = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(res.data);
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
                alert('Event deleted successfully!');
                navigate("/my-events");
            } else {
                alert(`Delete failed: ${result.message}`);
            }
        }
    };

    const handleInviteAttendees = async () => {
        const emailInput = document.querySelector('.email-input');
        const email = emailInput.value.trim();
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }
        const result = await inviteAttendees(event.id, email, role);
        if (result.success) {
            alert('Invitation sent successfully!');
            emailInput.value = '';
        } else {
            alert(`Invitation failed: ${result.message}`);
        }
        fetchMyEvent(); // Refresh event data to show new invitees
    }
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
    // Add this check
    if (!event || !event.participants) {
        return (
            <div>
                <Navbar />
                <div className="my-events-container">
                    <div className="error-message">Event not found</div>
                </div>
            </div>
        );
    }
    return (
        <div id="my-events-details">
            <Navbar />
            <div className="event-container">

                <div className="layout-grid">
                    {/* Event Card */}
                    <div className="card2 event-card2">
                        <div className="nameAnddeleteBtn">
                            <h1 className="name">{event.title}</h1>
                            <button className="btn-delete" onClick={() => handleDelete(event.id, event.title)}>
                                Delete
                            </button>
                        </div>
                        <p className="subtitle">{event.description}</p>


                        <div className="info-grid">
                            <div className="info-item2">
                                <p className="label">Date & Time</p>
                                <p className="value">{event.date} at {event.time}</p>
                            </div>
                            <div className="info-item2">
                                <p className="label">Location</p>
                                <p className="value">{event.location}</p>
                            </div>
                            <div className="info-item2">
                                <p className="label">Organizer</p>
                                <p className="value">{event.participants[0]?.username || "Unknown"}</p>
                            </div>
                            <div className="info-item2">
                                <p className="label">Attendees</p>
                                <p className="value">{event.participants?.length || 0} people</p>
                            </div>
                        </div>
                    </div>


                    {/* Summary */}
                    <div className="card2 summary-card">
                        <h2 className="summary-title">Summary</h2>


                        <div className="summary-box going">
                            <span>Going</span>
                            <span>{goingCount}</span>
                        </div>
                        <div className="summary-box maybe">
                            <span>Maybe</span>
                            <span>{maybeCount}</span>
                        </div>
                        <div className="summary-box not-going">
                            <span>Not Going</span>
                            <span>{notGoingCount}</span>
                        </div>
                        <div className="summary-box pending">
                            <span>Pending</span>
                            <span>{pendingCount}</span>
                        </div>
                    </div>
                </div>


                <div className="layout-grid">

                    <div className="card2 attendees-card">
                        <h2>Attendees</h2>
                        <div className="attendees-rows">
                            {event.participants?.map((p) => (
                                <div className="attendee-row" key={p.user_id}>
                                    <span>{p.username}</span>
                                    {p.attendance_status === "Going" ? (
                                        <span className="status going-status">{p.attendance_status}</span>
                                    ) : p.attendance_status === "Maybe" ? (
                                        <span className="status maybe-status">{p.attendance_status}</span>
                                    ) : p.attendance_status === "Not Going" ? (
                                        <span className="status not-going-status">{p.attendance_status}</span>
                                    ) : (
                                        <span className="status pending-status">{p.attendance_status}</span>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card2 invite-card">
                        <h3>Invite Attendees</h3>
                        <input
                            type="email"
                            placeholder="attendee@example.com"
                            className="email-input"
                        />
                        <div className="role-buttons">
                            <button
                                className={role === "attendee" ? "active" : ""}
                                onClick={() => {
                                    setRole("attendee")
                                }}
                            >
                                Attendee
                            </button>
                            <button
                                className={role === "organizer" ? "active" : ""}
                                onClick={() => {
                                    setRole("organizer")
                                }}
                            >
                                Organizer
                            </button>
                        </div>
                        <button className="send-btn" onClick={() => handleInviteAttendees()}>Send Invite</button>
                    </div>


                </div>



            </div></div>
    );
}