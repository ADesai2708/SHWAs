import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Clock, AlertTriangle, User, Activity, CheckCircle, Upload, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function PatientDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const { appointments, prescriptions, addPrescription, declareEmergency } = useContext(AuthContext);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const handleBook = () => {
    navigate('/book-appointment');
  };

  const handleEmergency = () => {
    // Call Socket.io declareEmergency
    declareEmergency(user || {});
    setNotification({ type: 'danger', message: 'Emergency declared. You have been placed in the priority queue. Medical staff notified.' });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      addPrescription({ name: file.name, type: file.type });
      setNotification({ type: 'success', message: 'Prescription uploaded successfully!' });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Get next upcoming appointment
  const nextAppt = appointments && appointments.length > 0 ? appointments[appointments.length - 1] : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <nav style={{ background: 'var(--surface)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>SHWAS Details</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <User size={20} />
            <span style={{ fontWeight: 500 }}>{user?.name || 'Patient'}</span>
          </div>
          <button onClick={() => onLogout && onLogout()} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ flex: 1, paddingTop: '2rem', position: 'relative' }}>
        
        {/* Floating Notification */}
        {notification && (
          <div className="animate-fade-in" style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 50,
            background: notification.type === 'danger' ? 'var(--danger)' : 'var(--success)',
            color: 'white', padding: '1rem 2rem', borderRadius: '8px', boxShadow: 'var(--shadow-lg)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500
          }}>
            {notification.type === 'danger' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            {notification.message}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome, {user?.name || 'Patient'}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your appointments and medical records.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 animate-fade-in">
          
          {/* Main Action Card */}
          <div className="glass-panel" style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, rgba(15,107,146,0.1), rgba(33,168,150,0.1))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Book an Appointment</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Schedule a visit with your preferred doctor seamlessly.</p>
                <button onClick={handleBook} className="btn btn-primary"><Calendar size={18} /> Book Now</button>
              </div>
              <Calendar size={120} color="var(--primary-light)" style={{ opacity: 0.2 }} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(33,168,150,0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '12px' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Estimated Wait</h3>
            </div>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '1rem 0', color: 'var(--text-primary)' }}>
              {nextAppt ? '15' : '0'} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>mins</span>
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--success)', margin: 0 }}>{nextAppt ? 'On time for next appointment' : 'No upcoming queue delay'}</p>
          </div>

          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(15,107,146,0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Upcoming</h3>
            </div>
            
            {nextAppt ? (
              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary-light)', marginTop: '1rem' }}>
                <p style={{ fontWeight: 600, margin: 0, color: 'var(--primary)' }}>Doctor ({nextAppt.specialist})</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{nextAppt.date}</p>
                  <p style={{ color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{nextAppt.time}</p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No pending appointments booked.</p>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ border: '1px solid rgba(230, 57, 70, 0.3)', background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(230, 57, 70, 0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '12px' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--danger)' }}>Emergency Access</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              In case of a medical emergency, flag your status for high-priority queueing.
            </p>
            <button onClick={handleEmergency} className="btn btn-danger" style={{ width: '100%' }}><AlertTriangle size={18} /> Declare Emergency</button>
          </div>

        </div>

        {/* Medical Records Section */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Medical Records & Prescriptions</h2>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary" style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)', boxShadow: 'none' }}>
              <Upload size={18} /> Upload Record
            </button>
          </div>
          
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            {prescriptions && prescriptions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--background)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Document Name</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Upload Date</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((doc, idx) => (
                    <tr key={doc.id || idx} style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                      <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'rgba(15,107,146,0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
                          <FileText size={16} />
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doc.name}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{doc.dateUploaded}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>View File</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                <FileText size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No Prescriptions Found</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload your past medical records, prescriptions, or lab reports to keep track of them.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
