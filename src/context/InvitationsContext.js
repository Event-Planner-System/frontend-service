import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const InvitationsContext = createContext();

const API_URL = "http://localhost:8000/invitations";
const TEST_API_URL = "http://localhost:8000/test-connection";

export const InvitationsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getUserByEmail } = useContext(AuthContext);

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




  // ----------------------
  // Send invitations
  // ----------------------
  const inviteAttendees = async (eventId, email, attendeeRole) => {
    try {
      const token = localStorage.getItem("access_token");
      const invitedUser = await getUser();

      const res = await axios.post(
        `${API_URL}/${eventId}/attendee/${email}?user_id=${invitedUser._id}&user_role=${attendeeRole}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      return { success: true, message: res.data.message };

    } catch (error) {
      console.error("FULL ERROR:", error);
      console.error("ERROR RESPONSE:", error.response);
      console.error("ERROR DATA:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.detail || "Invitation failed"
      };
    }
  };


  // ----------------------
  // Accept Invitation Attendee
  // ----------------------
  const acceptInvitationAttendee = async (eventId, status) => {
    try{
      const token = localStorage.getItem("access_token");
      const attendee = await getUser();

      const res = await axios.post(
        `${API_URL}/${eventId}/accept-invitation-attendee/${attendee._id}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return { success: true, message: res.data.message };
    }
    catch (error){
      console.error("FULL ERROR:", error);
      console.error("ERROR RESPONSE:", error.response);
      console.error("ERROR DATA:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.detail || "Accepting invitation failed"
      };
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
    <InvitationsContext.Provider
      value={{
        user,
        loading,
        inviteAttendees,
        acceptInvitationAttendee,
        logout,
        checkBackendConnection,
      }}
    >
      {children}
    </InvitationsContext.Provider>
  );
};
