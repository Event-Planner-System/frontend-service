import React, { createContext, useState } from "react";
import axios from "axios";

export const SearchContext = createContext();

const API_URL = "http://localhost:8000/events";

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchEvents = async (searchParams) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");
      const params = {};

      if (searchParams.event_name?.trim()) {
        params.event_name = searchParams.event_name.trim();
      }
      if (searchParams.date) {
        params.date = searchParams.date;
      }
      if (searchParams.description?.trim()) {
        params.description = searchParams.description.trim();
      }
      if (searchParams.location?.trim()) {
        params.location = searchParams.location.trim();
      }
      if (searchParams.user_role && searchParams.user_role !== "all") {
        params.user_role = searchParams.user_role;
      }

      const res = await axios.post(`${API_URL}/search`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Search results:", res.data);
      setSearchResults(res.data);
      setLoading(false);

      return { success: true, events: res.data };
    } catch (error) {
      console.error("Search error:", error.response?.data);

      let errorMessage = "Search failed";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      setError(errorMessage);
      setLoading(false);

      return { success: false, message: errorMessage };
    }
  };


  const clearSearch = () => {
    setSearchResults([]);
    setError("");
  };

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        loading,
        error,
        searchEvents,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};