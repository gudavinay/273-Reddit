const express = require("express");
const db = require("../../models/sql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Util/config");
const { auth } = require("../../Util/passport");
const app = require('../../app')
auth();

const router = express.Router();
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

app.post("/createTopic", async (req, res) => {
  try{
    const topic = await db.Topic.create({
      topic: req.body.topic
    });
    // console.log(topic);
  } catch(error){
    console.log(error);
  }
  
});

module.exports = router;
