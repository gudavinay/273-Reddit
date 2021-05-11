"use strict";
const { getCommunitiesForOwner } = require("./getCommunityForOwner");
const { showInvitationStatus } = require("./showInvitationStatus");
const { sendInvite } = require("./sendInvite");
const { getCommunitiesCreatedByMe } = require("./getCommunitiesCreatedByMe");
const { checkModerator } = require("./checkModerator");
const {
  getUsersForCommunitiesForOwner,
} = require("./getUserForCommunityOwner");

let handle_request = (msg, callback) => {
  if (msg.path === "Get-Communities-For-Owner") {
    getCommunitiesForOwner(msg, callback);
  } else if (msg.path === "Get-Users-For-Communities-For-Owner") {
    getUsersForCommunitiesForOwner(msg, callback);
  } else if (msg.path === "Check-Moderator") {
    checkModerator(msg, callback);
  } else if (msg.path === "Get-Communities-Created-By-Me") {
    getCommunitiesCreatedByMe(msg, callback);
  } else if (msg.path === "Show-Invitation-Status") {
    showInvitationStatus(msg, callback);
  } else if (msg.path === "Send-Invite") {
    sendInvite(msg, callback);
  }
};

exports.handle_request = handle_request;
