"use strict";
const { createUser } = require("./createUser");
const { getUserProfile } = require("./getUserProfile");
const { getUserDetailsById } = require("./getUserDetails");
const { getSearchedUserForMongo } = require("./getSearchedUserForMongo");
const { getNotificationData } = require("./getNotificationData");
const { acceptInvite } = require("./acceptInvite");
const { rejectInvite } = require("./rejectInvite");
const { getUserProfileByMongoID } = require("./getUserProfileByMongoID");
const { requestedUserForCom } = require("./requestedUserForCom");
const { getListedUserDetails } = require("./getListedUserDetails");

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
    case "Get-Searched-User-For-Mongo":
      getSearchedUserForMongo(msg, callback);
      break;
    case "Get-Notification-Data":
      getNotificationData(msg, callback);
      break;
    case "Accept-Invite-As-User":
      console.log("Accept Called!!!!");
      acceptInvite(msg, callback);
      break;
    case "Reject-Invite-As-User":
      rejectInvite(msg, callback);
      break;
    case "Get-User-Profile-By-MongoID":
      getUserProfileByMongoID(msg, callback);
      break;
    case "Requested-Users-For-Com":
      requestedUserForCom(msg, callback);
      break;
    case "Get-Listed-User-Details":
      getListedUserDetails(msg, callback);
      break;
  }
};
exports.handle_request = handle_request;
