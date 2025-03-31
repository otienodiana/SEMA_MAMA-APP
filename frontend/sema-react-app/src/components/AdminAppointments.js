import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEllipsisV } from 'react-icons/fa';
import "./AdminAppointments.css";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersByRole, setUsersByRole] = useState({
    mom: [],
    healthcare_provider: [],
    admin: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

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

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://localhost:8000/api/appointments/list/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch appointments");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access");
      console.log("Fetching users with token:", token);

      const response = await axios.get("http://localhost:8000/api/users/all/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Users API Response:", response.data);
      
      const userData = response.data.users || response.data;
      
      if (!Array.isArray(userData)) {
        throw new Error('Invalid user data received');
      }

      const grouped = userData.reduce((acc, user) => {
        const role = user.role || 'unknown';
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(user);
        return acc;
      }, {});
      
      console.log("Grouped users:", grouped);
      
      setUsersByRole(grouped);
      setUsers(userData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to fetch users: " + (err.message || "Unknown error"));
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      await axios.post(
        "http://localhost:8000/api/appointments/create/",
        newAppointment,
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
      setError("Failed to create appointment");
    }
  };

  const handleUpdateAppointment = async (appointmentId, updatedData) => {
    try {
      const token = localStorage.getItem("access");
      await axios.put(
        `http://localhost:8000/api/appointments/update/${appointmentId}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (err) {
      setError("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const token = localStorage.getItem("access");
        await axios.delete(
          `http://localhost:8000/api/appointments/delete/${appointmentId}/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchAppointments();
      } catch (err) {
        setError("Failed to delete appointment");
      }
    }
  };

  const handleStatusChange = async (appointmentId, newStatus, reason = "") => {
    try {
      const token = localStorage.getItem("access");
      const endpoint = newStatus === "rejected" 
        ? `http://localhost:8000/api/appointments/provider/reject/${appointmentId}/`
        : `http://localhost:8000/api/appointments/provider/approve/${appointmentId}/`;

      const data = newStatus === "rejected" ? { rejection_reason: reason } : {};

      const response = await axios.put(
        endpoint,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        fetchAppointments();
        alert(`Appointment ${newStatus} successfully`);
      }
    } catch (err) {
      console.error(`Error ${newStatus} appointment:`, err.response?.data);
      setError(err.response?.data?.error || `Failed to ${newStatus} appointment`);
      alert(err.response?.data?.error || `Failed to ${newStatus} appointment`);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-appointments-container">
      <div className="appointments-header">
        <h1>Appointment Management</h1>
        <button onClick={() => setShowBookingForm(true)} className="book-appointment-btn">
          Book New Appointment
        </button>
      </div>

      <div className="appointments-filters">
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Appointments</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {showBookingForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book New Appointment</h2>
            <form onSubmit={handleCreateAppointment}>
              <div className="form-group">
                <label>Select User (Patient)</label>
                {usersByRole.mom?.length > 0 ? (
                  <select
                    value={newAppointment.user}
                    onChange={(e) => setNewAppointment({...newAppointment, user: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {usersByRole.mom?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>No patients available</p>
                )}
              </div>

              <div className="form-group">
                <label>Select Provider</label>
                {usersByRole.healthcare_provider?.length > 0 ? (
                  <select
                    value={newAppointment.provider}
                    onChange={(e) => setNewAppointment({...newAppointment, provider: e.target.value})}
                    required
                  >
                    <option value="">Select Healthcare Provider</option>
                    {usersByRole.healthcare_provider?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>No healthcare providers available</p>
                )}
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
                  placeholder="Meeting Link (optional - paste Zoom, Meet, or other video call link)"
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

      <div className="appointments-list">
        {filteredAppointments.map(appointment => (
          <div key={appointment.id} className={`appointment-card status-${appointment.status}`}>
            <div className="appointment-header">
              <h3>{appointment.title}</h3>
              <span className={`status-badge ${appointment.status}`}>
                {appointment.status.toUpperCase()}
              </span>
            </div>

            <div className="appointment-details">
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
              <p><strong>Description:</strong> {appointment.description}</p>
              <p><strong>Type:</strong> {appointment.consultation_type}</p>
              {appointment.meeting_link && (
                <p><strong>Meeting Link:</strong> <a href={appointment.meeting_link} target="_blank" rel="noopener noreferrer">Join Meeting</a></p>
              )}
            </div>

            <div className="card-actions">
              <button 
                className="menu-dots"
                onClick={() => {
                  setActiveMenu(activeMenu === appointment.id ? null : appointment.id);
                  setSelectedAppointment(appointment);
                }}
              >
                <FaEllipsisV />
              </button>

              {activeMenu === appointment.id && (
                <div className="action-menu">
                  {appointment.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusChange(appointment.id, "approved")}>
                        Approve
                      </button>
                      <button 
                        onClick={() => {
                          const reason = prompt("Please enter rejection reason:");
                          if (reason) handleStatusChange(appointment.id, "rejected", reason);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDeleteAppointment(appointment.id)}>
                    Delete
                  </button>
                  <button onClick={() => setSelectedAppointment(appointment)}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Appointment</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateAppointment(selectedAppointment.id, selectedAppointment);
            }}>
              <input
                type="text"
                value={selectedAppointment.title}
                onChange={(e) => setSelectedAppointment({
                  ...selectedAppointment,
                  title: e.target.value
                })}
                required
              />
              <textarea
                value={selectedAppointment.description}
                onChange={(e) => setSelectedAppointment({
                  ...selectedAppointment,
                  description: e.target.value
                })}
                required
              />
              <input
                type="datetime-local"
                value={selectedAppointment.date}
                onChange={(e) => setSelectedAppointment({
                  ...selectedAppointment,
                  date: e.target.value
                })}
                required
              />
              <div className="form-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setSelectedAppointment(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
