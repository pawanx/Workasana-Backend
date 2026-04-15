const reportRoutes = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

reportRoutes.get("/", auth, async (req, res) => {
  try {
    // Tasks by Team
    const tasksByTeam = await Task.aggregate([
      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "team",
        },
      },
      { $unwind: "$team" },
      {
        $group: {
          _id: "$team.name",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tasks by Owner
    const tasksByOwner = await Task.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owners",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.name",
          count: { $sum: 1 },
        },
      },
    ]);

    // Weekly tasks
    const weeklyTasks = await Task.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      tasksByTeam,
      tasksByOwner,
      weeklyTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get reports" });
  }
});

module.exports = reportRoutes;
