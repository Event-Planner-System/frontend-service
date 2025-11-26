import './Navbar.css';

export default function Navbar() {
    return (
        <div id="navbar">
            <h2 className="title">Event Planner</h2>

            <div id="center-buttons">
            <button className="nav-btn">All Events</button>
            <button className="nav-btn">My Events</button>
            <button className="nav-btn">Invited</button>
            </div>

            <button className="logout">Logout</button>

        </div>


    );

}