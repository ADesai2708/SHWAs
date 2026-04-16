const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  // Doctor specific fields:
  specialization: { type: String },
  availability: [{
    day: String,
    start: String,
    end: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
