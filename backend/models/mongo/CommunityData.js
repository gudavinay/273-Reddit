const mongoose = require("mongoose");
const CommunitySchema = new mongoose.Schema({
  commu_id_SQL: {
    type: String,
    required: true,
    unique: true
  },
  listOfUser: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: "user_profile" },
      isAccepted: { type: Boolean, defaultValue: false },
      isModerator: { type: Boolean, defaultValue: false }
    }
  ],
  ownerID: { type: Schema.Types.ObjectId, ref: "user_profile" },
  upvotedBy: [
    {
      userID: { type: Schema.Types.ObjectId, ref: "user_profile" }
    }
  ],
  downVotedBy: [
    {
      userID: { type: Schema.Types.ObjectId, ref: "user_profile" }
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
      user_id: { type: Schema.Types.ObjectId, ref: "user_profile" },
      isAccepted: { type: Boolean, defaultValue: false },
      dateTime: { type: Schema.Types.Timestamp }
    }
  ]
});

module.exports = mongoose.model("Community", CommunitySchema);
