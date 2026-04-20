const Team = require("../models/Team");
const teamRouter = require("express").Router();
const auth = require("../middleware/auth");

teamRouter.post("/", async (req, res) => {
  const team = await Team.create(req.body);
  res.json(team);
});

teamRouter.get("/", async (req, res) => {
  const foundTeam = await Team.find();
  res.json(foundTeam);
});

teamRouter.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "name email",
    );
    console.log(team);
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Failed to get team" });
  }
});

teamRouter.patch("/:id/add-member", auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // prevent duplicates
    if (team.members.includes(userId)) {
      return res.json(team);
    }

    team.members.push(userId);
    await team.save();

    const updatedTeam = await Team.findById(req.params.id).populate(
      "members",
      "name email",
    );

    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Failed to add member" });
  }
});

// REMOVE MEMBER
teamRouter.patch("/:id/remove-member", auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // remove user
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== userId,
    );

    await team.save();

    // return populated team
    const updatedTeam = await Team.findById(req.params.id).populate(
      "members",
      "name email",
    );

    res.json(updatedTeam);
  } catch (error) {
    console.log("Remove member error", error);
    res.status(500).json({ message: "Failed to remove member" });
  }
});
module.exports = teamRouter;
