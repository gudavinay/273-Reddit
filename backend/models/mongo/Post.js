const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  commu_id_SQL: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image_url: { type: String, required: true },
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
  CommentID: { type: Schema.Types.ObjectId, ref: "Comment" },
  Comments: [
    {
      comment_id: { type: Schema.Types.ObjectId, ref: "Comment" }
    }
  ]
});

module.exports = mongoose.model("Post", PostSchema);
