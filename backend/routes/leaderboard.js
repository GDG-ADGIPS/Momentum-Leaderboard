const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

router.get("/add", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            count
          }
        }
      }
    }
  `;

  const variables = {
    username: username,
  };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql/",
      {
        query: query,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log the full response for debugging
    console.log("Full API Response:", JSON.stringify(response.data, null, 2));

    // Extract the first item from acSubmissionNum array (change index if needed)
    const solvedProblem =
      response.data.data.matchedUser?.submitStatsGlobal?.acSubmissionNum[0]
        ?.count;

    if (solvedProblem === null || solvedProblem === undefined) {
      return res.status(500).json({
        message: "Invalid API response",
        error: "Missing 'acSubmissionNum' in API response",
        response: response.data, // Include the full response for debugging
      });
    }

    // Check if the user already exists
    let user = await User.findOne({ leetcodeID: username });
    if (user) {
      user.questionsSolved = solvedProblem; // Update the number of solved questions
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
