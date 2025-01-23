import React, { useState } from "react";

const InputForm = ({ addUser }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      addUser(username.trim());
      setUsername(""); // Clear input
    }
  };

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Enter your LeetCode ID"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Add My Stats</button>
      </form>
    </div>
  );
};

export default InputForm;
