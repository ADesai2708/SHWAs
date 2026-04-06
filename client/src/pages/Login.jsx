import React, { useState } from 'react';
import { Shield, User, HeartPulse, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const navigate = useNavigate();

  const specialists = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { id: '1', role, name: role === 'doctor' ? 'Smith' : 'John Doe', email };
    if (role === 'doctor') {
      userData.specialization = specialization;
    }
    onLogin(userData);
    navigate(`/${role}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-light)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <HeartPulse size={32} />
          </div>
          <h1 style={{ color: 'var(--primary)', fontWeight: 700 }}>CareSync Login</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          {['patient', 'doctor', 'admin'].map((r) => (
            <button
              key={r} type="button" onClick={() => setRole(r)}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', 
                background: role === r ? 'var(--surface)' : 'transparent',
                boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                color: role === r ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: role === r ? 600 : 400,
                cursor: 'pointer',textTransform: 'capitalize'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
              <input type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`enter ${role} email`} required />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-input" style={{ paddingLeft: '2.5rem' }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          </div>

          {role === 'doctor' && (
            <div className="form-group animate-fade-in" style={{ marginBottom: 0 }}>
              <label className="form-label">Your Specialization</label>
              <div style={{ position: 'relative' }}>
                <Stethoscope size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
                <select className="form-input" style={{ paddingLeft: '2.5rem' }} value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                  {specialists.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Secure Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => navigate('/register')} className="btn btn-ghost" style={{ border: 'none' }}>Go to Signup</button>
        </p>
      </div>
    </div>
  );
}
