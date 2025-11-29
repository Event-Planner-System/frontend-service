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
    const [showAdvanced, setShowAdvanced] = useState(false);

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

    const toggleAdvanced = () => {
        setShowAdvanced(!showAdvanced);
    };

    return (
        <div className="search-section">
            <div className="search-header">
                <h3>Search Events</h3>
            </div>

            {/* Quick Search Bar */}
            <div className="quick-search">
                <input
                    type="text"
                    name="event_name"
                    placeholder="Search events by name..."
                    value={searchParams.event_name}
                    onChange={handleInputChange}
                    className="quick-search-input"
                />
                {!showAdvanced && (
                    <button
                        className="search-btn"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                )}
                <button
                    className="advanced-toggle-btn"
                    onClick={toggleAdvanced}
                >
                    {showAdvanced ? '▲ Hide Advanced Search' : '▼ Show Advanced Search'}
                </button>
            </div>

            {/* Advanced Search (Collapsible) */}
            {showAdvanced && (
                <div className="advanced-search">
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
                            Clear All
                        </button>
                        <button
                            className="search-btn"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Apply Advanced Search'}
                        </button>
                    </div>
                </div>
            )}

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
                    <div className="events-grid2">
                        {searchResults.map((event) => (
                            <div key={event.id} className="event-card">
                                <h2>{event.title}</h2>

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