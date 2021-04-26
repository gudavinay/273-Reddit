const express = require("express");
const db = require("../../models/sql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Util/config");
const { auth } = require("../../Util/passport");
auth();

const router = express.Router();
router.get("/getTopic", async (req, res) => {
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

router.post("/signup", async (req, res) => {
  console.log("Inside Sign up Post Request");
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  try {
    let user = await db.User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });
    user.token = createToken(user);
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
  return res.status(500).send("Internal Server Error!");
});

module.exports = router;
