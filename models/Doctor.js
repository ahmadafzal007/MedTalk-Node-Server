const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  medicalLicenseNumber: { type: String, required: true, unique: true },
  specialization: { type: String, required: true }, // E.g. Cardiologist, Pediatrician
  department: { type: String, required: true }, // E.g. Cardiology, Surgery
  hospitalAssociated: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true }, // Reference to hospital
  authorizationStatus: { type: Boolean, default: false }, // Authorization status
  chatWindows: [
    { type: Schema.Types.ObjectId, ref: 'Chat' } // Reference to multiple chat windows
  ]
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
