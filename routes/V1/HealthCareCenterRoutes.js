const express = require('express');
const healthCareCenterRouter  = express.Router();
const healthCareCenterController = require('../../controllers/HealthCareCenterController');
const passport = require('passport');

require('../../Config/passport')(passport);


healthCareCenterRouter.get('/hospitals', healthCareCenterController.getHospitals)
healthCareCenterRouter.get("/pendingDoctors",passport.authenticate('jwt',{session:false}), healthCareCenterController.getPendingProfessionals)
healthCareCenterRouter.post("/verify",healthCareCenterController.verify)



module.exports = healthCareCenterRouter;
