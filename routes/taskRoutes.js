const Task = require("../models/Task");
const taskRouter = require("express").Router();
const auth = require("../middleware/auth");

// CREATE
taskRouter.post("/", auth, async (req, res) => {
  const { name, project, team } = req.body;

  if (!name || !project || !team) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
    console.log("Task Post error", error);
  }
});

// GET (with filters)
taskRouter.get("/", auth, async (req, res) => {
  try {
    const { team, status, project, owner } = req.query;

    let filter = {};
    if (team) filter.team = team;
    if (status) filter.status = status;
    if (project) filter.project = project;
    if (owner) filter.owners = { $in: [owner] };

    const tasks = await Task.find(filter)
      .populate("team", "name")
      .populate("project", "name")
      .populate("owners", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
    console.log("Fetch tasks error", error);
  }
});

// UPDATE
taskRouter.patch("/:id", auth, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
    console.log("Delete task error", error);
  }
});

// DELETE
taskRouter.delete("/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask)
      return res.status(404).json({ message: "No task found." });

    res.json({ message: "Task deleted Successfully.", deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
    console.log("Delete task error", error);
  }
});

module.exports = taskRouter;
