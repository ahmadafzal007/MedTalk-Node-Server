const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  prompt: { type: String, required: true }, // User's prompt
  response: { type: String, required: true }, // System's response
  plot_url: { type: String }, // Optional image URL
  image_url: { type: String }, // Optional image URL
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new Schema({
  users: [
    { type: Schema.Types.ObjectId, ref: 'User', required: true } // Both doctor and base user
  ],
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' }, // Reference to patient (only one per chat for patient chats)
  messages: [messageSchema], // List of messages in the chat window
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;








