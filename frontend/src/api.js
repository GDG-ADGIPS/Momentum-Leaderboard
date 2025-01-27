import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/leaderboard`); // Add `/api/leaderboard`
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    throw error;
  }
};

export const addUser = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/api/leaderboard/add`, {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
};
