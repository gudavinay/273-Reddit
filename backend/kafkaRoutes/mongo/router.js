const express = require("express");
const router = express.Router();

const userRouter = require("./user");
// const indexRouter = require("./index");
// const postRouter = require("./createPost");
const searchRouter = require("./search");
const communityRouter = require("./community");
// const inviteRouter = require("./sendInvite");
// const voteRouter = require("./vote");
const postRouter = require("./post");
const commentRouter = require("./comment");

router.use("/userRouter", userRouter);
// router.use("/indexRouter", indexRouter);
// router.use("/createPost", postRouter);
router.use("/search", searchRouter);
router.use("/communityRouter", communityRouter);
// router.use("/invitation", inviteRouter);
// router.use("/vote", voteRouter);
router.use("/postRouter", postRouter);
router.use("/commentRouter", commentRouter);

module.exports = router;
