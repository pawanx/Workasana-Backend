const User = require("../models/User");
const userRouter = require("express").Router();
const auth = require("../middleware/auth");

userRouter.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "failed to get the users" });
    console.log(error);
  }
});

module.exports = userRouter;
