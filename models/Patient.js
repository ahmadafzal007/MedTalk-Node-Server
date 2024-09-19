const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Reference to doctor who created the patient
  name: { type: String, required: true },
  cnic: { type: String, required: true, unique: true }, // National ID
  age: { type: Number, required: true },
  chatHistory: [
    { type: Schema.Types.ObjectId, ref: 'Chat' } // Reference to chat history
  ]
}, { timestamps: true });

// Virtual field to ensure only the doctor who created the patient can view the details
patientSchema.virtual('canViewDetails').get(function (doctorId) {
  return this.doctor.equals(doctorId);
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
