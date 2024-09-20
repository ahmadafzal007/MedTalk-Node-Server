const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String }, // URL of profile image
  password: { type: String, required: true },
  role: { type: String, enum: ['user','doctor', 'hospital', 'admin'], required: true },
  chatWindows: [
    { type: Schema.Types.ObjectId, ref: 'Chat' } // Reference to multiple chat windows
  ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
