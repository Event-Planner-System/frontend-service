import React from 'react';
import '../styles/InvitedEventsDetails.css';
import Navbar from '../Components/Navbar';
import { useNavigate} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { InvitationsContext } from '../context/InvitationsContext';



export default function EventDetails() {
    const navigate = useNavigate();
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const goingCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Going').length : 0;
    const maybeCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Maybe').length : 0;
    const notGoingCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Not Going').length : 0;
    const pendingCount = event.participants ? event.participants.filter(p => p.attendance_status === 'Pending').length : 0;
    const { acceptInvitationAttendee } = useContext(InvitationsContext);
    const [status, setStatus] = useState("Pending");


    useEffect(() => {
        fetchMyEvent();
    }, []);

    const fetchMyEvent = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`http://localhost:8000/events/${id}`, {
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
    const handleStatusChange = async (status) => {
        setStatus(status);
        await acceptInvitationAttendee(event.id, status);
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
    return (
        <div  id="invited-event-details">
        <Navbar />
            <div className="event-container">

           <div className="layout-grid">
                {/* Event Card */}
                <div className="card3 event-card">
                    <div className="nameAnddeleteBtn">
                        <h1 className="name">{event.title}</h1>
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
                <div className="card3 summary-card">
                    <h2 className="summary-title">Summary</h2>


                    <div className="summary-box2 going">
                        <span>Going</span>
                        <span>{goingCount}</span>
                    </div>
                    <div className="summary-box2 maybe">
                        <span>Maybe</span>
                        <span>{maybeCount}</span>
                    </div>
                    <div className="summary-box2 not-going">
                        <span>Not Going</span>
                        <span>{notGoingCount}</span>
                    </div>
                    <div className="summary-box2 pending">
                        <span>Pending</span>
                        <span>{pendingCount}</span>
                    </div>
                </div>
            </div>


            {/* Attendance Buttons */}
            <div className="card3 attendance-card">
                <h2>Your Attendance</h2>
                <div className="attendance-buttons">
                    <button className={"btn going-btn" + (status === "Going" ? " active" : "")} 
                    onClick={() => {
                        handleStatusChange("Going")
                    }}>
                        Going
                    </button>
                    <button className={"btn maybe-btn" + (status === "Maybe" ? " active" : "")} 
                    onClick={() => {
                        handleStatusChange("Maybe")
                        }}>
                        Maybe
                    </button>
                    <button className={"btn not-going-btn" + (status === "Not Going" ? " active" : "")} 
                    onClick={() => {
                        handleStatusChange("Not Going")
                        }}>
                        Not Going
                    </button>
                </div>
            </div>

        </div></div>
    );
}