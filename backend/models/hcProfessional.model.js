const mongoose = require('mongoose'); 



const healthCareProfessionalSchema = new mongoose.Schema({
   user: {tpe:mongoose.Schema.Types.ObjectId, ref:"User" , required:true },
  department: { type: String, required: true },
  healthCareCenterId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthCareCenter', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  VerificationStatus:{
    type:Boolean, default: false,
  } 
});

const HealthCareProfessional = mongoose.model('HealthCareProfessional', healthCareProfessionalSchema);

module.exports = HealthCareProfessional;
