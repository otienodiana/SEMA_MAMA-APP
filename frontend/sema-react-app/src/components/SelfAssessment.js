import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SelfAssessment.css'; // We'll create this next

const SelfAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        setError('Please login to access the assessment');
        setLoading(false);
        return;
      }

      // Updated endpoint URL
      const response = await axios.get(`${BASE_URL}/api/mama/assessment/questions/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setQuestions(response.data);
        setError(null);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      setLoading(false);

    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = 'Failed to fetch questions: ';
      if (!err.response) {
        errorMessage += 'Network error - Please check your connection';
      } else if (err.response.status === 404) {
        errorMessage += 'Assessment questions not found - Please try again later';
      } else if (err.response.status === 401) {
        errorMessage += 'Session expired - Please login again';
        // Optionally redirect to login page
      } else {
        errorMessage += err.response.data?.message || err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    console.log('Response changed:', questionId, value);
    setResponses(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      
      // Fix the submit endpoint URL
      const response = await axios.post(
        'http://localhost:8000/api/mama/assessment/submit/', 
        { responses },
        { headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      console.log('Assessment result:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="self-assessment-container">
      <h2>Postpartum Depression Self-Assessment</h2>
      {questions.length === 0 && !loading && !error && (
        <p>No assessment questions available.</p>
      )}

      <form onSubmit={handleSubmit}>
        {questions.map(question => (
          <div key={question.id} className="question-container">
            <p>{question.question_text}</p>
            <select 
              value={responses[question.id] || ''} 
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              required
              className="assessment-select"
            >
              <option value="">Select an answer</option>
              <option value="0">Never</option>
              <option value="1">Sometimes</option>
              <option value="2">Often</option>
              <option value="3">Always</option>
            </select>
          </div>
        ))}
        {questions.length > 0 && (
          <button type="submit" className="submit-button">Submit Assessment</button>
        )}
      </form>

      {result && (
        <div className="assessment-result">
          <h3>Assessment Result</h3>
          <p className="risk-level">Risk Level: <span className={`risk-${result.risk_level}`}>{result.risk_level}</span></p>
          <p>Total Score: {result.total_score}</p>
          {result.notes && <p className="notes">Notes: {result.notes}</p>}
        </div>
      )}
    </div>
  );
};

export default SelfAssessment;
