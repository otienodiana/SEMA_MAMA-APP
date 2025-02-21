import React from 'react';
// Add the isMobile import or define it yourself
import { useMediaQuery } from 'react-responsive'; // if using a responsive hook

const Dashboard = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <a href="/dashboard" style={{ color: 'blue' }}>Link 1</a>
        <a href="/settings" style={{ color: 'blue' }}>Link 2</a>
        <a href="/profile" style={{ color: 'blue' }}>Link 3</a>
        <a href="/logout" style={{ color: 'red' }}>Logout</a>
      </div>

      <div className="content">
        {isMobile ? (
          <p>You are on a mobile device</p>
        ) : (
          <p>You are on a desktop device</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
