const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  communityIDSQL: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
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
  creationDate: { type: Schema.Types.Timestamp }, // TODO : Check if timestamp works fine
  comments: [
    {
      commentID: { type: Schema.Types.ObjectId, ref: "Comment" } // list of main comments
    }
  ]
});

module.exports = mongoose.model("Post", PostSchema);
