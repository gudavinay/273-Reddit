"use strict";
const { createUser } = require("./createUser");
const { getUserProfile } = require("./getUserProfile");

let handle_request = (msg, callback) => {
  switch (msg.path) {
    case "Get-User-Profile":
      getUserProfile(msg, callback);
      break;
    case "Create-User-Profile":
      createUser(msg, callback);
      break;
  }
};
exports.handle_request = handle_request;
