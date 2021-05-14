const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserProfileSchema = new mongoose.Schema({
  userIDSQL: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  profile_picture_url: {
    type: String
  },
  listOfTopics: [
    {
      topic: { type: String }
    }
  ],
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
      },
      dateTime: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
