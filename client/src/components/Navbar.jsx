import React from 'react';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = ({ title, userName, onLogout }) => {
  return (
    <nav style={{ background: 'var(--surface)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--primary-light)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
          <Activity size={24} />
        </div>
        <h2 style={{ color: 'var(--primary)', margin: 0 }}>{title || 'SHWAS'}</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <User size={20} />
          <span style={{ fontWeight: 500 }}>{userName}</span>
        </div>
        <button onClick={onLogout} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
