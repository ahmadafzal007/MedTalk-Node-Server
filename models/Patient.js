const mongoose = require('mongoose');
const { Schema } = mongoose;


const patientSchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Reference to doctor who created the patient
  name: { type: String, required: true },
  cnic: { type: String, required: true }, // National ID
  age: { type: Number, required: true },
  chatWindow: { type: Schema.Types.ObjectId, ref: 'Chat' } // Reference to one chat window

}, { timestamps: true });

// Virtual field to ensure only the doctor who created the patient can view the details
// Method to check if the doctor can view the patient details
patientSchema.methods.canViewDetails = function (doctorId) {
  // Ensure this.doctor is not null before comparing
  return this.doctor && this.doctor.equals(doctorId);
};

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;




