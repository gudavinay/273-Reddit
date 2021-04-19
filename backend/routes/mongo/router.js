const express=require('express');
const router = express.Router();

const userRouter = require('./user')
const indexRouter = require('./index')

router.use('/userRouter', userRouter)
router.use('/indexRouter', indexRouter)

module.exports=router;