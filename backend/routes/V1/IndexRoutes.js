const express = require('express');

const ServerRouter = express.Router();
const AdminRouter = require('./AdminRoutes')
const HealthCareCenterRouter = require('./HealthCareCenterRoutes')
const HealthCareProfessionalRouter = require('./HealthCareProfessionalRoutes')
const ScholarRouter = require('./ScholarRoutes')
const AuthRouter = require('./AuthRoutes');


router.use("/admin",AdminRouter)
router.use('/healthCareCenter',HealthCareCenterRouter)
router.use('/healthCareProfessional',HealthCareProfessionalRouter)
router.use('/scholar',ScholarRouter),
router.use("/auth",AuthRouter)


module.exports = ServerRouter