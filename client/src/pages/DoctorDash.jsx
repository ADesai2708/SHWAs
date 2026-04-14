import React, { useContext, useState } from 'react';
import { Activity, LogOut, CalendarDays, Users, TrendingUp, Clock, CheckCircle, ArrowRight, AlertTriangle, FileText, ClipboardList } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function DoctorDashboard({ user, onLogout }) {
  const { appointments, updateAppointmentStatus, notifications, removeNotification } = useContext(AuthContext);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');

  const [blockedSlots, setBlockedSlots] = useState(['Tue-13:00', 'Thu-14:00']);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Filter appointments for this doctor's specialization. Fallback to all if user specialization isn't set.
  const myAppointments = appointments.filter(a => user?.specialization ? a.specialist === user.specialization : true);
  
  const emergenciesCount = myAppointments.filter(a => a.isEmergency).length;
  const completedCount = myAppointments.filter(a => a.status === 'Completed').length;
  const totalCount = myAppointments.length;

  const handleToggleBlock = (day, time) => {
    if (!isEditingSchedule) return;
    const slotId = `${day}-${time}`;
    if (blockedSlots.includes(slotId)) {
      setBlockedSlots(blockedSlots.filter(id => id !== slotId));
    } else {
      setBlockedSlots([...blockedSlots, slotId]);
    }
  };

  const handleSyncGoogle = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsGoogleSynced(!isGoogleSynced);
    }, 1500);
  };

  const handleStartSession = (patient) => {
    setActiveSession(patient);
    setSessionNotes('');
    updateAppointmentStatus(patient.id, 'In Progress');
  };

  const handleEndSession = () => {
    if (activeSession) {
      // Future scope: Save sessionNotes to the database
      updateAppointmentStatus(activeSession.id, 'Completed');
      setActiveSession(null);
      setSessionNotes('');
    }
  };

  const handleHoldSession = () => {
    if (activeSession) {
      updateAppointmentStatus(activeSession.id, 'Waiting');
      setActiveSession(null);
      setSessionNotes('');
    }
  };

  const handleStatusChange = (id, currentStatus) => {
    let nextStatus = 'In Progress';
    if (currentStatus === 'In Progress') nextStatus = 'Completed';
    else if (currentStatus === 'Completed') nextStatus = 'Waiting';
    
    updateAppointmentStatus(id, nextStatus);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'var(--surface)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontWeight: 700 }}>SHWAS</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <img src={`https://ui-avatars.com/api/?name=Dr+${user?.name || 'Doctor'}&background=0F6B92&color=fff`} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <span style={{ fontWeight: 500 }}>Dr. {user?.name || 'Doctor'} ({user?.specialization || 'General'})</span>
          </div>
          <button onClick={onLogout} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ flex: 1, paddingTop: '2rem', position: 'relative' }}>
        {/* Real-time Notifications */}
        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications && notifications.length > 0 && notifications.map(n => (
            <div key={n.id} className="animate-fade-in" style={{
              background: 'var(--danger)', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', 
              boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '300px'
            }}>
              <div>
                <AlertTriangle size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>EMERGENCY ALERT</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>{n.name} requires immediate attention!</p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)} 
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Good Morning, Dr. {user?.name || 'Doctor'}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>You have {totalCount - completedCount} pending patients scheduled for today in {user?.specialization || 'your department'}.</p>
          </div>
          <button onClick={() => setScheduleMode(!scheduleMode)} className={scheduleMode ? "btn btn-ghost" : "btn btn-primary"}>
            <CalendarDays size={18} /> {scheduleMode ? 'View Live Queue' : 'Manage Schedule'}
          </button>
        </div>

        {scheduleMode ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarDays size={24} color="var(--primary)" /> Protocol Weekly Schedule
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage your usual availability on SHWAS.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setIsEditingSchedule(!isEditingSchedule)} 
                  className={isEditingSchedule ? "btn btn-primary" : "btn btn-ghost"}
                  style={isEditingSchedule ? { background: 'var(--warning)', color: '#000', border: 'none' } : { border: '1px solid var(--border)' }}
                >
                  {isEditingSchedule ? 'Save Schedule Blocks' : 'Set Unavailable Blocks'}
                </button>
                <button 
                  onClick={handleSyncGoogle} 
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: isGoogleSynced ? 'var(--success)' : 'var(--primary)', border: 'none' }}
                  disabled={isSyncing}
                >
                  {isSyncing ? 'Syncing...' : isGoogleSynced ? 'Synced with Google \u2713' : 'Sync Google Calendar'}
                </button>
              </div>
            </div>

            {isEditingSchedule && (
              <div className="animate-fade-in" style={{ background: 'var(--warning)', color: '#000', padding: '0.5rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'inline-block', fontWeight: 600, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                Edit Mode Active: Click any timeslot below to toggle it as Unavailable/Blocked.
              </div>
            )}

            <div style={{ overflowX: 'auto', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${days.length}, 1fr)`, borderBottom: '1px solid var(--border)' }}>
                <div style={{ padding: '1rem', background: 'var(--background)' }}></div>
                {days.map(day => (
                  <div key={day} style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center', borderLeft: '1px solid var(--border)', background: 'var(--background)' }}>{day}</div>
                ))}
              </div>
              
              {timeSlots.map(time => (
                <div key={time} style={{ display: 'grid', gridTemplateColumns: `80px repeat(${days.length}, 1fr)`, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid var(--border)' }}>{time}</div>
                  {days.map(day => {
                    const isBlocked = blockedSlots.includes(`${day}-${time}`);
                    return (
                      <div 
                        key={`${day}-${time}`} 
                        onClick={() => handleToggleBlock(day, time)}
                        style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          borderRight: '1px solid var(--border)',
                          background: isBlocked ? 'rgba(230, 57, 70, 0.05)' : 'transparent',
                          cursor: isEditingSchedule ? 'pointer' : 'default',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={(e) => { if(isEditingSchedule) e.currentTarget.style.background = isBlocked ? 'rgba(230, 57, 70, 0.15)' : 'rgba(33,168,150,0.1)' }}
                        onMouseOut={(e) => { e.currentTarget.style.background = isBlocked ? 'rgba(230, 57, 70, 0.05)' : 'transparent' }}
                      >
                        <span style={{ 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '8px', 
                          background: isBlocked ? 'var(--danger)' : 'rgba(33,168,150,0.15)',
                          color: isBlocked ? 'white' : 'var(--success)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          width: '100%',
                          opacity: isEditingSchedule ? 1 : 0.8
                        }}>
                          {isBlocked ? 'Blocked' : 'Available'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 animate-fade-in" style={{ marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ background: 'rgba(15,107,146,0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                  <Users size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Total Patients</h3>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{totalCount}</p>
                </div>
              </div>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px' }}>
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Emergencies</h3>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--danger)' }}>{emergenciesCount}</p>
                </div>
              </div>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ background: 'rgba(33,168,150,0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '12px' }}>
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Completed</h3>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{completedCount}</p>
                </div>
              </div>
            </div>

            {activeSession ? (
              <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                <div style={{ padding: '1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                      <Activity size={24} color="white" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>Live Consultation</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Session In Progress</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>

                <div className="grid grid-cols-3" style={{ padding: '1.5rem', gap: '1.5rem', alignItems: 'flex-start' }}>
                  {/* Patient Details Column */}
                  <div style={{ gridColumn: 'span 1', background: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                        {activeSession.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{activeSession.name}</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{activeSession.age} yrs • {activeSession.gender}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Presenting Complaint</p>
                      <div style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
                        <p style={{ margin: 0, fontWeight: 500 }}>{activeSession.disease}</p>
                      </div>
                    </div>

                    <div>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Medical History</p>
                      <div style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{activeSession.history || 'No significant prior history marked.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Notes Column */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ClipboardList size={20} color="var(--primary)" />
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Clinical Notes & Prescriptions</h4>
                    </div>
                    <textarea 
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Type your diagnosis, observations, and prescribed medication here..."
                      style={{ 
                        width: '100%', minHeight: '220px', padding: '1rem', borderRadius: '12px', 
                        border: '1px solid var(--border)', background: 'var(--background)',
                        fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical'
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                      <button onClick={handleHoldSession} className="btn btn-ghost" style={{ border: '1px solid var(--border)' }}>
                        Hold Session
                      </button>
                      <button onClick={handleEndSession} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} /> End Session & Mark Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Live Patient Queue</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sorted by priority and time</span>
                </div>
                
                {myAppointments.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--background)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Time</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Patient Details</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Apt Type</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Notes & History</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Queue Status</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...myAppointments].sort((a,b) => (b.isEmergency ? 1 : 0) - (a.isEmergency ? 1 : 0)).map((p, idx) => (
                        <tr key={p.id || idx} style={{ borderBottom: '1px solid var(--border)', background: p.isEmergency ? 'rgba(230, 57, 70, 0.02)' : 'var(--surface)' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{p.time}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                                {p.name.charAt(0)}
                              </div>
                              <div>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{p.name}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Age: {p.age} | {p.gender}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            {p.isEmergency ? (
                              <span style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--danger)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Emergency</span>
                            ) : (
                              <span style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>{p.appointmentType || 'Routine'}</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', maxWidth: '200px' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><strong>Diff:</strong> {p.disease}</p>
                            {p.history && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><strong>Hist:</strong> {p.history}</p>}
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ 
                              color: p.status === 'Waiting' ? 'var(--warning)' : p.status === 'In Progress' ? 'var(--primary)' : 'var(--success)',
                              display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600
                            }}>
                              {p.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />} {p.status || 'Waiting'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            {p.status === 'Waiting' ? (
                              <button 
                                onClick={() => handleStartSession(p)} 
                                className="btn btn-primary" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem' }}
                              >
                                Start Session <ArrowRight size={14} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusChange(p.id, p.status)} 
                                className="btn btn-ghost" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem' }}
                              >
                                {p.status === 'In Progress' ? 'Complete' : 'Revert'} <ArrowRight size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center' }}>
                    <Users size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ color: 'var(--text-secondary)' }}>No Patients Queued</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>When a patient books a consultation or operation for {user?.specialization}, it will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
