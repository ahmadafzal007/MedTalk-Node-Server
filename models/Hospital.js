const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  phoneNumber: { type: String, required: true },
  registrationLicenseNumber: { type: String, required: true, unique: true },
  hospitalType: { type: String, enum: ['private', 'public', 'non-profit'], required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  authorizationStatus: { type: Boolean, default: false } // Authorization status
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', hospitalSchema);
module.exports = Hospital;
