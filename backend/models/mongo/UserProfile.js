const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserProfileSchema = new mongoose.Schema({
  userIDSQL: {
    type: String,
    required: true,
    unique: true
  },
  listOfTopics: [{ type: String }],
  communityInvites: [
    {
      communityID: {
        type: Schema.Types.ObjectId,
        ref: "Community"
      },
      isAccepted: {
        type: Boolean,
        defaultValue: false
      },
      invitedBy: {
        type: Schema.Types.ObjectId,
        ref: "UserProfile"
      }
    }
  ]
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
