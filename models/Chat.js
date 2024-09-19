const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user (doctor, hospital, or admin)
  chatHistory: [
    {
      prompt: { type: String, required: true }, // User's prompt
      response: { type: String, required: true }, // System's response
      timestamp: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
