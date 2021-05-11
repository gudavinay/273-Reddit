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
});

app.post("/addCommunity", checkAuth, function (req, res) {
  req.body.path = "Create-Community";
  kafka.make_request("manage_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/editCommunity", checkAuth, async (req, res) => {
  req.body.path = "Edit-Community";
  kafka.make_request("manage_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send("Community is already registered");
  });
});

app.post("/deleteCommunity", checkAuth, (req, res) => {
  req.body.path = "Delete-Community";
  kafka.make_request("manage_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.get("/communityAnalystics", checkAuth, async function (req, res) {
  req.body.path = "Community-Analytics";
  req.body.ID = req.query.ID;
  kafka.make_request("community_analytics", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/getCommunitiesCreatedByMe", checkAuth, (req, res) => {
  req.body.user_id = req.body.user_id;
  req.body.path = "Get-Communities-Created-By-Me";
  console.log(req.body);
  kafka.make_request("mongo_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/showInvitationStatus", checkAuth, async (req, res) => {
  req.body.page = req.body.page;
  req.body.size = req.body.size;
  req.body.path = "Show-Invitation-Status";
  req.body.community_id = req.body.community_id;

  kafka.make_request("mongo_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.post("/sendInvite", checkAuth, async (req, res) => {
  var members = [];
  req.body.users.forEach((user) => {
    const userData = {
      userID: user.user_id,
    };
    members.push(userData);
  });
  console.log(members);
  (req.body.community_id = req.body.community_id),
    (req.body.members = members),
    (req.body.invitedBy = req.body.invitedBy);
  req.body.path = "Send-Invite";

  kafka.make_request("mongo_community", checkAuth, req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.get("/getCommunities", checkAuth, function (req, res, next) {
  req.body.path = "getCommunities"
  kafka.make_request("mongo_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});

app.get("/communityDetails", checkAuth, function (req, res, next) {
  req.body.path = "communityDetails"
  kafka.make_request("mongo_community", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    console.log(error);
    return res.status(500).send(error);
  });
});


module.exports = router;
