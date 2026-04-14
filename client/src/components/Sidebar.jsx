import React from 'react';
import { Activity, LogOut, LayoutDashboard, Users, BarChart4, Settings } from 'lucide-react';

const Sidebar = ({ userName, onLogout }) => {
  return (
    <aside style={{ width: '260px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
          <Activity size={24} />
        </div>
        <h2>SHWAS</h2>
      </div>
      <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', paddingLeft: '0.5rem', marginBottom: '0.5rem' }}>Menu</p>
        <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(15,107,146,0.1)', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
          <LayoutDashboard size={20} /> Overview
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
          <Users size={20} /> Staff Actions
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
          <BarChart4 size={20} /> Analytics
        </button>
      </div>
      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{userName?.charAt(0) || 'U'}</div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{userName}</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
