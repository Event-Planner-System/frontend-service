import DashboardLayout from '../Components/DashboardLayout.js';
import InvitedCard from '../Components/InvitedCard.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

export default function Invited() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { getUserByEmail } = useContext(AuthContext);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvitedEvents();
    }, []);

    const fetchInvitedEvents = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const savedUserString = localStorage.getItem('user');
            
            if (!savedUserString) {
                setLoading(false);
                return;
            }
            
            const savedUser = JSON.parse(savedUserString);
            const currentUser = await getUserByEmail(savedUser.email);
            
            const res = await axios.get(
                'http://localhost:8000/events/invited-events',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const eventsData = Array.isArray(res.data) ? res.data : [];
            const eventsWithUserId = eventsData.map(event => ({
                ...event,
                currentUserId: currentUser._id,
                participants: event.participants || []
            }));

            setEvents(eventsWithUserId);
        } catch (err) {
            console.error('Error fetching invited events:', err);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout 
            welcome="Invited Events"
            info="Events you are invited to"
            showCreateButton={false}
        >
            <div className="events-section">
                <h2 className="section-title">Your Invited Events</h2>

                {loading ? (
    <p>Loading...</p>
) : events.length === 0 ? (
    error ? (
        <div className="error-message">{error}</div>
    ) : (
        <div className="no-events">You haven't been invited to any events yet</div>
    )
) : (
    <div className="cards-container">
        {events.map((event) => {
            const me = event.participants.find(
                (p) => p.user_id === event.currentUserId
            );
            const role = me?.role || 'attendee';
            const status = me?.attendance_status || 'Pending';

            return (
                <InvitedCard
                    key={event.id}
                    event={event}
                    role={role}
                    status={status}
                    onCardClick={() =>
                        navigate(`/invited-events-details/${event.id}`)
                    }
                />
            );
        })}
    </div>
)}

            </div>
        </DashboardLayout>
    );
}
