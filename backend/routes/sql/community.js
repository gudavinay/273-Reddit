const express = require("express");
const router = express.Router();
const app = require("../../app");
const db = require("../../models/sql");

app.get("/getTopic", async (req, res) => {
  const topic = await db.Topic.findAll();
  console.log(topic);
  db.Topic.findAll()
    .then(topic => {
      if (topic === null) {
        return res.status(404).send("Topic not found!");
      } else {
        res.status(200).send(JSON.stringify(topic));
      }
    })
    .catch(err => {
      return res.status(500).send("Internal Error!");
    });
});

app.post("/createCommunity", async (req, res) => {
  console.log("Inside Create Community Request");
  try {
    let community = await db.Community.create({
      name: req.body.communityName,
      description: req.body.communityDescription
    });
    return res.status(200).send(community);
  } catch (error) {
    console.log(error);
  }
});

app.post("/checkForUniqueCommunity", async function (req, res) {
  const findCommunity = await db.Community.findAll({
    where: {
      name: req.body.communityName
    }
  });
  if (findCommunity.length > 0) {
    res.status(500).send("Community is already registered");
  } else {
    res.status(200).send();
  }
});

module.exports = router;
