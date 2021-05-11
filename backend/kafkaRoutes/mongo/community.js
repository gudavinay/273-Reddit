const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.get("/getCommunitiesForOwner", checkAuth, async (req, res) => {
  console.log(req.query);
  req.body.path = "Get-Communities-For-Owner";
  req.body.ID = req.query.ID;
  req.body.page = req.query.page;
  req.body.size = req.query.size;
  req.body.search = req.query.search;
  kafka.make_request("mongo_community", req.body, (error, result) => {
    console.log(result);
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("No communities found");
  });
});

app.get("/getUsersForCommunitiesForOwner", checkAuth, (req, res) => {
  req.body.ID = req.query.ID;
  req.body.path = "Get-Users-For-Communities-For-Owner";
  kafka.make_request("mongo_community", req.body, (error, result) => {
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("No Users found");
  });
});

app.get("/checkUserIsModerator/:id", (req, res) => {
  console.log("checking user is moderator");
  req.body.user_id = req.params.id;
  req.body.path = "Check-Moderator";

  kafka.make_request("mongo_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });

  // Community.find({ ownerID: user_id }).then((result) => {
  //   let Communities = {
  //     length: result.length,
  //   };
  //   res.status(200).send(Communities);
  // });
});
module.exports = router;
