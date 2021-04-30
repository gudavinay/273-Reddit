var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");

app.post("/addCommunity", function (req, res, next) {
  let topicList = [];
  req.body.selectedTopic.map((topic) => {
    topicList.push({
      topic: topic.topic,
    });
  });
  let community = new Community({
    communityIDSQL: req.body.communityIDSQL,
    communityName: req.body.communityName,
    communityDescription: req.body.communityDescription,
    ownerID: "6089d63ea112c02c1df2914c",
    topicSelected: topicList,
    imageURL: req.body.communityImages,
    rules: req.body.listOfRules,
  });
  community.save((error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error Occured");
    } else {
      res.status(200).send(JSON.stringify(data));
    }
  });
});

app.get("/getCommunityDetails", (req, res) => {
  Community.findOne({
    _id: req.body.community_id,
    ownerID: req.body.ownerID,
  })
    .populate("listOfUsers.userID")
    .then((result) => {
      let usersIdOfSQL = [];
      let acceptedIdOfSQL = [];
      console.log(result.listOfUsers.length);
      for (let i = 0; i < result.listOfUsers.length; i++) {
        if (!result.listOfUsers[i].isAccepted) {
          usersIdOfSQL.push(result.listOfUsers[i].userID.userIDSQL);
        } else {
          acceptedIdOfSQL.push(result.listOfUsers[i].userID.userIDSQL);
        }
      }
      let data = JSON.parse(JSON.stringify(result));
      data.requestedUserSQLIds = usersIdOfSQL;
      data.acceptedUsersSQLIds = acceptedIdOfSQL;
      delete data.listOfUsers;
      delete data.upvotedBy;
      delete data.downvotedBy;
      delete data.sentInvitesTo;
      delete data.imageURL;
      delete data.posts;
      delete data.rules;
      delete data.topicSelected;

      res.status(200).send(data);
    });
});

module.exports = router;
