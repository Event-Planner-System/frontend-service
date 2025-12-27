import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const EventContext = createContext();

const API_URL = `${
  process.env.REACT_APP_BACKEND_URL || "REACT_APP_BACKEND_URL_PLACEHOLDER"
}/events`;
const TEST_API_URL = `${process.env.REACT_APP_BACKEND_URL || "REACT_APP_BACKEND_URL_PLACEHOLDER"}/test-connection`;

export const EventProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      }
    }

    setLoading(false);
  }, []);

  // ----------------------
  // CREATE EVENT
  // ----------------------
  const createEvent = async (
    title,
    description,
    date,
    time,
    location,
    invited_emails
  ) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.post(
        `${API_URL}/create`,
        {
          title,
          description,
          date,
          time,
          location,
          invited_emails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Event created:", res.data.event);
      return { success: true, event: res.data.event };
    } catch (error) {
      console.error("❌ Create event error:", error.response?.data);

      let errorMessage = "Event creation failed";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      return { success: false, message: errorMessage };
    }
  };

  // ----------------------
  // DELETE EVENT
  // ----------------------
  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.delete(`${API_URL}/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🗑️ Event deleted:", res.data.message);
      return { success: true };
    } catch (error) {
      console.error("❌ Delete event error:", error.response?.data);

      let errorMessage = "Delete failed";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      return { success: false, message: errorMessage };
    }
  };

  // ----------------------
  // LOGOUT
  // ----------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ----------------------
  // BACKEND CONNECTION TEST
  // ----------------------
  const checkBackendConnection = async () => {
    try {
      const res = await axios.get(TEST_API_URL);
      console.log("Backend OK:", res.data);
      return res.data;
    } catch (error) {
      console.error("Backend error:", error);
      return { status: "error", message: "Failed to connect to backend" };
    }
  };

  // ----------------------
  // PROVIDER VALUES
  // ----------------------
  return (
    <EventContext.Provider
      value={{
        user,
        loading,
        createEvent,
        deleteEvent,
        logout,
        checkBackendConnection,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
