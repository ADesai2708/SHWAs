import React, { useState } from 'react';
import { Shield, User, HeartPulse, Stethoscope, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const specialists = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = { name, password, role };
    if (role === 'doctor') {
      payload.email = email;
      payload.specialization = specialization;
    } else if (role === 'patient') {
      payload.phone = phone;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Go to login on success
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-light)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <HeartPulse size={32} />
          </div>
          <h1 style={{ color: 'var(--primary)', fontWeight: 700 }}>SHWAS Register</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your account</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          {['patient', 'doctor'].map((r) => (
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

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
              <input type="text" className="form-input" style={{ paddingLeft: '2.5rem' }} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
          </div>

          {role === 'doctor' && (
            <div className="form-group animate-fade-in" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
                <input type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@hospital.com" required />
              </div>
            </div>
          )}

          {role === 'patient' && (
            <div className="form-group animate-fade-in" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
                <input type="tel" className="form-input" style={{ paddingLeft: '2.5rem' }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 1234567890" required />
              </div>
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-input" style={{ paddingLeft: '2.5rem' }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength="6" />
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
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => navigate('/')} className="btn btn-ghost" style={{ border: 'none' }} type="button">Back to Login</button>
        </p>
      </div>
    </div>
  );
}
