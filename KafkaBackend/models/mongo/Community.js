const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const CommunitySchema = new mongoose.Schema(
  {
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
        isAccepted: { type: Number, default: 0 },
        isModerator: { type: Boolean, defaultValue: false },
      },
    ],
    ownerID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    NoOfPost: { type: Number },
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
    score: { type: Number, default: 0 },
    // posts: [
    //   {
    //     postID: { type: Schema.Types.ObjectId, ref: "Post" }
    //   }
    // ],
    sentInvitesTo: [
      {
        userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
        isAccepted: { type: Number, default: 0 },
        dateTime: { type: Date, default: Date.now },
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

CommunitySchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Community", CommunitySchema);
