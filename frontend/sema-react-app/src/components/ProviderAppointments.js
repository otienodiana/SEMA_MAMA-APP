import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const ProvidersAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("upcoming");
  const [rescheduleData, setRescheduleData] = useState({ id: null, newDate: "" });
  const token = localStorage.getItem("access");

  

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    const token = localStorage.getItem("access"); // ✅ Get token from localStorage
  
    if (!token) {
      console.error("⚠️ No access token found. User might be logged out.");
      return;
    }
  
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/appointments/providers/", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Use token here
      });
      console.log("API Response:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
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
    const token = localStorage.getItem("access"); // ✅ Get token
    if (!token) return console.error("No token found.");
  
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/appointments/${id}/approve/`,
        {status: "approved"},
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Use token
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
    await axios.delete(`http://127.0.0.1:8000/api/appointments/appointments/delete/${id}/`, {
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

  return (
    <div>
      <h2>{t('provider.appointments.title')}</h2>

      <div>
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

      {loading ? <p>{t('provider.appointments.loading')}</p> : null}

      {filteredAppointments.length === 0 ? (
        <p>{t('provider.appointments.noAppointments')}</p>
      ) : (
        <ul>
  {filteredAppointments.map((appointment) => (
    <li key={appointment.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
      <h3>{appointment.title}</h3>
      <p><strong>{t('provider.appointments.momName')}:</strong> {appointment.mom_name}</p>
      <p><strong>{t('provider.appointments.date')}:</strong> {new Date(appointment.date).toLocaleString()}</p>
      <p><strong>{t('provider.appointments.status')}:</strong> {appointment.status}</p>
      <p><strong>{t('provider.appointments.reason')}:</strong> {appointment.description}</p>
      
      {/* ✅ Show the Request Date (created_at) */}
      <p><strong>{t('provider.appointments.requestedOn')}:</strong> {new Date(appointment.created_at).toLocaleDateString()}</p>

      {appointment.status === "pending" && (
        <>
          <button onClick={() => approveAppointment(appointment.id)}>Approve</button>
          <button onClick={() => rejectAppointment(appointment.id)} style={{ color: "red" }}>Reject</button>
        </>
      )}

      {appointment.status === "confirmed" && (
        <>
          <input type="datetime-local" onChange={(e) => setRescheduleData({ id: appointment.id, newDate: e.target.value })} />
          <button onClick={rescheduleAppointment}>Reschedule</button>
        </>
      )}

      {appointment.status !== "completed" && (
        <button onClick={() => cancelAppointment(appointment.id)} style={{ color: "red" }}>Cancel</button>
      )}
      <button onClick={() => deleteAppointment(appointment.id)} style={{ backgroundColor: "red", color: "white" }}>
                Delete
      </button>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default ProvidersAppointments;
