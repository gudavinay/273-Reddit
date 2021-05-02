const express = require("express");
const app = require("../../app");
const router = express.Router();
const db = require("../../models/sql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Util/config");
const { auth } = require("../../Util/passport");
auth();
app.post("/login", async (req, res, next) => {
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user === null) {
        return res.status(404).send("User not found!");
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, matchPassword) {
            if (err) return error;
            if (matchPassword) {
              const userLogin = {
                userID: user.user_id,
                token: createToken(user),
              };
              return res.status(200).send(JSON.stringify(userLogin));
            } else {
              return res.status(401).send("UnAuthorized!");
            }
          }
        );
      }
    })
    .catch((err) => {
      return res.status(500).send("Internal Error!");
    });
});

app.post("/signup", async (req, res) => {
  console.log("Inside Sign up Post Request");
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  try {
    let user = await db.User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });
    const userLogin = {
      userID: user.user_id,
      token: createToken(user),
    };
    console.log(user);
    return res.status(200).send(userLogin);
  } catch (error) {
    console.log(error);
  }
  return res.status(500).send("Internal Server Error!");
});

function createToken(user) {
  const payload = { id: user.user_id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000,
  });
  return "JWT " + token;
}

module.exports = router;
