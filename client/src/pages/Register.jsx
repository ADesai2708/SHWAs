import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h2>
        <form className="grid" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}><User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-secondary)' }} /><input className="form-input" style={{ paddingLeft: '2.5rem' }} required /></div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Account</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}><button onClick={() => navigate('/')} className="btn-ghost" style={{ border: 'none', background: 'transparent' }}>Back to Login</button></p>
      </div>
    </div>
  )
}
