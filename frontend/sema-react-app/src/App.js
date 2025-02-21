import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage'; // Import HomePage
import AboutUs from './components/AboutUs'; // Import HomePage
import Dashboard from './components/Dashboard'; // Import HomePage


function App() {
  return (
    <div>
      <h1>Welcome to Sema Mama</h1>
      
      {/* Render the HomePage component */}
      <HomePage />
      
      {/* Render Login and Register components */}
      <Register />
      <Login />
      <AboutUs />
      <Dashboard />
    </div>
  );
}

export default App;
