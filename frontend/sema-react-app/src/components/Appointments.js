import React from 'react';

const Appointments = () => {
  return (
    <div style={styles.container}>
      {/* Left Sidebar - Navigation */}
      

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.header}>Appointments</h1>
        <p style={styles.description}>Manage and schedule your appointments here.</p>

        {/* Placeholder for Appointments List */}
        <div style={styles.appointmentsList}>
          <div style={styles.appointmentItem}>📅 Appointment 1 - Date & Time</div>
          <div style={styles.appointmentItem}>📅 Appointment 2 - Date & Time</div>
          <div style={styles.appointmentItem}>📅 Appointment 3 - Date & Time</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    background: '#2C3E50',
    color: '#ECF0F1',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  navLink: {
    padding: '10px',
    color: '#ECF0F1',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logout: {
    padding: '10px',
    color: 'red',
    textDecoration: 'none',
    fontSize: '16px',
    marginTop: '20px',
  },
  content: {
    flex: 1,
    padding: '20px',
    background: '#F5F5F5',
  },
  header: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  appointmentsList: {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  },
  appointmentItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  }
};

export default Appointments;
