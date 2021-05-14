const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.get("/getAllCommunities", checkAuth, (req, res) => {
    try {
        const { sortKey, sortValue, limit, page, searchText } = req.query;

        kafka.make_request("search_mongo", {
            sortKey, sortValue, limit, page, searchText,
            path: "Get-All-Communities-Search",
            user_id: req.body.user_id
        }, (error, result) => {
            if (result.status === 200) {
                return res.status(200).send(result.data);
            }
            return res.status(500).send(error?.message || result.message);
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;