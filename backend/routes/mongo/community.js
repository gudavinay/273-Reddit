var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");

app.post("/addCommunity", function (req, res, next) {
  let topicList = [];
  req.body.selectedTopic.map(topic => {
    topicList.push({
      topic: topic.topic
    });
  });
  let community = new Community({
    communityIDSQL: req.body.communityIDSQL,
    communityName: req.body.communityName,
    communityDescription: req.body.communityDescription,
    ownerID: "6089d63ea112c02c1df2914c",
    topicSelected: topicList,
    imageURL: req.body.communityImages,
    rules: req.body.listOfRules
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
  Community.find({ _id: req.body.community_id })
    .populate("posts.postID")
    .then(result => {
      res.send(result);
    });
});

module.exports = router;
