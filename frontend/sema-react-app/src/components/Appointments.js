import React, { useState, useEffect } from "react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    status: "scheduled",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  let token = localStorage.getItem("access");

  // ✅ Fetch Appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response = await fetch("http://127.0.0.1:8000/api/appointments/list/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch appointments");

        let data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError("Error loading appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let response = await fetch("http://127.0.0.1:8000/api/appointments/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create appointment");

      let newAppointment = await response.json();
      setAppointments([...appointments, newAppointment]); // Update state
      setFormData({ title: "", description: "", date: "", status: "scheduled" }); // Clear form
    } catch (err) {
      setError("Error creating appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Appointments</h1>
      <p style={styles.description}>Manage and schedule your appointments here.</p>

      {/* 📝 Appointment Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
        ></textarea>

        <label style={styles.label}>Date & Time:</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>

        <button type="submit" style={styles.button} disabled={submitting}>
          {submitting ? "Scheduling..." : "Schedule Appointment"}
        </button>
      </form>

      {/* 📅 Appointments List */}
      {loading ? (
        <p style={styles.loading}>Loading appointments...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.appointmentsList}>
          {appointments.length === 0 ? (
            <p>No appointments yet.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} style={styles.appointmentItem}>
                <strong>{appointment.title}</strong> - {appointment.date} <br />
                <span>Status: {appointment.status}</span>
                <p>{appointment.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// 🎨 Styling
const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    textAlign: "center",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px",
    borderRadius: "5px",
    background: "#f9f9f9",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    height: "80px",
  },
  button: {
    padding: "10px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    color: "#666",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  appointmentsList: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "5px",
    background: "#f5f5f5",
  },
  appointmentItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    marginBottom: "10px",
  },
};

export default Appointments;
