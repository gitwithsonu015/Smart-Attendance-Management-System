import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QrGenerator from '../components/QrGenerator';
import AttendanceRecords from '../components/AttendanceRecords';
import Report from '../components/Report';

const FacultyDashboard = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, studentsRes] = await Promise.all([
        api.get('/faculty/profile'),
        api.get('/faculty/students')
      ]);
      setProfile(profileRes.data);
      setStudents(studentsRes.data.students || []);
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
    <div className="container-fluid mt-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">Faculty Dashboard</h2>
        <button className="btn btn-outline-danger btn-glow" onClick={() => { logout(); window.location.href = '/'; }}>
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
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'generate-qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate-qr')}
          >
            Generate QR
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            Attendance Records
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Report
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === 'profile' && profile && (
          <div className="card">
            <div className="card-header">
              <h5>Faculty Profile</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Department:</strong> {profile.department}</p>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card">
            <div className="card-header">
              <h5>Students</h5>
            </div>
            <div className="card-body">
              {students.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roll Number</th>
                        <th>Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.rollNumber}</td>
                          <td>{student.class}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No students assigned.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'generate-qr' && (
          <div className="card">
            <div className="card-header">
              <h5>Generate Attendance QR Code</h5>
            </div>
            <div className="card-body">
              <QrGenerator />
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="card">
            <div className="card-header">
              <h5>Attendance Records</h5>
            </div>
            <div className="card-body">
              <AttendanceRecords />
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="card">
            <div className="card-header">
              <h5>Attendance Report</h5>
            </div>
            <div className="card-body">
              <Report />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
