const mongoose = require("mongoose");
const CommunitySchema = new mongoose.Schema({
  communityIDSQL: {
    type: String,
    required: true,
    unique: true
  },
  listOfUsers: [
    {
      userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
      isAccepted: { type: Boolean, defaultValue: false },
      isModerator: { type: Boolean, defaultValue: false }
    }
  ],
  ownerID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
  upvotedBy: [
    {
      userID: { type: Schema.Types.ObjectId, ref: "UserProfile" }
    }
  ],
  downvotedBy: [
    {
      userID: { type: Schema.Types.ObjectId, ref: "UserProfile" }
    }
  ],
  creationDate: { type: Schema.Types.Timestamp },
  posts: [
    {
      postID: { type: Schema.Types.ObjectId, ref: "Post" }
    }
  ],
  sentInvitesTo: [
    {
      userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
      isAccepted: { type: Boolean, defaultValue: false },
      dateTime: { type: Schema.Types.Timestamp }
    }
  ]
});

module.exports = mongoose.model("Community", CommunitySchema);
