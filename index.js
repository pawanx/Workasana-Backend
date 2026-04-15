const tagRoutes = require("./routes/tagRoutes");
const teamRoutes = require("./routes/teamRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { initializeDB } = require("./db/db.connect");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(cors());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await initializeDB();
  isConnected = true;
}

app.use("/reports", reportRoutes);
app.use("/tags", tagRoutes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on the PORT: ${PORT}`);
// });
// export handler (THIS replaces app.listen)
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
