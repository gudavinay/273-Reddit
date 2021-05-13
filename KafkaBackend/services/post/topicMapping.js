"use strict";
const { createPost } = require("./createPost");
const { getPostsInCommunity } = require("./getPostsInCommunity");
const { getAllPostsWithUserId } = require("./getAllPostsWithUserId");
const { searchPost } = require("./searchPost");
const { getAllCommunitiesListForUser } = require('../community/getAllCommunitiesListForUser')

let handle_request = (msg, callback) => {
  if (msg.path === "createPost") {
    createPost(msg, callback);
  } else if (msg.path === "getPostsInCommunity") {
    getPostsInCommunity(msg, callback);
  } else if (msg.path === "getAllPostsWithUserId") {
    getAllPostsWithUserId(msg, callback);
  } else if (msg.path === "Search-Post") {
    searchPost(msg, callback);
  } else if (msg.path === "getAllCommunitiesListForUser") {
    getAllCommunitiesListForUser(msg, callback);
  }
};

exports.handle_request = handle_request;
