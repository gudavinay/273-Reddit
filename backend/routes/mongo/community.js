var express = require("express");
const { getUserID } = require("../../../frontend/src/services/ControllerUtils");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");

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
    ownerID: getUserID(),
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

app.get("/myCommunity", function (req, res) {
  let data = [];
  Community.find({ ownerID: req.query.ID }).then((result, error) => {
    if (error) {
      res.status(500).send("Error Occured");
    } else {
      const findResult = JSON.parse(JSON.stringify(result));
      findResult.map((community) => {
        Post.find({ communityID: community._id }).then((postResult, error) => {
          console.log(JSON.stringify(postResult.length));
          data.push({
            _id: community._id,
            communityName: community.communityName,
            communityDescription: community.communityDescription,
            imageURL: community.communityImages,
            listOfUsers: community.listOfUsers,
            count: postResult.length,
          });
          console.log(JSON.stringify(data));
          if (result.length == data.length) {
            console.log(JSON.stringify(data));
            res.status(200).send(JSON.stringify(data));
          }
        });
      });
    }
  });
});

app.get("/getCommunityDetails", (req, res) => {
  Community.findOne({
    ownerID: req.body.ownerID,
  })
    .populate("listOfUsers.userID")
    .then((result) => {
      let usersIdOfSQL = [];
      let acceptedIdOfSQL = [];
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
