var express = require("express");
const app = require('../../app')
const router = express.Router();
const UserProfile = require('../../models/mongo/UserProfile')
const CommunityInfo = require('../../models/mongo/Community')
const Post = require('../../models/mongo/Post');
const Comment = require('../../models/mongo/Comment');
const passport = require("passport");


app.get("/createDummyData", function (req, res, next) {
  let userProfile = new UserProfile({
    userIDSQL: "2",
    listOfTopics: ["topic1", "topic2"]
    , communityInvites: []
  });
  userProfile.save();

  let community = new CommunityInfo({
    communityIDSQL: "1",
    listOfUsers: [{
      userID: "608749306a3e4d07437c9dc6",
      isAccepted: false,
      isModerator: false
    }],
    ownerID: "608749306a3e4d07437c9dc6",
    upvotedBy: [],
    downvotedBy: [],
    createdDate: Date.now(),
    sentInvitesTo: []
  });
  community.save();

  let post = new Post({
    communityIDSQL:"608753d9749f2e093b5fed3f",
    type:"TEXT",
    link:null,
    description: "This is a dummy post.",
    title: "POST DUMMY TITLE",
    upvotedBy:[],
    downvotedBy:[],
    createdDate:Date.now(),
    comments:[]
  });
  post.save();

  let comment = new Comment({
    postID:"6087559d4a8f9509d698bc9d",
    description: "TEST COMMENT",
    upvotedBy:[],
    downvotedBy:[],
    createdDate: Date.now(),
    subComment:[],
    isParentComment:true
  })

  res.send("inserted the dummy records")
});
module.exports = router;
