const mongoose = require('mongoose'); 


const xrayDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  analysisResults: { type: [String], required: true },
  confidenceScores: { type: [Number], required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const XrayData = mongoose.model('XrayData', xrayDataSchema);

module.exports = XrayData;
