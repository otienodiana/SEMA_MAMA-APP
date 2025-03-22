import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Line as LineChart, Bar as BarChart } from 'react-chartjs-2';
import { FaUsers, FaCalendar, FaBook, FaComments } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Add this default data structure
const defaultSummaryData = {
  user_statistics: {
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    user_growth: [0, 0, 0, 0, 0, 0]
  },
  engagement_metrics: {
    total_appointments: 0,
    total_posts: 0,
    total_comments: 0,
    engagement_trends: [0, 0, 0, 0]
  }
};

const Analytics = () => {
  const [summary, setSummary] = useState(defaultSummaryData);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

        // Split the fetches to handle them independently
        try {
          const summaryRes = await fetch(`${API_BASE_URL}/api/analytics/summary/`, {
            method: 'GET',
            headers
          });

          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            setSummary({
              ...defaultSummaryData,
              ...summaryData
            });
          } else {
            console.warn('Summary endpoint failed, using default data');
            setSummary(defaultSummaryData);
          }
        } catch (summaryError) {
          console.error('Summary fetch error:', summaryError);
          setSummary(defaultSummaryData);
        }

        try {
          const detailsRes = await fetch(`${API_BASE_URL}/api/analytics/detail/`, {
            method: 'GET',
            headers
          });

          if (detailsRes.ok) {
            const detailsData = await detailsRes.json();
            setDetails(detailsData);
          } else {
            setDetails({
              recent_users: [],
              recent_appointments: [],
              popular_content: [],
              active_forums: []
            });
          }
        } catch (detailsError) {
          console.error('Details fetch error:', detailsError);
          setDetails({
            recent_users: [],
            recent_appointments: [],
            popular_content: [],
            active_forums: []
          });
        }

      } catch (err) {
        console.error('Analytics Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const exportData = (dateRange) => {
    const data = {
      summary: summary,
      details: details,
      dateRange: dateRange
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${dateRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const prepareChartData = (data, type) => {
    if (type === 'user-growth') {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],  // Default labels
        datasets: [{
          label: 'User Growth',
          data: data || [0, 0, 0, 0, 0, 0],  // Fallback data if none provided
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    }
    
    if (type === 'engagement') {
      return {
        labels: ['Posts', 'Comments', 'Likes', 'Shares'],
        datasets: [{
          label: 'Engagement Metrics',
          data: data || [0, 0, 0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ]
        }]
      };
    }
  };

  const renderUserStatistics = () => (
    <div className="statistics-section">
      <h3>User Statistics</h3>
      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p>{summary.user_statistics.total_users}</p>
        </div>
        <div className="stat-card">
          <h4>Active Users</h4>
          <p>{summary.user_statistics.active_users}</p>
        </div>
        <div className="stat-card">
          <h4>Inactive Users</h4>
          <p>{summary.user_statistics.inactive_users}</p>
        </div>
      </div>
      <LineChart 
        data={prepareChartData(summary?.user_statistics?.user_growth, 'user-growth')}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'User Growth Over Time'
            }
          }
        }}
      />
    </div>
  );

  const renderEngagementMetrics = () => (
    <div className="engagement-section">
      <h3>Engagement Metrics</h3>
      <BarChart 
        data={prepareChartData(summary?.engagement_metrics?.engagement_trends, 'engagement')}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Engagement Overview'
            }
          }
        }}
      />
      <div className="metrics-grid">
        {/* Engagement metrics display */}
      </div>
    </div>
  );

  const renderDetailedMetrics = () => (
    <div className="detailed-metrics">
      <h3>Recent Activities</h3>
      <div className="activity-lists">
        <div className="activity-section">
          <h4>Recent Users</h4>
          <ul>
            {details?.recent_users?.map(user => (
              <li key={user.id}>
                {user.username} - {user.role} - {new Date(user.date_joined).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="activity-section">
          <h4>Recent Appointments</h4>
          <ul>
            {details?.recent_appointments?.map(apt => (
              <li key={apt.id}>
                {apt.user_name} with Dr. {apt.provider_name} - {new Date(apt.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        <div className="activity-section">
          <h4>Popular Content</h4>
          <ul>
            {details?.popular_content?.map(content => (
              <li key={content.id}>
                {content.title} - {content.content_type}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // Modify the render conditions
  if (loading) return <div className="loading-state">Loading analytics...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="analytics-controls">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button onClick={() => exportData(dateRange)}>Export Report</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-details">
            <h3>Users Overview</h3>
            <p>Total: {summary?.user_statistics?.total_users || 0}</p>
            <p>Active: {summary?.user_statistics?.active_users || 0}</p>
            <p>Inactive: {summary?.user_statistics?.inactive_users || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaCalendar className="stat-icon" />
          <div className="stat-details">
            <h3>Appointments</h3>
            <p>Total: {summary?.engagement_metrics?.total_appointments || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaBook className="stat-icon" />
          <div className="stat-details">
            <h3>Content</h3>
            <p>Posts: {summary?.engagement_metrics?.total_posts || 0}</p>
            <p>Comments: {summary?.engagement_metrics?.total_comments || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaComments className="stat-icon" />
          <div className="stat-details">
            <h3>Community</h3>
            <p>Active Forums: {details?.active_forums?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {/* ... other tab buttons */}
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && renderUserStatistics()}
        {activeTab === 'engagement' && renderEngagementMetrics()}
        {activeTab === 'detailed' && renderDetailedMetrics()}
        {/* ... other tab content */}
      </div>
    </div>
  );
};

export default Analytics;
