var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const User = require("../../models/mongo/UserProfile");

app.post("/sendInvite", (req, res) => {
  Community.findOneAndUpdate(
    { _id: req.body.community_id },
    {
      $push: { sentInvitesTo: [{ userID: req.body.invitedTo }] },
    },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        User.findByIdAndUpdate(
          req.body.invitedTo,
          {
            $push: {
              communityInvites: [
                {
                  communityID: req.body.community_id,
                  invitedBy: req.body.invitedBy,
                },
              ],
            },
          },
          (err, result) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    }
  );
});
//TO show the users who are invited and the status of invitation
app.post("/showInvitationStatus", (req, res) => {
  Community.findOne({ _id: req.body.community_id })
    .populate("sentInvitesTo.userID", ["userIDSQL"])
    .then(async (result) => {
      let data = JSON.parse(JSON.stringify(result));
      delete data.listOfUsers;
      delete data.upvotedBy;
      delete data.downvotedBy;
      delete data.imageURL;
      delete data.posts;
      delete data.rules;
      delete data.topicSelected;
      delete data.createdAt;
      delete data.updatedAt;
      res.status(200).send(data.sentInvitesTo);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/getCommunitiesCreatedByMe", (req, res) => {
  Community.find({ ownerID: req.body.user_id }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      let communities = [];
      result.forEach((element) => {
        let communityDetails = {
          communityName: element.communityName,
          communityID: element._id,
        };
        communities.push(communityDetails);
      });
      res.status(200).send(communities);
    }
  });
});
module.exports = router;
