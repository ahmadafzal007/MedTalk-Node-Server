const mongoose = require('mongoose'); 



const healthCareCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  HealthCareProfessionals:[
    {
      type:mongoose.Schema.Types.ObjectId, ref:"HealthCareProfessional"
    }
  ],
  VerificationStatus:{
    type:Boolean, default: false,
  }
});

const HealthCareCenter = mongoose.model('HealthCareCenter', healthCareCenterSchema);

module.exports = HealthCareCenter;
