import '../styles/Dashboard.css';
import Search from '../Components/Search.js';
import Card from '../Components/Card.js';
import Nabvar from '../Components/Navbar.js';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
    return (
        <div id="dashboard">
          <Nabvar />
            <div className="dashboard-header">
                <div className="text-header">
                    <p className="welcome">Welcome to your Dashboard</p>
                    <p className="info">Manage and explore your events</p>
                </div>
                <button className="create-event-btn" onClick={() => navigate('/create-event')}>+ Create Event</button>
            </div>
            <Search />
            <Card />
        </div>
    );
}