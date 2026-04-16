const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const { predictDepartment } = require('./ml/predictSpecialty');
const User = require('./models/User');
const bcrypt = require('bcrypt');


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('declare_emergency', (data) => {
    console.log('Emergency declared:', data);

    // AI/ML Routing Engine Integration
    // Auto-predict specialist mapping using Naive Bayes text classification
    if (data.disease && (data.specialist === 'Pending Allocation' || !data.specialist)) {
      const predictedSpec = predictDepartment(data.disease);
      data.specialist = predictedSpec;
      console.log(`[ML_ROUTER] System automatically predicting ${predictedSpec} for symptoms: ${data.disease}`);
    }

    // Broadcast to all clients (Doctors and Admins will listen to this)
    io.emit('emergency_alert', data);
  });

  socket.on('allocate_emergency', (data) => {
    console.log('Emergency allocated:', data);
    io.emit('emergency_allocated', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB().then(async () => {
  // Initialize default Admin if it doesn't exist
  try {
    const adminExists = await User.findOne({ role: 'admin', username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default Admin user created (username: admin, password: admin123)');
    }
  } catch (err) {
    console.error('Error initializing admin user:', err);
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/apptRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
