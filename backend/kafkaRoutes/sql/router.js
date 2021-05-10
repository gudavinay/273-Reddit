const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const userAuth = require("./userAuth");
// const communityRouter = require("./community");
const messageRouter = require("./message");

router.use("/userRouter", userRouter);
router.use("/userAuth", userAuth);
// router.use("/communityRouter", communityRouter);
router.use("/messageRouter", messageRouter);

module.exports = router;
