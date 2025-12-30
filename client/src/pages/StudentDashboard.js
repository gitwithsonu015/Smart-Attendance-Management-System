import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QrScanner from '../components/QrScanner';

const StudentDashboard = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, analyticsRes] = await Promise.all([
        api.get('/students/profile'),
        api.get('/students/analytics')
      ]);
      setProfile(profileRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={() => { logout(); window.location.href = '/'; }}>
          Logout
        </button>
      </div>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            Mark Attendance
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === 'profile' && profile && (
          <div className="card">
            <div className="card-header">
              <h5>Student Profile</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Roll Number:</strong> {profile.rollNumber}</p>
              <p><strong>Class:</strong> {profile.class}</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="card">
            <div className="card-header">
              <h5>Attendance Analytics</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h4>{analytics.totalClasses}</h4>
                      <p>Total Classes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h4 className="text-success">{analytics.presentClasses}</h4>
                      <p>Present</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h4 className="text-danger">{analytics.absentClasses}</h4>
                      <p>Absent</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h4 className="text-primary">{analytics.attendancePercentage.toFixed(1)}%</h4>
                      <p>Attendance %</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="card">
            <div className="card-header">
              <h5>Mark Attendance</h5>
            </div>
            <div className="card-body">
              <QrScanner onScanSuccess={fetchData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
