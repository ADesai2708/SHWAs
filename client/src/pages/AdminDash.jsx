import React, { useState, useContext } from 'react';
import { Activity, LogOut, BarChart4, Users, LayoutDashboard, Settings, UserPlus, HeartPulse, Stethoscope, FileText, AlertTriangle, Building, CheckCircle, Server, Plus, Minus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';

export default function AdminDashboard({ user, onLogout }) {
  const { appointments, updateAppointmentStatus, notifications, removeNotification, allocateEmergency, doctors, addDoctor, toggleDoctorStatus } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [allocationSelections, setAllocationSelections] = useState({});
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({ name: '', department: 'Cardiology', status: 'Active' });

  const specialists = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'];

  const [facilityStats, setFacilityStats] = useState({
    icu: { id: 'icu', name: 'Intensive Care Unit (ICU)', total: 20, occupied: 14, color: 'var(--danger)' },
    er: { id: 'er', name: 'Emergency Room (ER)', total: 15, occupied: 12, color: '#f4a261' },
    surgery: { id: 'surgery', name: 'Surgery & Theaters', total: 10, occupied: 4, color: '#0f6b92' },
    general: { id: 'general', name: 'General Ward', total: 60, occupied: 42, color: 'var(--success)' }
  });

  // Dynamically compute department case loads from global appointments
  const departmentStats = appointments.reduce((acc, appt) => {
    acc[appt.specialist] = (acc[appt.specialist] || 0) + 1;
    return acc;
  }, {});

  // Compute total patients uniquely based on name
  const uniquePatients = [...new Set(appointments.map(a => a.name))].length;

  const renderContent = () => {
    if (activeTab === 'overview') {
      // Prepare Data for Charts
      const datesObj = appointments.reduce((acc, appt) => {
        const d = appt.date || new Date().toISOString().split('T')[0];
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {});
      const trafficData = Object.keys(datesObj)
        .map(date => ({ date, patients: datesObj[date] }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7); // Last 7 days

      const COLORS = ['#21a896', '#0f6b92', '#e63946', '#f4a261', '#2a9d8f', '#e9c46a'];
      const pieData = Object.keys(departmentStats).map((dept, index) => ({
        name: dept,
        value: departmentStats[dept],
        color: COLORS[index % COLORS.length]
      }));

      const systemLogs = [
        { id: 1, time: '10:42 AM', type: 'INFO', message: 'Night shift staff roster uploaded successfully.' },
        { id: 2, time: '10:15 AM', type: 'ALERT', message: 'Secondary ER capacity breached 80% threshold.' },
        { id: 3, time: '09:05 AM', type: 'SYSTEM', message: 'Hospital records daily backup sequence completed.' },
        { id: 4, time: '08:30 AM', type: 'ALERT', message: 'Power redundancy check passed.' }
      ];

      return (
        <div className="animate-fade-in">
          <div className="grid grid-cols-3" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ background: 'var(--surface)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total System Appointments</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{appointments.length}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ background: 'var(--surface)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Unique Patients Registered</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{uniquePatients}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ background: 'var(--surface)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Medical Staff</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{doctors ? doctors.filter(d => d.status === 'Active').length : 0}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>/ {doctors ? doctors.length : 0} total</span>
              </div>
            </div>
          </div>

          {/* Department Analytics */}
          <div className="glass-panel" style={{ background: 'var(--surface)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}><BarChart4 size={20} style={{ display: 'inline', marginRight: '0.5rem' }}/> Department Case Volumes</h3>
            <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
              {Object.keys(departmentStats).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No active patient cases found in the system.</p>
              ) : (
                Object.keys(departmentStats).map(dept => (
                  <div key={dept} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>{dept}</h4>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>{departmentStats[dept]} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>cases</span></p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New Analytics Graphs Section */}
          <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
            {/* Traffic over Time Bar Chart */}
            <div className="glass-panel" style={{ background: 'var(--surface)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Daily Patient Traffic</h3>
              <div style={{ width: '100%', height: 300 }}>
                {trafficData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} cursor={{ fill: 'var(--background)' }} />
                      <Bar dataKey="patients" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>No traffic data available.</div>
                )}
              </div>
            </div>

            {/* Symptoms / Specialist Split Pie Chart */}
            <div className="glass-panel" style={{ background: 'var(--surface)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Cases by Department</h3>
              <div style={{ width: '100%', height: 300 }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-secondary)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>No case data available.</div>
                )}
              </div>
            </div>
          </div>

          {/* System Audit Log Widget */}
          <div className="glass-panel" style={{ background: 'var(--surface)', marginTop: '1.5rem', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
               <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}><Server size={18} style={{ display: 'inline', marginRight: '0.5rem' }}/> System Audit Logs</h3>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {systemLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', minWidth: '70px' }}>{log.time}</span>
                  <span style={{ 
                    padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: log.type === 'ALERT' ? 'rgba(230, 57, 70, 0.1)' : 'rgba(15,107,146,0.1)',
                    color: log.type === 'ALERT' ? 'var(--danger)' : 'var(--primary)'
                  }}>
                    {log.type}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'doctors') {
      const handleAddNewDoctor = (e) => {
        if (e) e.preventDefault();
        if (!newDoctorData.name || !newDoctorData.name.trim()) {
          alert("Please enter a valid doctor name.");
          return;
        }
        let formattedName = newDoctorData.name.trim();
        if (!formattedName.toLowerCase().startsWith('dr.')) {
           formattedName = 'Dr. ' + formattedName;
        }
        addDoctor({ name: formattedName, department: newDoctorData.department, status: newDoctorData.status });
        setNewDoctorData({ name: '', department: 'Cardiology', status: 'Active' });
        setShowAddDoctor(false);
      };

      return (
        <div className="glass-panel animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Doctors & Staff Directory</h3>
            <button className={showAddDoctor ? "btn btn-ghost" : "btn btn-primary"} onClick={() => setShowAddDoctor(!showAddDoctor)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: showAddDoctor ? '1px solid var(--border)': 'none' }}>
              <UserPlus size={16} /> {showAddDoctor ? 'Cancel' : 'Add Personnel'}
            </button>
          </div>

          {showAddDoctor && (
            <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary)' }}>Register New Doctor</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Full Name (e.g. John Doe)" className="form-input" style={{ flex: '1', margin: 0, minWidth: '200px' }} value={newDoctorData.name} onChange={(e) => setNewDoctorData({...newDoctorData, name: e.target.value})} />
                <select className="form-input" style={{ width: 'auto', margin: 0 }} value={newDoctorData.department} onChange={(e) => setNewDoctorData({...newDoctorData, department: e.target.value})}>
                  {specialists.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="form-input" style={{ width: 'auto', margin: 0 }} value={newDoctorData.status} onChange={(e) => setNewDoctorData({...newDoctorData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
                <button type="button" className="btn btn-primary" onClick={handleAddNewDoctor}>Save Doctor</button>
              </div>
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--background)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Doctor Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Department</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Live Cases Addressed</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors && doctors.map(doc => {
                // Dynamically assign case loads connecting the Doctor to the Patient logic
                const matchedCases = departmentStats[doc.department] || 0;
                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                      <Stethoscope size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> {doc.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{doc.department}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{matchedCases} Cases</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        background: doc.status === 'Active' ? 'rgba(33,168,150,0.1)' : 'rgba(230, 57, 70, 0.1)', 
                        color: doc.status === 'Active' ? 'var(--success)' : 'var(--danger)', 
                        padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
                      }}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', border: '1px solid var(--border)' }}
                        onClick={() => toggleDoctorStatus(doc.id)}
                      >
                         Toggle Leave
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'patients') {
      return (
        <div className="glass-panel animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Global Patient Registries</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Comprehensive tracking of all patient appointments.</p>
          </div>
          {appointments.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--background)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Patient Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Assigned Dept</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Symptoms</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Queue Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Clinical History</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((p, idx) => (
                  <tr key={p.id || idx} style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{p.name} <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(Age: {p.age})</span></td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--primary)', fontWeight: 500 }}>{p.specialist}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{p.disease}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', padding: '0.25rem 0.5rem', borderRadius: '8px', background: p.status === 'Completed' ? 'rgba(33,168,150,0.1)' : 'rgba(244, 162, 97, 0.1)', color: p.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>
                        {p.status || 'Waiting'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', maxWidth: '300px' }}>
                      {p.notes ? (
                        <div style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                           {p.notes}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Pending consultation...</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      {p.status !== 'Completed' && (
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--success)', border: '1px solid rgba(33,168,150,0.3)' }}
                          onClick={() => updateAppointmentStatus(p.id, 'Completed')}
                        >
                          <CheckCircle size={14} style={{ display: 'inline', marginRight: '0.25rem' }}/> Discharge
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
               <h4 style={{ color: 'var(--text-secondary)' }}>No Patients Registered</h4>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'emergencies') {
      const activeEmergencies = appointments.filter(a => a.isEmergency);
      
      const handleSelectChange = (id, value) => {
        setAllocationSelections(prev => ({ ...prev, [id]: value }));
      };

      const handleAllocate = (id) => {
        const specialist = allocationSelections[id];
        if (specialist) {
           allocateEmergency(id, specialist);
        }
      };

      return (
        <div className="glass-panel animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--danger)' }}><AlertTriangle size={20} style={{ display: 'inline', marginRight: '0.5rem' }}/> Emergency Routing</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Intercept pending emergencies and route them to medical specialists.</p>
          </div>
          {activeEmergencies.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--background)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Patient Details</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Symptom Profile</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Current Assignment</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeEmergencies.map((p) => {
                  const isUnassigned = p.specialist === 'Pending Allocation';
                  const selectedSpec = allocationSelections[p.id] || specialists[0];
                  
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{p.name} <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>(Age: {p.age})</span></td>
                      <td style={{ padding: '1rem 1.5rem' }}>{p.disease}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                         <span style={{ 
                           padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
                           background: isUnassigned ? 'rgba(230, 57, 70, 0.1)' : 'rgba(15,107,146,0.1)',
                           color: isUnassigned ? 'var(--danger)' : 'var(--primary)'
                         }}>
                            {p.specialist}
                         </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select 
                            value={selectedSpec} 
                            onChange={(e) => handleSelectChange(p.id, e.target.value)}
                            style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                          >
                            {specialists.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => handleAllocate(p.id)}
                          >
                            {isUnassigned ? 'Allocate' : 'Re-route'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
               <AlertTriangle size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
               <h4 style={{ color: 'var(--text-secondary)' }}>No Active Emergencies</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The hospital is currently operating at normal priority queue levels.</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'facility') {
      const updateFacilityOccupancy = (key, delta) => {
        setFacilityStats(prev => {
          const stat = prev[key];
          const newOccupied = Math.max(0, Math.min(stat.total, stat.occupied + delta));
          return { ...prev, [key]: { ...stat, occupied: newOccupied } };
        });
      };

      return (
        <div className="glass-panel animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary)' }}><Building size={20} style={{ display: 'inline', marginRight: '0.5rem' }}/> Facility & Bed Allocation</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live tracking of hospital physical resources and bed availability.</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              {Object.keys(facilityStats).map(key => {
                const stat = facilityStats[key];
                const percentage = Math.round((stat.occupied / stat.total) * 100);
                return (
                  <div key={key} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', background: 'var(--background)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{stat.name}</h4>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, background: 'rgba(15,107,146,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{stat.total - stat.occupied} Beds Ready</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                         <span style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1, color: 'var(--text-primary)' }}>{stat.occupied}</span>
                         <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>/ {stat.total}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '0.25rem' }}>
                         <button onClick={() => updateFacilityOccupancy(key, -1)} className="btn btn-ghost" style={{ padding: '0.25rem', border: '1px solid var(--border)', minWidth: '32px' }}><Minus size={16}/></button>
                         <button onClick={() => updateFacilityOccupancy(key, 1)} className="btn btn-ghost" style={{ padding: '0.25rem', border: '1px solid var(--border)', minWidth: '32px' }}><Plus size={16}/></button>
                       </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', width: '100%', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--border)' }}>
                       <div style={{ height: '100%', width: `${percentage}%`, background: stat.color, transition: 'width 0.3s ease' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>Occupancy Rate</span>
                      <span style={{ fontWeight: 600, color: percentage > 85 ? 'var(--danger)' : 'var(--text-primary)' }}>{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const navItemStyle = (tabName) => ({
    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', 
    background: activeTab === tabName ? 'rgba(15,107,146,0.1)' : 'transparent', 
    color: activeTab === tabName ? 'var(--primary)' : 'var(--text-secondary)', 
    border: 'none', borderRadius: '8px', fontWeight: activeTab === tabName ? 700 : 500, 
    cursor: 'pointer', textAlign: 'left', width: '100%',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontWeight: 700, fontSize: '1.4rem' }}>SHWAS</h2>
        </div>
        
        <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', paddingLeft: '0.5rem', marginBottom: '0.5rem' }}>Admin Menu</p>
          
          <button onClick={() => setActiveTab('overview')} style={navItemStyle('overview')}>
            <LayoutDashboard size={20} /> System Overview
          </button>
          
          <button onClick={() => setActiveTab('doctors')} style={navItemStyle('doctors')}>
            <Stethoscope size={20} /> Doctors Directory
          </button>
          
          <button onClick={() => setActiveTab('patients')} style={navItemStyle('patients')}>
            <Users size={20} /> Patient Registries
          </button>

          <button onClick={() => setActiveTab('emergencies')} style={navItemStyle('emergencies')}>
            <AlertTriangle size={20} /> Emergency Routing
          </button>

          <button onClick={() => setActiveTab('facility')} style={navItemStyle('facility')}>
            <Building size={20} /> Facility Operations
          </button>
        </div>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>A</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Admin'}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>System Chief</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', position: 'relative' }}>
        {/* Real-time Notifications */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications && notifications.length > 0 && notifications.map(n => (
            <div key={n.id} className="animate-fade-in" style={{
              background: 'var(--danger)', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', 
              boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '300px'
            }}>
              <div>
                <AlertTriangle size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>SYSTEM EMERGENCY ALERT</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>{n.name} declared a high-priority emergency.</p>
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

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {activeTab === 'overview' ? 'Hospital Overview' : activeTab === 'doctors' ? 'Medical Staff' : activeTab === 'patients' ? 'Patient Information' : activeTab === 'facility' ? 'Facility Operations' : 'Emergency Routing'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
              Live hospital informatics monitored from the control center.
            </p>
          </div>
        </header>

        {renderContent()}

      </main>
    </div>
  );
}
