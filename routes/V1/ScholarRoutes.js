const express = require('express');
const ScholarRouter  = express.Router();


ScholarRouter.get('/'),(req,res,next)=>{
  res.status(200).json({
    "message":"This is scholar router"
  })
}


module.exports = ScholarRouter;
