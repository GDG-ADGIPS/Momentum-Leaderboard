import React from "react";

const LeaderboardTable = ({ leaderboard }) => {
  return (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name/LeetCode ID</th>
          <th>Questions Solved</th>
          <th>Date Joined</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.username}</td>
            <td>{user.questionsSolved}</td>
            <td>{user.dateJoined}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
