const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.post("/createPost", checkAuth, function (req, res, next) {
  req.body.path = "createPost";
  kafka.make_request("post", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result.data);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.get("/getPostsInCommunity", checkAuth, (req, res) => {
  req.body.path = "getPostsInCommunity";
  req.body.query = req.query;
  kafka.make_request("post", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result.data);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/getAllPostsWithUserId", checkAuth, (req, res) => {
  req.body.path = "getAllPostsWithUserId";
  kafka.make_request("post", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result.data);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/searchForPosts", (req, res) => {
  console.log(req.body.search);
  req.body.search = req.body.search;
  req.body.user_id = req.body.user_id;
  req.body.path = "Search-Post";
  kafka.make_request("post", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

module.exports = router;
