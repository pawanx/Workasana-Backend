const Project = require("../models/Project");
const projectRouter = require("express").Router();
const auth = require("../middleware/auth");

projectRouter.post("/", auth, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project." });
    console.log(error);
  }
});

projectRouter.get("/", async (req, res) => {
  try {
    res.json(await Project.find());
  } catch (error) {
    res.status(500).json({ message: "Unable to get the projects." });
  }
});

projectRouter.get("/:id", async (req, res) => {
  try {
    res.json(await Project.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: "Unable to get the projects." });
  }
});

module.exports = projectRouter;
