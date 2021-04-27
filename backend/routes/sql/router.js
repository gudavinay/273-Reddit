const express = require("express");
const router = express.Router();

const userRouter = require("./user")
const communityRouter = require("./community")

router.use('/userRouter', userRouter)
router.use('/communityRouter', communityRouter)

module.exports = router;
