const express = require('express');
const userRouter = express.Router();
const {signup,login,logout,protectRoute,user_profile} = require('../Controllers/authController');

userRouter.route('/signup')
    .post(signup)
    .get((req,res)=>res.json({
        message:"get signup called"
    }))

userRouter.route('/login')
    .post(login)
    .get((req,res)=>res.json({
        message:"get login called"
    }))

userRouter.route('/logout')
    .get(logout)

userRouter.use(protectRoute);

userRouter.route('/myprofile')
    .get(user_profile)

// userRouter.route('/addcomplaint')
//     .post(addComplaint)

// <<<<<---------------   here    add_new_project

module.exports = userRouter;