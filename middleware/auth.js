const jwt = require("jsonwebtoken");

//note for me: this function runs before routes
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "You need to login " });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = auth;
