const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.post("/login", (req, res) => {
  console.log("sql", req.body);
  req.body.path = "Login";
  kafka.make_request("sql_user_auth", req.body, (error, result) => {
    console.log("came back", result);
    result = JSON.parse(result);
    if (result.status === 200) {
      return res.status(200).send(result.data);
    } else if (result.status === 404) {
      return res.status(404).send("User not found!");
    } else if (result.status === 401) {
      return res.status(401).send("UnAuthorized!");
    }
    return res.status(500).send("Error Occureed");
  });
});

module.exports = router;
