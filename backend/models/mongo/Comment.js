const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  userIDSQL: {
    type: String,
    required: true,
    unique: true
  },
  description: { type: String, required: true },
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
  subComment: [
    {
      commentID: { type: Schema.Types.ObjectId, ref: "Comment" }
    }
  ],
  isParentComment: { type: Boolean, defaultValue: true }
});

module.exports = mongoose.model("Comment", CommentSchema);
