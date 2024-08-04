const express = require('express');
const AdminRouter  = express.Router();
const AdminController = require('../../controllers/AdminController');


AdminRouter.post('/verifyCenter', AdminController.verifyCenter);


module.exports = AdminRouter;
