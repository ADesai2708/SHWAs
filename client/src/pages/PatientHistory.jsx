import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, ArrowLeft, FileText, ClipboardList, Calendar } from 'lucide-react';

export default function PatientHistory({ user }) {
  const { appointments } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Default to today's date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter completed appointments for this doctor AND the selected date
  const historyData = appointments.filter(a => {
    const belongsToDoctor = user?.specialization ? a.specialist === user.specialization : true;
    const isCompleted = a.status === 'Completed';
    const matchesDate = a.date === selectedDate;
    
    // Some mock data might not have a date attribute saved correctly, defaulting to today
    const apptDate = a.date || new Date().toISOString().split('T')[0];
    const isMatchingDate = apptDate === selectedDate;

    return belongsToDoctor && isCompleted && isMatchingDate;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <nav style={{ background: 'var(--surface)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontWeight: 700 }}>SHWAS History</h2>
        </div>
        <button onClick={() => navigate('/doctor')} className="btn btn-ghost" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </nav>

      <div className="container animate-fade-in" style={{ flex: 1, paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Patient Clinical Records</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Review historical completed sessions and written prescriptions.</p>
          </div>
          
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Calendar size={18} /> Select Date:
            </span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
             <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Records for {new Date(selectedDate).toLocaleDateString()}</h3>
          </div>
          
          {historyData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {historyData.map(p => (
                <div key={p.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--background)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700 }}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{p.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Age: {p.age} | {p.gender} | Marked Complete at {p.time}</span>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><strong>Diagnosis:</strong> {p.disease}</p>
                    {p.isEmergency && (
                       <span style={{ 
                         display: 'inline-block', padding: '0.2rem 0.5rem', background: 'var(--danger)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
                       }}>
                         EMERGENCY CASE
                       </span>
                    )}
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                      <ClipboardList size={16}/> Clinical Notes
                    </h5>
                    <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.notes || "No additional notes were recorded for this session."}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <FileText size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-secondary)' }}>No Patients Seen</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>There are no completed patient records for {new Date(selectedDate).toLocaleDateString()}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
