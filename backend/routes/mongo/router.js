const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const indexRouter = require("./index");
const communityRouter = require("./community");

router.use("/userRouter", userRouter);
router.use("/indexRouter", indexRouter);
router.use("/communityRouter", communityRouter);

module.exports = router;
