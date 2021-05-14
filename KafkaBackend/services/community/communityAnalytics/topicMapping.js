"use strict";
const {
  getUsersWithMorePostsForCommunities,
} = require("./getUsersWithMorePostsForCommunities");
const { postUserAnalytics } = require("./postUserAnalytics");

let handle_request = (msg, callback) => {
  if (msg.path === "Community-Analytics") {
    postUserAnalytics(msg, callback);
  } else if (msg.path === "Get-Users-With-More-Posts-For-Communities") {
    getUsersWithMorePostsForCommunities(msg, callback);
  }
};

exports.handle_request = handle_request;
