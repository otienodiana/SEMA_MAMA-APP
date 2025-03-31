import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear(); // Clear all localStorage items
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login even if there's an error
      navigate('/login', { replace: true });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  // If somehow showConfirm is false, redirect to previous page
  useEffect(() => {
    if (!showConfirm) {
      handleCancel();
    }
  }, [showConfirm]);

  return (
    <div className="logout-container">
      <div className="logout-modal">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="logout-buttons">
          <button onClick={handleLogout} className="logout-btn confirm">
            Yes, Logout
          </button>
          <button onClick={handleCancel} className="logout-btn cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
