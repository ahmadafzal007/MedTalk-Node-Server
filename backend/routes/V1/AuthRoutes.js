const express = require('express');
const AuthRouter  = express.Router();


AuthRouter.get('/'),(req,res,next)=>{
  res.status(200).json({
    "message":"This is auth router"
  })
}


module.exports = AuthRouter;
