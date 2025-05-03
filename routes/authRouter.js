const express = require("express");
const authRouter = express.Router();
const authController = require('../controller/authController');

authRouter.get("/login", authController.getLogin);
authRouter.post('/login',authController.postLogin);
authRouter.post('/logout',authController.postLogout);
authRouter.get('/signup',authController.getsignUp);
authRouter.post('/signup', authController.postsignUp);
module.exports = authRouter;


