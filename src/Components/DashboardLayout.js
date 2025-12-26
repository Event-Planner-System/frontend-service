// Components/DashboardLayout.js
import '../styles/Dashboard.css';
import Search from './Search.js';
import Navbar from './Navbar.js';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ welcome, info, children, showCreateButton = true }) {
    const navigate = useNavigate();

    return (
        <div id="dashboard">
            <Navbar />

            <div className="dashboard-header">
                <div className="text-header">
                    <p className="welcome">{welcome || "Welcome to your Dashboard"}</p>
                    <p className="info">{info || "Manage and explore your events"}</p>
                </div>

                {showCreateButton && (
                    <button
                        className="create-event-btn"
                        onClick={() => navigate('/create-event')}
                    >
                        + Create Event
                    </button>
                )}
            </div>

            <Search />

            {children}
        </div>
    );
}