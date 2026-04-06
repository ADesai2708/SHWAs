const Appointment = require('../models/Appointment');
const calculateWaitTime = require('../utils/calculateWait');

exports.createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, isEmergency } = req.body;
    
    // Simulate finding queue length for this doctor
    const queueLength = await Appointment.countDocuments({ doctor, status: 'scheduled' });
    const waitTime = calculateWaitTime(isEmergency, queueLength);

    const appointment = new Appointment({
      patient: req.user.id,
      doctor,
      date,
      time,
      isEmergency,
      estimatedWaitTime: waitTime
    });
    
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'doctor' ? { doctor: req.user.id } : { patient: req.user.id };
    if (req.user.role === 'admin') delete query[req.user.role === 'doctor' ? 'doctor' : 'patient'];

    // Sort by emergency first (priority) then by date
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ isEmergency: -1, date: 1, time: 1 });
      
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
