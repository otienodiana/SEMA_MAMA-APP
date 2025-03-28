import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import "./AdminAppointments.css"; // We can reuse the admin styles

const ProviderAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [momUsers, setMomUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [newAppointment, setNewAppointment] = useState({
    user: "",
    provider: "",
    title: "",
    description: "",
    date: "",
    consultation_type: "virtual",
    meeting_link: "",
    notes_for_provider: "",
    status: "pending"
  });

  const [sortOrder, setSortOrder] = useState("upcoming");
  const [rescheduleData, setRescheduleData] = useState({ id: null, newDate: "" });
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchAppointments();
    fetchMomUsers();
  }, []);

  const fetchMomUsers = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://localhost:8000/api/users/moms/", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Mom users response:", response.data);

      if (Array.isArray(response.data)) {
        setMomUsers(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        setError("Failed to fetch patients: Invalid data format");
      }
    } catch (err) {
      console.error("Failed to fetch mom users:", err.response?.data || err.message);
      setError("Failed to fetch patients");
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      const updatedAppointment = {
        ...newAppointment,
        provider: token ? JSON.parse(atob(token.split('.')[1])).user_id : null,
        status: "pending"
      };

      await axios.post(
        "http://localhost:8000/api/appointments/create/",
        updatedAppointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      fetchAppointments();
      setShowBookingForm(false);
      setNewAppointment({
        user: "",
        provider: "",
        title: "",
        description: "",
        date: "",
        consultation_type: "virtual",
        meeting_link: "",
        notes_for_provider: "",
        status: "pending"
      });
    } catch (err) {
      console.error("Create appointment error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to create appointment");
    }
  };

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    const token = localStorage.getItem("access"); // ✅ Get token from localStorage
  
    if (!token) {
      console.error("❌ No access token found. User might be logged out.");
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:8000/api/appointments/provider/", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Use token here
      });
      
      // More informative logging
      console.log("✅ Successfully fetched appointments:", {
        count: response.data.length,
        appointments: response.data
      });
      
      setAppointments(response.data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };
  

    // ✅ useEffect must be at the top level
    useEffect(() => {
      fetchAppointments();
    }, []); // ✅ No conditional checks
  

  // ✅ Approve Appointment
  const approveAppointment = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) return console.error("No token found.");
  
    try {
      await axios.put(
        `http://localhost:8000/api/appointments/approve/${id}/`, // Updated URL to match backend
        {status: "approved"},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "approved" } : app))
      );
    } catch (error) {
      console.error("Error approving appointment:", error.response?.data || error.message);
    }
  };
  
  
  const rejectAppointment = async (id) => {
    try {
      const token = localStorage.getItem("access"); // Ensure this matches how you store the token
  
      if (!token) {
        console.warn("⚠️ No access token found. Please log in again.");
        return;
      }
  
      await axios.put(
        `http://127.0.0.1:8000/api/appointments/reject/${id}/`,
        {status: "rejected",
        rejection_reason: "Patient requested cancellation"}, // Ensure request body is an empty object
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
      );
    } catch (error) {
      console.error("Error rejecting appointment:", error.response?.data || error.message);
    }
  };
  
  

  // ✅ Reschedule Appointment
  const rescheduleAppointment = async () => {
    if (!rescheduleData.id || !rescheduleData.newDate) {
      console.warn(" Please select a valid date to reschedule.");
      return;
    }
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/appointments/reschedule/${rescheduleData.id}/`,
        { date: rescheduleData.newDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((app) => (app.id === rescheduleData.id ? { ...app, date: rescheduleData.newDate } : app))
      );
      setRescheduleData({ id: null, newDate: "" });
    } catch (error) {
      console.error("Error rescheduling appointment:", error.response?.data || error.message);
    }
  };

  // ✅ Cancel Appointment
  
  const cancelAppointment = async (id) => {
    try {
        const accessToken = localStorage.getItem("access"); // ✅ Ensure correct key name
        if (!accessToken) {
            console.warn("⚠️ No access token found! Please log in again.");
            return;
        }

        await axios.put(
            `http://127.0.0.1:8000/api/appointments/cancel/${id}/`,
            {}, 
            { 
                headers: { 
                    Authorization: `Bearer ${accessToken}` // ✅ Pass token correctly
                } 
            }
        );

        setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: "canceled" } : app))
        );
    } catch (error) {
        console.error("Error canceling appointment:", error.response?.data || error.message);
    }
};


