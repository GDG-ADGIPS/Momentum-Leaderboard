const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const leaderboardRoutes = require("./routes/leaderboard");
const cron = require("node-cron");
const User = require("./models/User");
const axios = require("axios");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/leaderboard", leaderboardRoutes);

// Daily Update Task
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily update task...");

  try {
    const users = await User.find(); // Fetch all users from the database

    for (const user of users) {
      const username = user.leetcodeID;

      try {
        const response = await axios.get(
          `https://alfa-leetcode-api.onrender.com/${username}/solved`
        );
        const { solvedProblem } = response.data;

        if (solvedProblem) {
          user.questionsSolved = solvedProblem;
          await user.save();
          console.log(`Updated data for user: ${username}`);
        } else {
          console.error(
            `API response invalid for user: ${username}, skipping...`
          );
        }
      } catch (err) {
        console.error(`Error fetching data for user: ${username}`, err.message);
      }
    }

    console.log("Daily update task completed!");
  } catch (err) {
    console.error("Error running daily update task:", err.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
