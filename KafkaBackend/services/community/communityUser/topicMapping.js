"use strict";
const { userJoinRequestToCommunity } = require("./userJoinRequestToCommunity");
const {
  userLeaveRequestFromCommunity
} = require("./userLeaveRequestFromCommunity");

let handle_request = (msg, callback) => {
  if (msg.path === "Create-Community") {
    userJoinRequestToCommunity(msg, callback);
  } else if (msg.path === "Edit-Community") {
    userLeaveRequestFromCommunity(msg, callback);
  }
};

exports.handle_request = handle_request;
