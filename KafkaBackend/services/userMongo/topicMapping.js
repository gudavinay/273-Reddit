"use strict";
const { createUser } = require("./createUser");
const { getUserProfile } = require("./getUserProfile");
const { getUserDetailsById } = require("./getUserDetails");

let handle_request = (msg, callback) => {
  switch (msg.path) {
    case "Get-User-Profile":
      getUserProfile(msg, callback);
      break;
    case "Create-User-Profile":
      createUser(msg, callback);
      break;
    case "GET-USER-DETAILS-BY-ID":
      getUserDetailsById(msg, callback);
      break;
  }
};
exports.handle_request = handle_request;
