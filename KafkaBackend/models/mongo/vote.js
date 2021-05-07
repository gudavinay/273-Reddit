const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VoteSchema = new mongoose.Schema(
  {
    entityId: { type: Schema.Types.ObjectId, ref: "Community" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    voteDir: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", VoteSchema);
