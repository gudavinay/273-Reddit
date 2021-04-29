const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const indexRouter = require("./index");
const postRouter = require("./createPost");
const searchRouter = require("./search");

router.use("/userRouter", userRouter);
router.use("/indexRouter", indexRouter);
router.use("/createPost", postRouter);
router.use("/search", searchRouter);

module.exports = router;
