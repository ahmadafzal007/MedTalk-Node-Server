

const mongoose = require('mongoose'); 

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interactions: [{
    queryId: { type: mongoose.Schema.Types.ObjectId, ref: 'TextualQuery' },
    responseId: { type: mongoose.Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
