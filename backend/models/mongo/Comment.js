const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  user_id_SQL: {
    type: String,
    required: true,
    unique: true
  },
  content: { type: String, required: true },
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
  SubComment: [
    {
      comment_ID: { type: Schema.Types.ObjectId, ref: "Comment" }
    }
  ],
  isParentComment: { type: Boolean, defaultValue: true }
});

module.exports = mongoose.model("Comment", CommentSchema);
