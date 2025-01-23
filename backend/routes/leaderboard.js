const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

router.get("/add", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const response = await axios.get(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`
    );
    const { solvedProblem } = response.data; // Extract 'solvedProblem' field

    if (!solvedProblem) {
      return res.status(500).json({
        message: "Invalid API response",
        error: "Missing 'solvedProblem' in API response",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ leetcodeID: username });
    if (user) {
      user.questionsSolved = solvedProblem; // Update the specific value
      await user.save();
      return res
        .status(200)
        .json({ message: "User updated successfully!", user });
    }

    // Add new user
    user = new User({ leetcodeID: username, questionsSolved: solvedProblem });
    await user.save();
    res.status(201).json({ message: "User added successfully!", user });
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
});

// Get Leaderboard
router.get("/", async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ questionsSolved: -1 });
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
