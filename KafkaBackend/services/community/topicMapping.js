"use strict";
const { getCommunitiesForOwner } = require("./getCommunityForOwner");
const { showInvitationStatus } = require("./showInvitationStatus");
const { sendInvite } = require("./sendInvite");
const { getCommunitiesCreatedByMe } = require("./getCommunitiesCreatedByMe");
const { checkModerator } = require("./checkModerator");
const { getCommunities } = require("./getCommunities");
const { communityDetails } = require("./communityDetails");
const { getCommunityDetails } = require("./getCommunityDetails");
const {
  getUsersForCommunitiesForOwner,
} = require("./getUserForCommunityOwner");
const { acceptUsersToCommunity } = require("./acceptUsersToCommunity");
const { rejectUsersForCommunity } = require("./rejectUsersForCommunity");
const { getCommunitiesForUser } = require("./getCommunitiesForUser");
const { removeUserFromCommunities } = require("./removeUserFromCommunities");
const { vote } = require("./vote");

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
  } else if (msg.path === "getCommunities") {
    getCommunities(msg, callback);
  } else if (msg.path === "communityDetails") {
    communityDetails(msg, callback);
  } else if (msg.path === "getCommunityDetails") {
    getCommunityDetails(msg, callback);
  } else if (msg.path === "Accept-Users-To-Community") {
    acceptUsersToCommunity(msg, callback);
  } else if (msg.path === "Reject-Users-For-Community") {
    rejectUsersForCommunity(msg, callback);
  } else if (msg.path === "Get-Communities-For-User") {
    getCommunitiesForUser(msg, callback);
  } else if (msg.path === "Remove-User-From-Communities") {
    removeUserFromCommunities(msg, callback);
  } else if (msg.path === "Vote-Community") {
    vote(msg, callback);
  }
};

exports.handle_request = handle_request;
