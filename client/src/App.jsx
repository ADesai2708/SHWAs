import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDash from './pages/PatientDash';
import DoctorDash from './pages/DoctorDash';
import AdminDash from './pages/AdminDash';
import BookAppointment from './pages/BookAppointment';
import PatientHistory from './pages/PatientHistory';

import './index.css';

function App() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDash user={user} onLogout={logout} />
            </ProtectedRoute>
          } />
          
          <Route path="/book-appointment" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointment user={user} onLogout={logout} />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDash user={user} onLogout={logout} />
            </ProtectedRoute>
          } />

          <Route path="/doctor/history" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientHistory user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDash user={user} onLogout={logout} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
