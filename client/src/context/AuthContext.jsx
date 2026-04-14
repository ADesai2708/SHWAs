import React, { createContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedAppts = localStorage.getItem('appointments');
    if (storedAppts) setAppointments(JSON.parse(storedAppts));

    const storedPrescriptions = localStorage.getItem('prescriptions');
    if (storedPrescriptions) setPrescriptions(JSON.parse(storedPrescriptions));

    // Connect Socket
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('emergency_alert', (emergencyData) => {
      // Add notification
      setNotifications(prev => [...prev, emergencyData]);
      
      // Auto-inject a high-priority emergency appointment 
      setAppointments(prev => {
        // Find if this emergency already exists locally (i.e., we are the patient who pushed it)
        const existingIdx = prev.findIndex(a => a.id === emergencyData.id);
        if (existingIdx !== -1) {
          // Update the locally mocked emergency with the server's real ML-based assigned specialist
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...emergencyData };
          localStorage.setItem('appointments', JSON.stringify(updated));
          return updated;
        }
        
        // Otherwise, it’s a new external alert 
        const updated = [...prev, emergencyData];
        localStorage.setItem('appointments', JSON.stringify(updated));
        return updated;
      });
    });

    socketRef.current.on('emergency_allocated', (data) => {
      setAppointments(prev => {
        const updated = prev.map(a => a.id === data.id ? { ...a, specialist: data.specialist } : a);
        localStorage.setItem('appointments', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addAppointment = (apptData) => {
    const updated = [...appointments, { ...apptData, id: Date.now(), status: 'Waiting' }];
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const updateAppointmentStatus = (id, newStatus) => {
    const updated = appointments.map(appt => appt.id === id ? { ...appt, status: newStatus } : appt);
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const addPrescription = (prescriptionData) => {
    const updated = [...prescriptions, { ...prescriptionData, id: Date.now(), dateUploaded: new Date().toLocaleDateString() }];
    setPrescriptions(updated);
    localStorage.setItem('prescriptions', JSON.stringify(updated));
  };

  const declareEmergency = (patientData) => {
    if (socketRef.current) {
      const emergencyApt = {
        id: Date.now(),
        name: patientData.name || 'Patient',
        age: patientData.age || '',
        gender: patientData.gender || '',
        disease: 'Declared Emergency',
        specialist: 'Pending Allocation', // Fallback to pending
        appointmentType: 'Emergency',
        isEmergency: true,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Waiting'
      };
      
      socketRef.current.emit('declare_emergency', emergencyApt);
      
      // Also save for the patient locally so they see it
      const updated = [...appointments, emergencyApt];
      setAppointments(updated);
      localStorage.setItem('appointments', JSON.stringify(updated));
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const allocateEmergency = (id, newSpecialist) => {
    if (socketRef.current) {
      socketRef.current.emit('allocate_emergency', { id, specialist: newSpecialist });
      
      // Also update locally instantly
      setAppointments(prev => {
        const updated = prev.map(a => a.id === id ? { ...a, specialist: newSpecialist } : a);
        localStorage.setItem('appointments', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      appointments, addAppointment, updateAppointmentStatus, 
      prescriptions, addPrescription,
      declareEmergency, notifications, removeNotification, allocateEmergency
    }}>
      {children}
    </AuthContext.Provider>
  );
};
