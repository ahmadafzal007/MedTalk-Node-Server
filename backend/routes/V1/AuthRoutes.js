const express = require('express');
const AuthRouter  = express.Router();
const AuthController = require('../../controllers/AuthController');




AuthRouter.post("/register", AuthController.signup)
AuthRouter.post("/login", AuthController.login)


//  healthcare professionals
// healthcare Centers
// Scholar
// admin






module.exports = AuthRouter;
