const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  isEmergency: { type: Boolean, default: false },
  estimatedWaitTime: { type: Number, default: 0 } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
