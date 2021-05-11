"use strict";
const { getCommunitiesForOwner } = require("./getCommunityForOwner");
const {
  getUsersForCommunitiesForOwner
} = require("./getUserForCommunityOwner");

let handle_request = (msg, callback) => {
  if (msg.path === "Get-Communities-For-Owner") {
    getCommunitiesForOwner(msg, callback);
  } else if (msg.path === "Get-Users-For-Communities-For-Owner") {
    getUsersForCommunitiesForOwner(msg, callback);
  }
};

exports.handle_request = handle_request;
