const express = require('express');

const router = express.Router();
const AdminRouter = require('./AdminRoutes')
const HealthCareCenterRouter = require('./HealthCareCenterRoutes')
const HealthCareProfessionalRouter = require('./HealthCareProfessionalRoutes')
const ScholarRouter = require('./ScholarRoutes')

router.get("/admin",AdminRouter)
router.get('/healthCareCenter',HealthCareCenterRouter)
router.get('/healthCareProfessional',HealthCareProfessionalRouter)
router.get('/scholar',ScholarRouter)


module.exports = router