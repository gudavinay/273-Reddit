var express = require("express");
const app = require("../../app");
const router = express.Router();

const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.post("/addVote", checkAuth, (req, res) => {
  req.body.path = "addVote";
  console.log("redq.boody vote ", req.body);
  kafka.make_request("vote_mongo", req.body, (error, result) => {
    console.log("result vote = ", result);
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("Internal Server Error");
  });
});

app.get("/getVote", checkAuth, (req, res) => {
  console.log(req.query);
  req.body.entityId = req.query.entityId;
  req.body.path = "getVote";

  kafka.make_request("vote_mongo", req.body, (error, result) => {
    console.log(result);
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("Internal Server Error");
  });
});

app.post("/vote", checkAuth, (req, res) => {
  req.body.path = "vote";
  kafka.make_request("vote_mongo", req.body, (error, result) => {
    console.log(result);
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("Internal Server Error");
  });
});

module.exports = router;
