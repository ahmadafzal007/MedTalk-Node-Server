const express = require('express');
const AdminRouter  = express.Router();


AdminRouter.get('/'),(req,res,next)=>{
  res.status(200).json({
    "message":"This is admin router"
  })
}


module.exports = AdminRouter;
