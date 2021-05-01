const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommunitySchema = new mongoose.Schema(
  {
    communityIDSQL: {
      type: String,
      required: true,
      unique: true,
    },
    communityName: { type: String, required: true, unique: true },
    communityDescription: { type: String },
    imageURL: [
      {
        url: { type: String },
      },
    ],
    topicSelected: [
      {
        topic: { type: String },
      },
    ],
    listOfUsers: [
      {
        userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
        isAccepted: { type: Boolean, defaultValue: false },
        isModerator: { type: Boolean, defaultValue: false },
      },
    ],
    ownerID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    upvotedBy: [
      {
        userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
      },
    ],
    downvotedBy: [
      {
        userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
      },
    ],
    // posts: [
    //   {
    //     postID: { type: Schema.Types.ObjectId, ref: "Post" }
    //   }
    // ],
    sentInvitesTo: [
      {
        userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
        isAccepted: { type: Boolean, defaultValue: false },
        dateTime: { type: Date, default: Date.now() },
      },
    ],
    rules: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Community", CommunitySchema);
