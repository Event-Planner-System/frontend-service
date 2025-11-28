import { useState, useContext } from 'react';
import { SearchContext } from '../context/SearchContext';
import '../styles/Search.css';

export default function Search() {
    const { searchResults, loading, error, searchEvents, clearSearch } = useContext(SearchContext);

    const [searchParams, setSearchParams] = useState({
        event_name: '',
        date: '',
        description: '',
        location: '',
        user_role: 'all',
    });

    const [showResults, setShowResults] = useState(false);

  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value,
        });
    };

   
    const handleSearch = async () => {
        setShowResults(false);
        const result = await searchEvents(searchParams);

        if (result.success) {
            setShowResults(true);
        }
    };

  
    const handleClear = () => {
        setSearchParams({
            event_name: '',
            date: '',
            description: '',
            location: '',
            user_role: 'all',
        });
        clearSearch();
        setShowResults(false);
    };

    return (
        <div className="search-section">
            <div className="search-header">
                <h3>Advanced Search on Events</h3>
            </div>

            <div className="advanced-search">
                {/* Event Name */}
                <div className="search-field">
                    <label>Event Name</label>
                    <input
                        type="text"
                        name="event_name"
                        placeholder="Enter event name"
                        value={searchParams.event_name}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Date */}
                <div className="search-field">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={searchParams.date}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Task Description */}
                <div className="search-field">
                    <label>Task Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Search by task description"
                        value={searchParams.description}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Location */}
                <div className="search-field">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        placeholder="Search by location"
                        value={searchParams.location}
                        onChange={handleInputChange}
                    />
                </div>

                {/* User Role */}
                <div className="search-field">
                    <label>User Role</label>
                    <select
                        name="user_role"
                        value={searchParams.user_role}
                        onChange={handleInputChange}
                    >
                        <option value="all">All Roles</option>
                        <option value="organizer">Organizer</option>
                        <option value="attendee">Attendee</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="search-actions">
                    <button
                        className="clear-btn"
                        onClick={handleClear}
                        disabled={loading}
                    >
                        Clear
                    </button>
                    <button
                        className="search-btn"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
                <div className="search-results">
                    <h3>Search Results ({searchResults.length})</h3>
                    <div className="events-grid">
                        {searchResults.map((event) => (
                            <div key={event.id} className="event-card">
                                <h4>{event.title}</h4>

                                <div className="event-details">
                                    <p>
                                        <strong>📅 Date:</strong> {event.date}
                                    </p>
                                    <p>
                                        <strong>🕐 Time:</strong> {event.time}
                                    </p>
                                    <p>
                                        <strong>📍 Location:</strong> {event.location}
                                    </p>

                                    {event.description && (
                                        <p className="event-description">
                                            <strong>📝 Description:</strong> {event.description}
                                        </p>
                                    )}
                                </div>

                                <div className="participants-info">
                                    <strong>👥 Participants:</strong> {event.participants.length}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {showResults && searchResults.length === 0 && !error && (
                <div className="no-results">
                    <p>No events found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}