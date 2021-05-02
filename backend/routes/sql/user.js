const express = require("express");
const app = require("../../app");
const router = express.Router();
const db = require("../../models/sql");
const { auth } = require("../../Util/passport");
const { Op } = require("sequelize");
auth();

app.get("getListedUserDetails", async (req, res, next) => {
  db.User.find({
    where: {},
  });
});
module.exports = router;
