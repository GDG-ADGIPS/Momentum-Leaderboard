import React, { useState, useEffect } from "react";
import { fetchLeaderboard, addUser } from "./api";
function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [leetcodeID, setLeetcodeID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch leaderboard on load
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadLeaderboard();
  }, []);

  const handleAddUser = async () => {
    if (!leetcodeID) return setError("Please enter a LeetCode ID!");
    setLoading(true);
    setError("");

    try {
      const response = await addUser(leetcodeID);
      console.log(response);
      const updatedLeaderboard = await fetchLeaderboard();
      setLeaderboard(updatedLeaderboard);
      setLeetcodeID("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding user!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="navbar">
        <div className="container flex">
          <div>
            <h1>Momentum</h1>
            <span style={{ color: "grey" }}>100 Days of DSA Sprint</span>
          </div>
          <button
            onClick={() => {
              window.location.href =
                "https://gdg-adgips.github.io/Momentum-100-Days-of-DSA-Sprint/";
            }}
          >
            Daily Questions
          </button>
        </div>
      </div>
      <div className="container">
        <div className="hero-section">
          <h1>Track Your LeetCode Progress!</h1>
          <p>
            Enter your LeetCode ID to see how you rank among your peers based on
            questions solved{" "}
            {"(Number of questions solved updates everyday at 00:00)"}.
          </p>
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your LeetCode ID"
            value={leetcodeID}
            onChange={(e) => setLeetcodeID(e.target.value)}
          />
          <button onClick={handleAddUser} disabled={loading}>
            {loading ? "Adding..." : "Add My Stats"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>LeetCode ID</th>
              <th>Questions Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.leetcodeID}>
                <td>{index + 1}</td>
                <td>{user.leetcodeID}</td>
                <td>{user.questionsSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
