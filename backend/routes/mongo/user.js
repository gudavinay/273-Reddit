var express = require("express");
const app = require('../../app')
const router = express.Router();
const UserProfile = require('../../models/mongo/UserProfile')


app.get("/createUser", function (req, res, next) {
  let userProfile = new UserProfile({userIDSQL:"1111"});
  userProfile.save();
});
module.exports = router;
