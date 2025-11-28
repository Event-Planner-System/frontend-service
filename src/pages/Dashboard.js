import '../styles/Dashboard.css';
import Search from '../Components/Search.js';
import Card from '../Components/Card.js';
import Nabvar from '../Components/Navbar.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import { useContext } from 'react';


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
      const res = await axios.get(`http://localhost:8000/events/getAllMyEvents/${user._id}`, {
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

    // Get FULL user from backend (with _id)
    const backendUser = await getUserByEmail(savedUser.email);

    if (!backendUser) {
      console.error("Backend returned no user");
      return null;
    }

    return backendUser;  // <-- IMPORTANT: return backend user, not savedUser
  };

  return (
    <div id="dashboard">
      <Nabvar />

      <div className="dashboard-header">
        <div className="text-header">
          <p className="welcome">Welcome to your Dashboard</p>
          <p className="info">Manage and explore your events</p>
        </div>

        <button
          className="create-event-btn"
          onClick={() => navigate('/create-event')}
        >
          + Create Event
        </button>

      </div>

      <Search />

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
                  onCardClick={() => navigate(`/my-events-details/${ev.id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
