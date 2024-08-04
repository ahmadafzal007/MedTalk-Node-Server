const mongoose = require('mongoose'); 



const annotationSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  datasetType: { type: String, enum: ['ECG', 'X-ray'], required: true },
  datasetPath: { type: String, required: true },
  conflictsResolved: { type: Boolean, default: false },
  pipelineStatus: { type: String, required: true },
  accuracy: { type: Number, required: true },
  f1Score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Annotation = mongoose.model('Annotation', annotationSchema);

module.exports = Annotation;
