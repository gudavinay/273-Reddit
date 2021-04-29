const express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");

/* get all communities */
app.get("/getAllCommunities", async function (req, res, next) {
    try {
        const { searchText } = req.query;

        const regexSearchText = new RegExp(searchText);

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

        const posts = await Post.find({
            $or: [
                {
                    "title": { $regex: regexSearchText, $options: 'i' }
                },
                {
                    "description": { $regex: regexSearchText, $options: 'i' }
                }
            ]
        });

        res.json({
            communities,
            posts
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;