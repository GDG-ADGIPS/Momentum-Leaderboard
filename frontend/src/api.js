import axios from "axios";

const API_URL = "http://localhost:5000/api/leaderboard";

export const fetchLeaderboard = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addUser = async (username) => {
  const response = await axios.get(`${API_URL}/add`, {
    params: { username },
  });
  return response.data;
};
