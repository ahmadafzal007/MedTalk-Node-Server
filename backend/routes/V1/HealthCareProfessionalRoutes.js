const express = require('express');
const HealthCareProfessionalRouter  = express.Router();


HealthCareProfessionalRouter.get('/'),(req,res,next)=>{
  res.status(200).json({
    "message":"This is admin router"
  })
}


module.exports = HealthCareProfessionalRouter;
