const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, specialization } = req.body;

    if (role === 'admin') {
      return res.status(403).json({ error: 'Admins cannot be registered via this endpoint.' });
    }

    let existingUser = null;
    let payload = { name, role };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    payload.password = hashedPassword;

    if (role === 'patient') {
      if (!phone) return res.status(400).json({ error: 'Phone number is required for patients' });
      existingUser = await User.findOne({ phone });
      if (existingUser) return res.status(400).json({ error: 'User with this phone number already exists' });
      payload.phone = phone;
    } else if (role === 'doctor') {
      if (!email) return res.status(400).json({ error: 'Email is required for doctors' });
      if (!specialization) return res.status(400).json({ error: 'Specialization is required for doctors' });
      existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'User with this email already exists' });
      payload.email = email;
      payload.specialization = specialization;
    } else {
      return res.status(400).json({ error: 'Invalid role provided' });
    }

    const user = new User(payload);
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    
    if (!identifier || !password || !role) {
       return res.status(400).json({ error: 'Identifier, password, and role are required' });
    }

    let query = { role };
    if (role === 'patient') {
      query.phone = identifier;
    } else if (role === 'doctor') {
      query.email = identifier;
    } else if (role === 'admin') {
      query.username = identifier;
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, user: { id: user._id, name: user.name || 'Admin', role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