// ✅ DELETE Appointment
const deleteAppointment = async (id) => {
  try {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      console.warn("⚠️ No access token found! Please log in again.");
      return;
    }
    await axios.delete(`http://localhost:8000/api/appointments/delete/${id}/`, {  // Fixed API endpoint
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  } catch (error) {
    console.error("Error deleting appointment:", error.response?.data || error.message);
  }
};

  

  // ✅ Filter & Sort Logic
  const filteredAppointments = appointments
    .filter(app => (filterStatus === "all" ? true : app.status === filterStatus))
    .sort((a, b) => (sortOrder === "upcoming" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)));

  const renderBookingForm = () => (
    <div className="modal">
      <div className="modal-content">
        <h2>Book New Appointment</h2>
        <form onSubmit={handleCreateAppointment}>
          <div className="form-group">
            <label>Select Patient</label>
            <select
              value={newAppointment.user}
              onChange={(e) => setNewAppointment({...newAppointment, user: e.target.value})}
              required
            >
              <option value="">Select Patient</option>
              {momUsers.length > 0 ? (
                momUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email} {/* Display email as the primary identifier */}
                  </option>
                ))
              ) : (
                <option value="" disabled>No patients available</option>
              )}
            </select>
          </div>

          {/* Hidden provider field - automatically set to current provider */}
          <input
            type="hidden"
            value={newAppointment.provider}
          />

          {/* Rest of the form fields remain the same */}
          // ...existing code for other form fields...
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-appointments-container">
      <div className="appointments-header">
        <h1>{t('provider.appointments.title')}</h1>
        <button onClick={() => setShowBookingForm(true)} className="book-appointment-btn">
          Book New Appointment
        </button>
      </div>

      <div className="appointments-filters">
        <label>{t('provider.appointments.filterStatus')}</label>
        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="all">{t('filter.all')}</option>
          <option value="pending">{t('appointment.status.pending')}</option>
          <option value="confirmed">{t('appointment.status.confirmed')}</option>
          <option value="completed">{t('appointment.status.completed')}</option>
          <option value="canceled">{t('appointment.status.canceled')}</option>
        </select>

        <label>{t('provider.appointments.sortDate')}</label>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="upcoming">{t('provider.appointments.upcoming')}</option>
          <option value="past">{t('provider.appointments.past')}</option>
        </select>
      </div>

      {showBookingForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book New Appointment</h2>
            <form onSubmit={handleCreateAppointment}>
              <div className="form-group">
                <label>Select Patient</label>
                <select
                  value={newAppointment.user}
                  onChange={(e) => setNewAppointment({...newAppointment, user: e.target.value})}
                  required
                >
                  <option value="">Select Patient</option>
                  {momUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Title"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                required
              />

              <textarea
                placeholder="Description"
                value={newAppointment.description}
                onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                required
              />

              <input
                type="datetime-local"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                required
              />

              <select
                value={newAppointment.consultation_type}
                onChange={(e) => setNewAppointment({...newAppointment, consultation_type: e.target.value})}
              >
                <option value="virtual">Virtual</option>
                <option value="in_person">In Person</option>
              </select>

              {newAppointment.consultation_type === "virtual" && (
                <input
                  type="url"
                  placeholder="Meeting Link (optional)"
                  value={newAppointment.meeting_link}
                  onChange={(e) => setNewAppointment({...newAppointment, meeting_link: e.target.value})}
                />
              )}

              <div className="form-buttons">
                <button type="submit">Create Appointment</button>
                <button type="button" onClick={() => setShowBookingForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p>{t('provider.appointments.loading')}</p> : null}

      {filteredAppointments.length === 0 ? (
        <p>{t('provider.appointments.noAppointments')}</p>
      ) : (
        <div className="appointments-grid">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <h3>{appointment.title}</h3>
              <div className="appointment-details">
                <p>
                  <strong>{t('provider.appointments.momName')}:</strong> 
                  {appointment.user_email}
                </p>
                <p>
                  <strong>{t('provider.appointments.date')}:</strong> 
                  {new Date(appointment.date).toLocaleString()}
                </p>
                <p>
                  <strong>{t('provider.appointments.status')}:</strong> 
                  <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
                </p>
                <p>
                  <strong>{t('provider.appointments.reason')}:</strong> 
                  {appointment.description}
                </p>
                <p>
                  <strong>{t('provider.appointments.requestedOn')}:</strong> 
                  {new Date(appointment.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="appointment-actions">
                {appointment.status === "pending" && (
                  <>
                    <button onClick={() => approveAppointment(appointment.id)} className="approve-btn">Approve</button>
                    <button onClick={() => rejectAppointment(appointment.id)} className="reject-btn">Reject</button>
                  </>
                )}

                {appointment.status === "confirmed" && (
                  <div className="reschedule-group">
                    <input 
                      type="datetime-local" 
                      onChange={(e) => setRescheduleData({ id: appointment.id, newDate: e.target.value })} 
                    />
                    <button onClick={rescheduleAppointment} className="reschedule-btn">Reschedule</button>
                  </div>
                )}

                {appointment.status !== "completed" && (
                  <button onClick={() => cancelAppointment(appointment.id)} className="cancel-btn">Cancel</button>
                )}
                <button onClick={() => deleteAppointment(appointment.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderAppointments;
