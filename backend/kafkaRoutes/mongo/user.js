const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.get("/getUserProfile", (req, res) => {
  console.log("mongo", req.query);
  req.body.ID = req.query.ID;
  req.body.path = "Get-User-Profile";
  kafka.make_request("mongo_user", req.body, (error, result) => {
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("Error Occureed");
  });
});

app.post("/createUserProfile", (req, res) => {
  req.body.path = "Create-User-Profile";
  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(JSON.stringify(result));
    }
    return res.status(500).send(error);
  });
});

module.exports = router;
