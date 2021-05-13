const express = require("express");
const app = require("../../app");
const router = express.Router();
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.post("/getSearchedUser", checkAuth, async (req, res) => {
  req.body.path = "Search-User";
  kafka.make_request("user_info", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.get("/getTopic", checkAuth, async (req, res) => {
  kafka.make_request("get_topic", req.query, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/addTopic", async (req, res) => {
  req.body.path = "addTopic";
  console.log("calling kafka for topic");
  kafka.make_request("manage_topic", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/deleteTopic", async (req, res) => {
  req.body.path = "deleteTopic";
  kafka.make_request("manage_topic", req.body, (error, result) => {
    console.log(result);
    if (result) {
      res.status(200).send({ msg: "deleted" });
    } else {
      res.status(500).send(error);
    }
  });
});

app.post("/editTopic", async (req, res) => {
  req.body.path = "editTopic";
  console.log("calling kafka for topic");
  kafka.make_request("manage_topic", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});
module.exports = router;
