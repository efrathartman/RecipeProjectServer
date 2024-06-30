const express=require("express");
const { getAllUsers, signUp, signIn ,isEnabelad} = require("../controller/user.controller");
const { auth } = require("../middlewares/auth");
const router=express.Router();
router.get("/",auth, getAllUsers);
router.get("/isEnabelad",auth,isEnabelad);
router.post('/signin',signIn);
router.post('/signup',signUp)

module.exports=router;