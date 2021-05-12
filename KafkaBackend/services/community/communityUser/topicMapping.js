"use strict";
const { userJoinRequestToCommunity } = require("./userJoinRequestToCommunity");
const {
  userLeaveRequestFromCommunity
} = require("./userLeaveRequestFromCommunity");

let handle_request = (msg, callback) => {
  if (msg.path === "userJoinRequestToCommunity") {
    userJoinRequestToCommunity(msg, callback);
  } else if (msg.path === "userLeaveRequestFromCommunity") {
    userLeaveRequestFromCommunity(msg, callback);
  }
};

exports.handle_request = handle_request;
