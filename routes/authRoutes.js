const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    //validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    res.json(newUser);
  } catch (error) {
    //conflict
    res.status(409).json({ message: "User exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ message: "Either mail or password is invalid" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res
      .status(400)
      .json({ message: "Either mail or password is invalid" });

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = router;
