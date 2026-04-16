const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, specialization } = req.body;

    // ❌ Prevent admin registration
    if (role === 'admin') {
      return res.status(403).json({ error: 'Admins cannot be registered via this endpoint.' });
    }

    // ✅ Allow only valid roles
    const allowedRoles = ['patient', 'doctor'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role provided' });
    }

    let existingUser = null;
    let payload = { name, role, password }; // 🔥 NO HASHING HERE

    // ================= PATIENT =================
    if (role === 'patient') {
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required for patients' });
      }

      existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this phone already exists' });
      }

      if (phone) {
  payload.phone = phone;
}
    }

    // ================= DOCTOR =================
    else if (role === 'doctor') {
      if (!email) {
        return res.status(400).json({ error: 'Email is required for doctors' });
      }

      if (!specialization) {
        return res.status(400).json({ error: 'Specialization is required for doctors' });
      }

      existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      if (email) {
  payload.email = email;
}
      payload.specialization = specialization;
    }

    // ================= SAVE USER =================
    const user = new User(payload);
    await user.save(); // 🔐 password will be hashed in model

    // ================= GENERATE TOKEN =================
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ================= RESPONSE =================
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({
        error: 'Identifier, password, and role are required'
      });
    }

    let query = { role };

    // ================= ROLE-BASED LOGIN =================
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
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 🔐 Use model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // ================= TOKEN =================
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ================= RESPONSE =================
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name || 'Admin',
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
