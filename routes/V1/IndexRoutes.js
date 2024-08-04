const express = require('express');

const ServerRouter = express.Router();
const AdminRouter = require('./AdminRoutes')
const HealthCareCenterRouter = require('./HealthCareCenterRoutes')
const HealthCareProfessionalRouter = require('./HealthCareProfessionalRoutes')
const ScholarRouter = require('./ScholarRoutes')
const AuthRouter = require('./AuthRoutes');


ServerRouter.use("/admin",AdminRouter)
ServerRouter.use('/healthCareCenter',HealthCareCenterRouter)
ServerRouter.use('/healthCareProfessional',HealthCareProfessionalRouter)
ServerRouter.use('/scholar',ScholarRouter),
ServerRouter.use("/auth",AuthRouter)


module.exports = ServerRouter