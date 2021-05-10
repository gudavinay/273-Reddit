const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.get("/getMessageForTest", checkAuth, async (req, res) => {
  req.body.path = "Get-Message-For-Test";
  kafka.make_request("sql_message", req.body, (error, result) => {
    console.log(result);
    if (result.status === 200) {
      return res.status(200).send({});
    }
    return res.status(500).send("No message found");
  });
});

app.get("/getMessageUserNames", checkAuth, async (req, res) => {
  req.body.ID = req.query.ID;
  req.body.path = "Get-UserName-Chatted";
  kafka.make_request("sql_message", req.body, (error, result) => {
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send("No message found");
  });
});

app.post("/sendMessage", checkAuth, async (req, res) => {
  req.body.path = "Send-Message";
  kafka.make_request("sql_message", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send("No message found");
  });
});

app.get("/getMessage", checkAuth, async (req, res) => {
  req.body.ID = req.query.ID;
  req.body.chatWith = req.query.chatWith;
  req.body.path = "Get-Message-Between-User";
  kafka.make_request("sql_message", req.body, (error, result) => {
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send("No message found");
  });
});

module.exports = router;
