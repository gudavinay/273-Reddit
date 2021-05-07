const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");

app.get("/getMessageForTest", async (req, res) => {
  req.body.path = "Get-Message-For-Test";
  kafka.make_request("msgSQL", req.body, (error, result) => {
    console.log(result);
    if (result.status === 200) {
      return res.status(200).send({});
    }
    return res.status(500).send("No message found");
  });
  //   const getMessage = await db.Message.findAll({ sent_by: 53 });
  //   if (getMessage.length > 0) {
  //     res.status(200).send(getMessage);
  //   } else {
  //     res.status(500).send("No message found");
  //   }
});

module.exports = router;
