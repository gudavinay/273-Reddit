const mongoose = require('mongoose');
const UserProfileSchema = new mongoose.Schema(
    {
        used_id_SQL:{
            type: String,
            required: true,
            unique: true
        },
        listOfTopics:[{
            type: String
        }],
        communityInvites:[{
            community_id: {
                // type: String
            },
            isAccepted: {
                // type: String
            },
            invitedBy: {
                // type: String
            }
        }]
    }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);