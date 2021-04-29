const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new mongoose.Schema(
  {
    communityID: { type: Schema.Types.ObjectId, ref: "Community" },
    type: {
      type: Number,
      required: true
    },
    link: { type: String }, // if post type is link, save link otherwise save url of image if post type is image
    description: { type: String },
    title: { type: String, required: true },
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
    comments: [
      {
        commentID: { type: Schema.Types.ObjectId, ref: "Comment" } // list of main comments
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", PostSchema);
