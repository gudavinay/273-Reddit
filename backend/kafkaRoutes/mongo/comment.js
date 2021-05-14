const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.post("/comment", checkAuth, (req, res) => {
  req.body.path = "comment";
  console.log("**************************");
  console.log(req.body);
  console.log("**************************");
  kafka.make_request("comment", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result.data);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/getCommentsWithPostID", checkAuth, (req, res) => {
  req.body.path = "getCommentsWithPostID";
  kafka.make_request("comment", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result.data);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

module.exports = router;
