const mongoose = require('mongoose'); 



const healthCareCenterSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  HealthCareProfessionals:[
    {
      type:mongoose.Schema.Types.ObjectId, ref:"HealthCareProfessional"
    }
  ],
  verificationStatus:{
    type:String,
    default:"pending",
    enum:["pending","verified","rejected"]
  }
});

const HealthCareCenter = mongoose.model('HealthCareCenter', healthCareCenterSchema);

module.exports = HealthCareCenter;
