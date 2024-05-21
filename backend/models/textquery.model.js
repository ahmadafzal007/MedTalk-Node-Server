const mongoose = require('mongoose'); 


const textualQuerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  queryText: { type: String, required: true },
  responseText: { type: String, required: true },
  followUpQuestions: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TextualQuery = mongoose.model('TextualQuery', textualQuerySchema);

module.exports = TextualQuery;
