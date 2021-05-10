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
    console.log("came back", result.data);
    if (result.status === 200) {
      const userLogin = {
        userID: result.data,
        token: createToken(result.data),
      };
      return res.status(200).send(JSON.stringify(userLogin));
    } else if (result.status === 404) {
      return res.status(404).send("User not found!");
    } else if (result.status === 401) {
      return res.status(401).send("UnAuthorized!");
    }
    return res.status(500).send("Error Occureed");
  });
});

function createToken(user) {
  const payload = { id: user.user_id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000,
  });
  return "JWT " + token;
}

module.exports = router;
