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
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    backgroundColor: 'white',
    cursor: 'pointer',
    '&:focus': {
      borderColor: '#008DC9',
      outline: 'none'
    }
  },
  form: {
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      borderColor: '#008DC9',
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(0,141,201,0.1)'
    }
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
  createButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#008DC9',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  formTitle: {
    color: '#008DC9',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '1.8em',
    fontWeight: '600'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#444',
    fontSize: '0.95em',
    fontWeight: '500'
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1em',
    minHeight: '100px',
    resize: 'vertical',
    '&:focus': {
      borderColor: '#008DC9',
      outline: 'none'
    }
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px'
  },
  submitButton: {
    backgroundColor: '#008DC9',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#007ab0'
    }
  },
  formSection: {
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  formSectionTitle: {
    color: '#008DC9',
    marginBottom: '15px',
    fontSize: '1.1em',
    fontWeight: '500'
  }
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
  const [providers, setProviders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    date: "",
    provider: "",
    consultation_type: "virtual",
    meeting_link: "",
    notes_for_provider: "",
    preferred_language: "",
    technical_requirements: "",
    status: "pending"
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [updatedData, setUpdatedData] = useState({ title: "", description: "", date: "" });
  const [filterStatus, setFilterStatus] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No access token found");
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/api/appointments/list/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No access token found");
          return;
        }
        console.log("DEBUG: Fetching providers..."); 
        const response = await axios.get("http://127.0.0.1:8000/api/appointments/providers/", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        console.log("DEBUG: Raw provider response:", response.data);
        
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            console.log("DEBUG: No providers returned from API");
          }
          setProviders(response.data);
        } else {
          console.error("Invalid providers data format:", response.data);
          setProviders([]);
        }
      } catch (error) {
        console.error("Error fetching providers:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          fullError: error
        });
        setProviders([]);
      }
    };

    fetchAppointments();
    fetchProviders();
  }, []);

  const createAppointment = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
    try {
      console.log("Creating appointment with data:", newAppointment); // Debug log
      const response = await axios.post(
        "http://127.0.0.1:8000/api/appointments/list/", // Changed from /create/ to /list/
        newAppointment,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            'Accept': 'application/json'
          } 
        }
      );
      console.log("Appointment creation response:", response); // Debug log
      
      if (response.data) {
        setAppointments(prevAppointments => [...prevAppointments, response.data]);
        setNewAppointment({ 
          title: "", 
          description: "", 
          date: "", 
          provider: "",
          consultation_type: "virtual",
          meeting_link: "",
          notes_for_provider: "",
          preferred_language: "",
          technical_requirements: "",
          status: "pending"
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error creating appointment:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      alert(error.response?.data?.error || "Failed to create appointment. Please try again.");
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
      // Changed from delete to put
      await axios.put(`http://127.0.0.1:8000/api/appointments/cancel/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter(app => app.id !== id));
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  const filteredAppointments = appointments.filter(app => 
    filterStatus === "all" || app.status.toLowerCase() === filterStatus
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{t('appointment.title')}</h1>
      
      <button 
        style={styles.createButton}
        onClick={() => setShowForm(true)}
      >
        {t('appointment.create')}
      </button>

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.formTitle}>{t('appointment.createNew')}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              createAppointment();
            }}>
              <div style={styles.formSection}>
                <h3 style={styles.formSectionTitle}>Provider Details</h3>
                <select
                  style={styles.select}
                  value={newAppointment.provider}
                  onChange={(e) => setNewAppointment({...newAppointment, provider: e.target.value})}
                  required
                >
                  <option value="">
                    {providers.length === 0 
                      ? "Loading providers... (If this persists, no providers are available)" 
                      : t('appointment.selectProvider')}
                  </option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {`${provider.first_name} ${provider.last_name} - ${provider.email}`}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.formSectionTitle}>Appointment Details</h3>
                <input
                  style={styles.input}
                  type="text"
                  placeholder={t('appointment.placeholders.title')}
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                  required
                />
                
                <select
                  style={styles.select}
                  value={newAppointment.consultation_type}
                  onChange={(e) => setNewAppointment({ ...newAppointment, consultation_type: e.target.value })}
                >
                  <option value="virtual">{t('appointment.consultation.virtual')}</option>
                  <option value="in_person">{t('appointment.consultation.inperson')}</option>
                </select>

                <textarea
                  style={styles.textarea}
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
              </div>

              {newAppointment.consultation_type === 'virtual' && (
                <div style={styles.formSection}>
                  <h3 style={styles.formSectionTitle}>Virtual Meeting Details</h3>
                  <input
                    style={styles.input}
                    type="url"
                    placeholder="Meeting Link (optional)"
                    value={newAppointment.meeting_link}
                    onChange={(e) => setNewAppointment({ ...newAppointment, meeting_link: e.target.value })}
                  />

                  <textarea
                    style={styles.textarea}
                    placeholder="Technical Requirements"
                    value={newAppointment.technical_requirements}
                    onChange={(e) => setNewAppointment({ ...newAppointment, technical_requirements: e.target.value })}
                  />
                </div>
              )}

              <div style={styles.formSection}>
                <h3 style={styles.formSectionTitle}>Additional Information</h3>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Preferred Language"
                  value={newAppointment.preferred_language}
                  onChange={(e) => setNewAppointment({ ...newAppointment, preferred_language: e.target.value })}
                />

                <textarea
                  style={styles.textarea}
                  placeholder="Notes for Provider"
                  value={newAppointment.notes_for_provider}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes_for_provider: e.target.value })}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  style={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  {t('common.cancel')}
                </button>
                <button type="submit" style={styles.submitButton}>
                  {t('appointment.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    style={styles.textarea}
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
                  <p><strong>Healthcare Provider:</strong> {
                    appointment.provider_details ? 
                    `${appointment.provider_details.first_name} ${appointment.provider_details.last_name} - ${appointment.provider_details.email}` :
                    "No provider assigned"
                  }</p>
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
