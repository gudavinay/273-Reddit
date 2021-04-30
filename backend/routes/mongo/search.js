const express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const db = require("../../models/sql");
const UserProfile = require("../../models/mongo/UserProfile");

/* get all communities */
app.get("/getAllCommunities", async function (req, res, next) {
    try {
        const { searchText } = req.query;

        const regexSearchText = new RegExp(searchText, "g");

        const communities = await Community.find({
            $or: [
                {
                    "communityName": { $regex: regexSearchText, $options: 'i' }
                },
                {
                    "communityDescription": { $regex: regexSearchText, $options: 'i' }
                }
            ]
        });

        res.json({
            communities
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

/* get Specific user profile data */
app.get("/getUserProfile/:user_id", async function (req, res, next) {
    try {
        const { user_id } = req.params;

        const user = await db.User.findOne({
            where: {
                user_id: user_id
            }
        });
        if (!user) {
            throw new Error(`User Not Found`);
        }

        const mongoUser = await UserProfile.findOne({
            userIDSQL: user_id,
        });
        if (!mongoUser) {
            throw new Error(`Mongo User Not Found`);
        }
        
        const user_communities = await Community.find({
            listOfUsers: {
                $elemMatch: { userID: mongoUser._id, isAccepted: true },
            },
        });

        res.json({
            user,
            // mongoUser,
            user_communities
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;