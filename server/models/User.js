const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { 
    type: String, 
    unique: true, 
    sparse: true,
    default: undefined
  },
  phone: { 
    type: String, 
    unique: true, 
    sparse: true,
    default: undefined
  },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'admin'], 
    default: 'patient' 
  },
  specialization: { type: String },
  availability: [{
    day: String,
    start: String,
    end: String
  }]
}, { timestamps: true });

// 🔐 Hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);