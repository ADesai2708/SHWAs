# SHWAS - Hospital Workflow Optimization System
## System Architecture & Documentation

Based on the Software Requirement Specification, the entire project structure has been built in this workspace.

---

### 1. Database Schema (MongoDB / Mongoose)

**User Model (`server/models/User.js`)**
Handles Patients, Doctors, and Admin profiles using Role-Based Access Control (RBAC).
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  
  // Doctor-Specific
  specialization: { type: String }, // e.g. 'Cardiology'
  availability: [{ day: String, start: String, end: String }],
}
```

**Appointment Model (`server/models/Appointment.js`)**
Handles dynamic queue predictions, booking data, and priority indexing.
```javascript
{
  patient: { type: ObjectId, ref: 'User', required: true },
  doctor: { type: ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Waiting', 'In Progress', 'Completed', 'Cancelled'], default: 'Waiting' },
  
  // Smart Logic Trackers
  isEmergency: { type: Boolean, default: false }, // Prioritizes this document in the queue
  estimatedWaitTime: { type: Number, default: 0 }, 
  appointmentType: { type: String, enum: ['Consultation', 'Operation', 'Follow-up'] },
  disease: { type: String },
  history: { type: String }
}
```

---

### 2. REST API Endpoints

**Authentication APIs (`/api/auth`)**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user (Patient/Doctor/Admin) | No |
| `POST` | `/api/auth/login` | Login and receive standard JWT token | No |

**Appointment APIs (`/api/appointments`)**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/appointments/` | Book a new appointment via REST. | Yes (Patient) |
| `GET` | `/api/appointments/` | Get list of appointments mapped appropriately per Role | Yes |
| `PUT` | `/api/appointments/:id` | Update status (e.g. 'Waiting' -> 'Completed') | Yes (Doctor/Admin) |

---

### 3. Smart Algorithms & Priority Logics

**Wait-Time Prediction & Emergency Bypass (`server/utils/calculateWait.js`)**
* When a patient books an appointment, the system evaluates `currentQueueLength` mapping.
* **Emergency Override:** If `isEmergency === true`, the prediction algorithm forces a `0` value wait time. The list logic uses `.sort({ isEmergency: -1, date: 1 })` to shift critical requests organically to the top of the specific doctor's interface list, irrespective of original time booking!

---

### 4. General Setup & Running Instructions

**1. Install Dependencies**
Ensure Node.js is installed. Run the following:
```bash
# Backend (Express Server)
cd server
npm install

# Frontend (React Client)
cd client
npm install
```

**2. Environment Configuration**
Create a `.env` in the `/server` folder (this handles critical JWT configuration):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shwas
JWT_SECRET=supersecret_key_change_me
```

**3. Run the Dual Environment**
Initialize both scripts concurrently in two separate terminal interfaces.
```bash
# Terminal 1: Backend
cd server
node server.js

# Terminal 2: Frontend
cd client
npm run dev
```
