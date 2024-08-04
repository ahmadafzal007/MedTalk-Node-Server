const mongoose = require('mongoose'); 



const healthCareProfessionalSchema = new mongoose.Schema({
   user: {type:mongoose.Schema.Types.ObjectId, ref:"User" , required:true },
  department: { type: String, required: true },
  healthCareCenterId: { type: String , required: true },
  hospitalName: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  VerificationStatus:{
    type:String,
    default:"pending",
    enum:["pending","verified","rejected"]
  } 
});

const HealthCareProfessional = mongoose.model('HealthCareProfessional', healthCareProfessionalSchema);

module.exports = HealthCareProfessional;
