import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, User, ArrowLeft, Calendar, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function BookAppointment({ user, onLogout }) {
  const navigate = useNavigate();
  const { addAppointment, appointments } = useContext(AuthContext);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: 'Male',
    disease: '',
    history: '',
    specialist: 'Cardiology',
    appointmentType: 'Consultation',
    date: defaultDate,
    time: '09:00 AM'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState('');

  const specialists = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'];
  const appointmentTypes = ['Consultation', 'Follow-up', 'Operation', 'Routine Checkup'];
  const availableSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  // Dynamically check which times are booked for the selected specialist and date
  const bookedTimes = appointments
    .filter(a => a.specialist === formData.specialist && a.date === formData.date)
    .map(a => a.time);

  const handleChange = (e) => {
    setConflictError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (slot) => {
    if (bookedTimes.includes(slot)) return; // Disable clicking booked slots
    setConflictError('');
    setFormData({ ...formData, time: slot });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Strict backend-style validation intercept
    if (bookedTimes.includes(formData.time)) {
      setConflictError(`The doctor in ${formData.specialist} is already booked on ${formData.date} at ${formData.time}.`);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const bookingData = {
        ...formData,
        isEmergency: formData.disease.toLowerCase().includes('emergency') || formData.disease.toLowerCase().includes('pain')
      };
      
      addAppointment(bookingData);
      setIsSubmitting(false);
      navigate('/patient');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <nav style={{ background: 'var(--surface)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>SHWAS</h2>
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

      <div className="container" style={{ flex: 1, paddingTop: '2rem', maxWidth: '800px', marginBottom: '4rem' }}>
        <button onClick={() => navigate('/patient')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(15,107,146,0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
              <Calendar size={28} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>Book Appointment</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Check physician availability and reserve your timeslot.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid grid-cols-2" style={{ gap: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Patient Name</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Age</label>
                <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} min="0" max="120" required />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select name="gender" className="form-input" value={formData.gender} onChange={handleChange} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Appointment Type</label>
                <select name="appointmentType" className="form-input" value={formData.appointmentType} onChange={handleChange} required>
                  {appointmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

            {/* Doctor Availability Selection Map */}
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Physician Department</label>
                <select name="specialist" className="form-input" value={formData.specialist} onChange={handleChange} required style={{ border: '1px solid var(--primary)', background: 'rgba(15,107,146,0.02)' }}>
                  {specialists.map(specialty => <option key={specialty} value={specialty}>{specialty}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Booking Date</label>
                <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} min={defaultDate} required style={{ border: '1px solid var(--primary)', background: 'rgba(15,107,146,0.02)' }} />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                Available Timeslots for {formData.specialist} on {formData.date}
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {availableSlots.map(slot => {
                  const isBooked = bookedTimes.includes(slot);
                  const isSelected = formData.time === slot;
                  
                  let bgObj = 'var(--surface)';
                  let borderObj = '1px solid var(--border)';
                  let colorObj = 'var(--text-primary)';
                  let cursorObj = 'pointer';
                  let opacityObj = 1;

                  if (isBooked) {
                    bgObj = 'var(--background)';
                    colorObj = 'var(--text-secondary)';
                    cursorObj = 'not-allowed';
                    opacityObj = 0.5;
                  } else if (isSelected) {
                    bgObj = 'var(--primary-light)';
                    borderObj = '1px solid var(--primary)';
                    colorObj = 'white';
                  }

                  return (
                    <button 
                      key={slot} type="button" 
                      onClick={() => handleTimeSelect(slot)}
                      style={{ 
                        padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
                        transition: '0.2s ease', background: bgObj, border: borderObj, color: colorObj, 
                        cursor: cursorObj, opacity: opacityObj
                      }}
                      disabled={isBooked}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {conflictError && (
              <div style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <AlertTriangle size={18} /> {conflictError}
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Symptoms / Disease</label>
              <input type="text" name="disease" className="form-input" value={formData.disease} onChange={handleChange} placeholder="Briefly describe what you're experiencing..." required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Previous Medical History (If any)</label>
              <textarea name="history" className="form-input" value={formData.history} onChange={handleChange} placeholder="Surgeries, chronic conditions..." rows="2" style={{ resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !formData.time} style={{ padding: '0.8rem 2rem', fontSize: '1rem', width: '100%' }}>
                {isSubmitting ? 'Securing Timeslot...' : `Reserve ${formData.time} Appointment`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
