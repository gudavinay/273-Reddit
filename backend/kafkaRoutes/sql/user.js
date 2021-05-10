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

module.exports = router;
