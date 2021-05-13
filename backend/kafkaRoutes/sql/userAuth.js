const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { secret } = require("../../Util/config");
const { auth } = require("../../Util/passport");
const jwt = require("jsonwebtoken");
auth();

app.post("/login", (req, res) => {
  console.log("sql", req.body);
  req.body.path = "Login";
  kafka.make_request("sql_user_auth", req.body, (error, result) => {
    console.log("came back", result);
    if (error) {
      return res.status(500).send(error);
    } else {
      if (result == "Username or password mismatch") {
        return res.status(200).send(JSON.stringify(result));
      } else {
        const userLogin = {
          userID: result,
          token: createToken(result)
        };
        return res.status(200).send(JSON.stringify(userLogin));
      }
    }
  });
});

app.post("/signup", async (req, res) => {
  console.log("Inside Sign up Post Request");
  req.body.path = "SignUp";
  kafka.make_request("sql_user_auth", req.body, (error, result) => {
    if (result) {
      const userLogin = {
        userID: result.user_id,
        token: createToken(result)
      };
      return res.status(200).send(JSON.stringify(userLogin));
    }
    return res.status(500).send(error);
  });
});

function createToken(user) {
  const payload = { id: user.user_id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000
  });
  return "JWT " + token;
}

module.exports = router;
