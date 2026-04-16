import React, { useState } from 'react';
import { Shield, User, HeartPulse, Mail, Phone, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // data contains { token, user: { id, name, role } }
      onLogin(data);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIdentifierIcon = () => {
    if (role === 'patient') return <Phone size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />;
    if (role === 'doctor') return <Mail size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />;
    return <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />;
  };

  const getIdentifierPlaceholder = () => {
    if (role === 'patient') return 'Enter Phone Number';
    if (role === 'doctor') return 'Enter Email Address';
    return 'Enter Admin Username';
  };

  const getIdentifierType = () => {
    if (role === 'patient') return 'tel';
    if (role === 'doctor') return 'email';
    return 'text';
  };

  const getIdentifierLabel = () => {
    if (role === 'patient') return 'Phone Number';
    if (role === 'doctor') return 'Email Address';
    return 'Username';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-light)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <HeartPulse size={32} />
          </div>
          <h1 style={{ color: 'var(--primary)', fontWeight: 700 }}>SHWAS Login</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your dashboard</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          {['patient', 'doctor', 'admin'].map((r) => (
            <button
              key={r} type="button" onClick={() => { setRole(r); setIdentifier(''); setError(''); }}
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
          <div className="form-group animate-fade-in" style={{ marginBottom: 0 }}>
            <label className="form-label">{getIdentifierLabel()}</label>
            <div style={{ position: 'relative' }}>
              {getIdentifierIcon()}
              <input 
                type={getIdentifierType()} 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }} 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                placeholder={getIdentifierPlaceholder()} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-input" style={{ paddingLeft: '2.5rem' }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => navigate('/register')} className="btn btn-ghost" style={{ border: 'none' }} type="button">Go to Signup</button>
        </p>
      </div>
    </div>
  );
}
