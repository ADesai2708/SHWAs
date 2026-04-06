const express = require('express');
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctor, date, time, isEmergency } = req.body;
    const appointment = new Appointment({
      patient: req.user.id,
      doctor,
      date,
      time,
      isEmergency,
      estimatedWaitTime: isEmergency ? 0 : 30 // Dummy logic
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments for a user (doctor or patient)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' ? { doctor: req.user.id } : { patient: req.user.id };
    // Admins can see all
    if (req.user.role === 'admin') delete query[req.user.role === 'doctor' ? 'doctor' : 'patient'];

    const appointments = await Appointment.find(query).populate('patient', 'name').populate('doctor', 'name');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
