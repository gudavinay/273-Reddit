const express=require('express');
const router = express.Router();

const userRouter=require('./user')

router.use('/userRouter', userRouter)

module.exports=router;