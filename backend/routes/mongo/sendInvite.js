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
          res.status(200).send(result);
        }
      );
    }
  );
});

app.get("/showInvitationStatus", (req, res) => {
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
      res.status(200).send(data);
    });
});
module.exports = router;
