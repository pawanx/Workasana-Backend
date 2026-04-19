const Project = require("../models/Project");
const projectRouter = require("express").Router();
const auth = require("../middleware/auth");

projectRouter.post("/", auth, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }
  try {
    const project = await Project.create(req.body);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project." });
    console.log(error);
  }
});

projectRouter.get("/", auth, async (req, res) => {
  try {
    res.json(await Project.find());
  } catch (error) {
    res.status(500).json({ message: "Unable to get the projects." });
    console.log(error);
  }
});

projectRouter.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.log("Fetch single project error", error);
    res.status(500).json({ message: "Unable to get project." });
  }
});

// DELETE project
projectRouter.delete("/:id", auth, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully", deletedProject });
  } catch (error) {
    console.log("Delete project error", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

// UPDATE project
projectRouter.patch("/:id", auth, async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (error) {
    console.log("Update project error", error);
    res.status(500).json({ message: "Failed to update project" });
  }
});

module.exports = projectRouter;
