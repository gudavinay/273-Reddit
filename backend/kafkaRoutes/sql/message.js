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

module.exports = router;
