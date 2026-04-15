// This loads the dotenv library and immediately calls .config(). It looks for a file named .env in your project root and loads the variables defined there into process.env. This prevents you from hardcoding sensitive database URLs in your source code.
require("dotenv").config();
const mongoose = require("mongoose");

const MONGOOSEURI = process.env.MONGODB;

const initializeDB = async () => {
  try {
    await mongoose.connect(MONGOOSEURI);

    console.log("----DB Connected successfully.----");
  } catch (error) {
    console.log("----DB connection failed.----", error.message);
    process.exit(1); //server stops if DB fails
  }
};

module.exports = { initializeDB };
// module.exports is the object that actually gets returned when someone calls require() on your file.
// It is equivalent to writing:
// module.exports = { initializeDB: initializeDB };
// Destructuring and add more properties later
