"use strict";
const { createPost } = require("./createPost");
const { getPostsInCommunity } = require("./getPostsInCommunity");
const { getAllPostsWithUserId } = require("./getAllPostsWithUserId");
const { searchPost } = require("./searchPost");

let handle_request = (msg, callback) => {
  if (msg.path === "createPost") {
    createPost(msg, callback);
  } else if (msg.path === "getPostsInCommunity") {
    getPostsInCommunity(msg, callback);
  } else if (msg.path === "getAllPostsWithUserId") {
    getAllPostsWithUserId(msg, callback);
  } else if (msg.path === "Search-Post") {
    searchPost(msg, callback);
  }
};

exports.handle_request = handle_request;
