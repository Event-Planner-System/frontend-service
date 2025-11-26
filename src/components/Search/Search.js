import './Search.css';

export default function Search() {
    return (
        <div className="search-section">
            <div className="search-header">
                 <h3>Search Events</h3> 
            </div>

            <div className="advanced-search">
                <div className="search-field">
                    <label>Event Name</label>
                    <input type="text" placeholder="Enter event name" />
                </div>

                <div className="search-field">
                    <label>Date</label>
                    <input type="date" />
                </div>

                <div className="search-field">
                    <label>Task Description</label>
                    <input type="text" placeholder="Search by task description" />
                </div>

                <div className="search-field">
                    <label>User Role</label>
                    <select>
                        <option value="">All Roles</option>
                        <option value="organizer">Organizer</option>
                        <option value="attendee">Attendee</option>
                    </select>
                </div>

                <div className="search-actions">
                    <button className="search-btn">Search</button>
                </div>
            </div>
        </div>
    );
}