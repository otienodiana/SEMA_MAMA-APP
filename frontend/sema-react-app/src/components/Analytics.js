import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import axios from 'axios';
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

const defaultSummaryData = {
  user_statistics: {
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
  },
  appointment_metrics: {
    total_appointments: 0,
    pending_appointments: 0,
    completed_appointments: 0,
  },
  community_metrics: {
    total_posts: 0,
    total_comments: 0,
    active_forums: 0,
    engagement_rate: 0
  }
};

const Analytics = () => {
  const [summary, setSummary] = useState(defaultSummaryData);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalForums: 0,
    totalPosts: 0,
    activeForums: 0,
    activePosts: 0,
    usersByRole: {},
    appointmentsByStatus: {},
    recentActivity: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('access');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

        const [analyticsResponse, forumsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/analytics/summary/', { headers }),
          axios.get('http://localhost:8000/api/community/stats/', { headers })
        ]);

        console.log('Analytics response:', analyticsResponse.data);
        console.log('Forums response:', forumsResponse.data);

        setSummary({
          ...defaultSummaryData,
          user_statistics: analyticsResponse.data.user_statistics || defaultSummaryData.user_statistics,
          appointment_metrics: analyticsResponse.data.appointment_metrics || defaultSummaryData.appointment_metrics,
          community_metrics: analyticsResponse.data.community_metrics || defaultSummaryData.community_metrics
        });

        setStats(prev => ({
          ...prev,
          totalForums: forumsResponse.data.total_forums || 0,
          activeForums: forumsResponse.data.active_forums || 0,
        }));

      } catch (err) {
        console.error('Analytics Error:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError('Failed to fetch analytics data. Please try again later.');
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
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'User Growth',
          data: data || [0, 0, 0, 0, 0, 0],
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
      </div>
    </div>
  );

  const renderCommunityMetrics = () => (
    <div className="metrics-section">
      <h3>Community Engagement</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <FaComments className="metric-icon" />
          <div className="metric-details">
            <h4>Posts & Comments</h4>
            <p>Total Posts: {summary?.community_metrics?.total_posts}</p>
            <p>Total Comments: {summary?.community_metrics?.total_comments}</p>
            <p>Engagement Rate: {summary?.community_metrics?.engagement_rate}%</p>
          </div>
        </div>
        <div className="metric-card">
          <FaUsers className="metric-icon" />
          <div className="metric-details">
            <h4>Forums</h4>
            <p>Active Forums: {summary?.community_metrics?.active_forums}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentMetrics = () => (
    <div className="metrics-section">
      <h3>Appointment Statistics</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <FaCalendar className="metric-icon" />
          <div className="metric-details">
            <h4>Appointments Overview</h4>
            <p>Total: {summary?.appointment_metrics?.total_appointments}</p>
            <p>Pending: {summary?.appointment_metrics?.pending_appointments}</p>
            <p>Completed: {summary?.appointment_metrics?.completed_appointments}</p>
          </div>
        </div>
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
            <p>Total: {summary?.appointment_metrics?.total_appointments || 0}</p>
            <p>Pending: {summary?.appointment_metrics?.pending_appointments || 0}</p>
            <p>Completed: {summary?.appointment_metrics?.completed_appointments || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaBook className="stat-icon" />
          <div className="stat-details">
            <h3>Content</h3>
            <p>Posts: {summary?.community_metrics?.total_posts || 0}</p>
            <p>Comments: {summary?.community_metrics?.total_comments || 0}</p>
            <p>Engagement Rate: {summary?.community_metrics?.engagement_rate || 0}%</p>
          </div>
        </div>

        <div className="stat-card">
          <FaComments className="stat-icon" />
          <div className="stat-details">
            <h3>Community</h3>
            <p>Active Forums: {summary?.community_metrics?.active_forums || 0}</p>
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
        <button 
          className={activeTab === 'appointments' ? 'active' : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={activeTab === 'community' ? 'active' : ''} 
          onClick={() => setActiveTab('community')}
        >
          Community
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && renderUserStatistics()}
        {activeTab === 'appointments' && renderAppointmentMetrics()}
        {activeTab === 'community' && renderCommunityMetrics()}
        {activeTab === 'engagement' && renderEngagementMetrics()}
        {activeTab === 'detailed' && renderDetailedMetrics()}
      </div>
    </div>
  );
};

export default Analytics;
