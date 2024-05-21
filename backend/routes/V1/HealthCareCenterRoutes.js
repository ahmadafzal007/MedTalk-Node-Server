const express = require('express');
const healthCareCenterRouter  = express.Router();


healthCareCenterRouter.get('/'),(req,res,next)=>{
  res.status(200).json({
    "message":"This is healthCareCenter router"
  })
}


module.exports = healthCareCenterRouter;
