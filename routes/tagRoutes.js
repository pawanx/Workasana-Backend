const Tag = require("../models/Tag");
const tagRouter = require("express").Router();

tagRouter.post("/", async (req, res) => {
  const tag = await Tag.create(req.body);
  res.json(tag);
});

tagRouter.get("/", async (req, res) => {
  const foundTag = await Tag.find();
  res.json(foundTag);
});

module.exports = tagRouter;
