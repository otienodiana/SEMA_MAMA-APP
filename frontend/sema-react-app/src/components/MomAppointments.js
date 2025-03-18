import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import '../i18n';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    top: '20px',
  },
  header: {
    color: '#008DC9',
    marginBottom: '30px',
    fontSize: '2em',
    borderBottom: '2px solid #008DC9',
    paddingBottom: '10px',
  },
  filterSection: {
    marginBottom: '20px',
  },
  select: {
    padding: '8px 12px',
    marginLeft: '10px',
    border: '1px solid #008DC9',
    borderRadius: '4px',
    color: '#008DC9',
  },
  form: {
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #008DC9',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#008DC9',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    '&:hover': {
      backgroundColor: '#006d9f',
    },
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
  appointmentList: {
    listStyle: 'none',
    padding: 0,
  },
  appointmentCard: {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  appointmentTitle: {
    color: '#008DC9',
    marginBottom: '10px',
    fontSize: '1.2em',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.9em',
    fontWeight: 'bold',
  },
};

const getStatusColor = (status) => {
  const colors = {
    pending: { bg: '#fff3cd', text: '#856404' },
    confirmed: { bg: '#d4edda', text: '#155724' },
    completed: { bg: '#cce5ff', text: '#004085' },
    canceled: { bg: '#f8d7da', text: '#721c24' },
  };
  return colors[status.toLowerCase()] || colors.pending;
};

const MomAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add these two missing state variables
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    date: "",
    consultation_type: "virtual",
    meeting_link: "",
    notes_for_provider: "",
    preferred_language: "",
    technical_requirements: "",
    status: "pending"
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [updatedData, setUpdatedData] = useState({ title: "", description: "", date: "" });
  const [filterStatus, setFilterStatus] = useState("all"); // ✅ Added state for filtering

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("access"); // Changed from "token" to "access"
        if (!token) {
          console.error("No access token found");
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/api/appointments/moms/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const createAppointment = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/appointments/moms/appointments/create/", // Updated endpoint
        newAppointment, // Send the entire newAppointment object
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );
      
      if (response.data) {
        setAppointments([...appointments, response.data]);
        // Reset form
        setNewAppointment({ 
          title: "", 
          description: "", 
          date: "", 
          consultation_type: "virtual",
          meeting_link: "",
          notes_for_provider: "",
          preferred_language: "",
          technical_requirements: "",
          status: "pending"
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to create appointment");
    }
  };

  const startEditing = (appointment) => {
    setEditingAppointment(appointment.id);
    setUpdatedData({
      title: appointment.title,
      description: appointment.description,
      date: appointment.date,
    });
  };

  const updateAppointment = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/appointments/update/${id}/`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointments.map(app => (app.id === id ? { ...app, ...response.data } : app)));
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const cancelAppointment = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/appointments/cancel/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter(app => app.id !== id));
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  // ✅ Filtered Appointments
  const filteredAppointments = appointments.filter(app => 
    filterStatus === "all" || app.status.toLowerCase() === filterStatus
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{t('appointment.title')}</h1>
      
      <div className="appointments-container">
        <button onClick={() => setShowForm(true)} className="create-button">
          {t('appointment.create')}
        </button>
        
        <div className="filter-section">
          <label>{t('appointment.filter')}</label>
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">{t('appointment.status.all')}</option>
            <option value="pending">{t('appointment.status.pending')}</option>
            <option value="confirmed">{t('appointment.status.confirmed')}</option>
            <option value="completed">{t('appointment.status.completed')}</option>
            <option value="canceled">{t('appointment.status.canceled')}</option>
          </select>
        </div>
        
        {/* ...rest of appointments rendering... */}
      </div>

      <div style={styles.header}>
        <h2>{t('appointment.title')}</h2>
        <LanguageSelector />
      </div>

      <div style={styles.filterSection}>
        <label>{t('appointment.filter')}:</label>
        <select 
          style={styles.select}
          onChange={(e) => setFilterStatus(e.target.value)} 
          value={filterStatus}
        >
          <option value="all">{t('filter.all')}</option>
          <option value="pending">{t('appointment.status.pending')}</option>
          <option value="confirmed">{t('appointment.status.confirmed')}</option>
          <option value="completed">{t('appointment.status.completed')}</option>
          <option value="canceled">{t('appointment.status.canceled')}</option>
        </select>
      </div>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder={t('appointment.placeholders.title')}
          value={newAppointment.title}
          onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
          required
        />
        
        <select
          style={styles.input}
          value={newAppointment.consultation_type}
          onChange={(e) => setNewAppointment({ ...newAppointment, consultation_type: e.target.value })}
        >
          <option value="virtual">{t('appointment.consultation.virtual')}</option>
          <option value="in_person">{t('appointment.consultation.inperson')}</option>
        </select>

        <textarea
          style={styles.input}
          placeholder={t('appointment.placeholders.description')}
          value={newAppointment.description}
          onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
        />

        <input
          style={styles.input}
          type="datetime-local"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          required
        />

        {newAppointment.consultation_type === 'virtual' && (
          <>
            <input
              style={styles.input}
              type="url"
              placeholder="Meeting Link (optional)"
              value={newAppointment.meeting_link}
              onChange={(e) => setNewAppointment({ ...newAppointment, meeting_link: e.target.value })}
            />

            <textarea
              style={styles.input}
              placeholder="Technical Requirements"
              value={newAppointment.technical_requirements}
              onChange={(e) => setNewAppointment({ ...newAppointment, technical_requirements: e.target.value })}
            />
          </>
        )}

        <input
          style={styles.input}
          type="text"
          placeholder="Preferred Language"
          value={newAppointment.preferred_language}
          onChange={(e) => setNewAppointment({ ...newAppointment, preferred_language: e.target.value })}
        />

        <textarea
          style={styles.input}
          placeholder="Notes for Provider"
          value={newAppointment.notes_for_provider}
          onChange={(e) => setNewAppointment({ ...newAppointment, notes_for_provider: e.target.value })}
        />

        <button style={styles.button} onClick={createAppointment}>Create Appointment</button>
      </div>

      {loading ? <p>Loading...</p> : null}

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul style={styles.appointmentList}>
          {filteredAppointments.map((appointment) => (
            <li key={appointment.id} style={styles.appointmentCard}>
              {editingAppointment === appointment.id ? (
                <div>
                  <input
                    style={styles.input}
                    type="text"
                    value={updatedData.title}
                    onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })}
                  />
                  <textarea
                    style={styles.input}
                    value={updatedData.description}
                    onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
                  />
                  <input
                    style={styles.input}
                    type="datetime-local"
                    value={updatedData.date}
                    onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })}
                  />
                  <button style={styles.button} onClick={() => updateAppointment(appointment.id)}>Save</button>
                  <button style={styles.button} onClick={() => setEditingAppointment(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3 style={styles.appointmentTitle}>{appointment.title}</h3>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
                  {appointment.description && <p><strong>Description:</strong> {appointment.description}</p>}
                  <p>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(appointment.status).bg,
                      color: getStatusColor(appointment.status).text
                    }}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </p>
                  <p><strong>Created At:</strong> {new Date(appointment.created_at).toLocaleString()}</p>
                  
                  <button style={styles.button} onClick={() => startEditing(appointment)}>Edit</button>
                  <button style={styles.cancelButton} onClick={() => cancelAppointment(appointment.id)}>
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MomAppointments;
