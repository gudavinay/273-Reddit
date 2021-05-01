const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new mongoose.Schema(
  {
    postID: { type: Schema.Types.ObjectId, ref: "Post" },
    description: { type: String, required: true },
    parentCommentID: { type: Schema.Types.ObjectId, ref: "Comment" },
    userID: { type: Schema.Types.ObjectId, ref: "UserProfile" },
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
    // subComment: [
    //   {
    //     commentID: { type: Schema.Types.ObjectId, ref: "Comment" },
    //   },
    // ],
    parentCommentID: { type: Schema.Types.ObjectId, ref: "Comment" },
    isParentComment: { type: Boolean, defaultValue: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
