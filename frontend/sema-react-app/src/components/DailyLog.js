import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DailyLog.css';

const DailyLog = () => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    emotional_state: '',
    anxiety_level: '',
    sleep_quality: '',
    social_support: '',
    physical_symptoms: '',
    baby_bonding: '',
    self_care: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://localhost:8000/api/mama/daily-logs/', {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setLogs(Array.isArray(response.data) ? response.data : []);
        setError(null);
      }
    } catch (err) {
      console.error('Error details:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to server. Please ensure the server is running.');
      } else {
        setError('Unable to load previous logs. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(
        'http://localhost:8000/api/mama/daily-logs/',
        newLog,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setNewLog({
          emotional_state: '',
          anxiety_level: '',
          sleep_quality: '',
          social_support: '',
          physical_symptoms: '',
          baby_bonding: '',
          self_care: '',
          notes: ''
        });
        fetchLogs();
        setShowForm(false);
        setError(null);
      }
    } catch (err) {
      console.error('Submit error:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to server. Please ensure the server is running.');
      } else {
        setError('Failed to submit log: ' + (err.response?.data?.detail || 'Please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daily-log-container">
      <h2>My Daily Logs</h2>
      
      <button 
        className="new-log-button" 
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Close Form' : 'New Log'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="log-form">
          <div className="form-group">
            <label>How are you feeling emotionally today?</label>
            <select
              value={newLog.emotional_state}
              onChange={(e) => setNewLog({...newLog, emotional_state: e.target.value})}
              required
            >
              <option value="">Select your emotional state</option>
              <option value="very_happy">Very Happy and Content</option>
              <option value="mostly_good">Mostly Good</option>
              <option value="up_and_down">Up and Down</option>
              <option value="somewhat_low">Somewhat Low</option>
              <option value="very_low">Very Low or Depressed</option>
            </select>
          </div>

          <div className="form-group">
            <label>How anxious or worried do you feel?</label>
            <select
              value={newLog.anxiety_level}
              onChange={(e) => setNewLog({...newLog, anxiety_level: e.target.value})}
              required
            >
              <option value="">Select anxiety level</option>
              <option value="not_anxious">Not anxious at all</option>
              <option value="slightly_anxious">Slightly anxious</option>
              <option value="moderately_anxious">Moderately anxious</option>
              <option value="very_anxious">Very anxious</option>
              <option value="extremely_anxious">Extremely anxious</option>
            </select>
          </div>

          <div className="form-group">
            <label>How well did you sleep last night?</label>
            <select
              value={newLog.sleep_quality}
              onChange={(e) => setNewLog({...newLog, sleep_quality: e.target.value})}
              required
            >
              <option value="">Select sleep quality</option>
              <option value="very_well">Very well (7+ hours)</option>
              <option value="fairly_well">Fairly well (5-6 hours)</option>
              <option value="not_well">Not well (3-4 hours)</option>
              <option value="very_poor">Very poor (0-2 hours)</option>
            </select>
          </div>

          <div className="form-group">
            <label>How supported do you feel by family/friends?</label>
            <select
              value={newLog.social_support}
              onChange={(e) => setNewLog({...newLog, social_support: e.target.value})}
              required
            >
              <option value="">Select support level</option>
              <option value="very_supported">Very well supported</option>
              <option value="somewhat_supported">Somewhat supported</option>
              <option value="little_support">Little support</option>
              <option value="no_support">No support</option>
            </select>
          </div>

          <div className="form-group">
            <label>Are you experiencing any physical symptoms?</label>
            <select
              value={newLog.physical_symptoms}
              onChange={(e) => setNewLog({...newLog, physical_symptoms: e.target.value})}
              required
            >
              <option value="">Select symptoms</option>
              <option value="none">No symptoms</option>
              <option value="mild">Mild discomfort</option>
              <option value="moderate">Moderate pain/discomfort</option>
              <option value="severe">Severe pain/discomfort</option>
            </select>
          </div>

          <div className="form-group">
            <label>How do you feel about your bond with your baby today?</label>
            <select
              value={newLog.baby_bonding}
              onChange={(e) => setNewLog({...newLog, baby_bonding: e.target.value})}
              required
            >
              <option value="">Select bonding level</option>
              <option value="very_strong">Very strong connection</option>
              <option value="good">Good connection</option>
              <option value="neutral">Neutral</option>
              <option value="concerned">Concerned about bonding</option>
              <option value="disconnected">Feeling disconnected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Have you taken time for self-care today?</label>
            <select
              value={newLog.self_care}
              onChange={(e) => setNewLog({...newLog, self_care: e.target.value})}
              required
            >
              <option value="">Select self-care level</option>
              <option value="yes_plenty">Yes, plenty of time</option>
              <option value="yes_some">Yes, some time</option>
              <option value="very_little">Very little time</option>
              <option value="none">No time at all</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Notes or Concerns</label>
            <textarea
              value={newLog.notes}
              onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
              placeholder="Share any other thoughts, feelings, or concerns..."
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Daily Check-In'}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="logs-history">
        <h3>Previous Logs</h3>
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <div className="log-date">{new Date(log.created_at).toLocaleDateString()}</div>
            <div className="log-emotional">Emotional State: {log.emotional_state}</div>
            <div className="log-anxiety">Anxiety Level: {log.anxiety_level}</div>
            <div className="log-sleep">Sleep Quality: {log.sleep_quality}</div>
            <div className="log-support">Social Support: {log.social_support}</div>
            <div className="log-physical">Physical Symptoms: {log.physical_symptoms}</div>
            <div className="log-bonding">Baby Bonding: {log.baby_bonding}</div>
            <div className="log-selfcare">Self-Care: {log.self_care}</div>
            {log.notes && <div className="log-notes">Notes: {log.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyLog;
