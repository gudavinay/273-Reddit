const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const indexRouter = require("./index");
const postRouter = require("./createPost");

router.use("/userRouter", userRouter);
router.use("/indexRouter", indexRouter);
router.use("/createPost", postRouter);

module.exports = router;
