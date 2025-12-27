import '../styles/Dashboard.css';
import Card from '../Components/Card.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from '../Components/DashboardLayout.js';

export default function Dashboard() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getUserByEmail } = useContext(AuthContext);

    useEffect(() => {
        fetchAllMyEvents();
    }, []);

    const fetchAllMyEvents = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const user = await getUser();
            const res = await axios.get(`${window._env_.REACT_APP_BACKEND_URL}/events/getAllMyEvents/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (err) {
            console.error("Error loading dashboard events:", err);
        } finally {
            setLoading(false);
        }
    };

    const getUser = async () => {
        const savedUserString = localStorage.getItem("user");
        if (!savedUserString) return null;

        const savedUser = JSON.parse(savedUserString);
        const backendUser = await getUserByEmail(savedUser.email);

        if (!backendUser) {
            console.error("Backend returned no user");
            return null;
        }

        return backendUser;
    };

    const getCurrentUserRole = (event) => {
        const participant = event.participants?.find(
            p => p.user_id === event.currentUserId
        );
        return participant?.role || 'attendee';
    };

    const getNavigationPath = (event) => {
        const role = getCurrentUserRole(event);
        return role === 'organizer'
            ? `/my-events-details/${event.id}`
            : `/invited-events-details/${event.id}`;
    };

    return (
        <DashboardLayout
            welcome="Welcome to your Dashboard"
            info="Manage and explore your events"
        >
            <div className="events-section">
                <h2 className="section-title">Your Events</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="cards-container">
                        {events.length === 0 ? (
                            <p>No events found</p>
                        ) : (
                            events.map(ev => (
                                <Card
                                    key={ev.id}
                                    event={ev}
                                    onCardClick={() => navigate(getNavigationPath(ev))}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}