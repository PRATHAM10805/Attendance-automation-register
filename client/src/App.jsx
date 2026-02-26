import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import AttendanceTab from './components/AttendanceTab';
import MarksTab from './components/MarksTab';
import AddStudentModal from './components/AddStudentModal';
import Login from './components/Login';
import { getStudents, addStudent } from './api/students';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('staff_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('staff_token'));
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState('attendance');
  const [sheetLocked, setSheetLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. On mount, fetch students if token exists
  useEffect(() => {
    if (token) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      setError('Cannot connect to server. Is MongoDB + backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data) => {
    localStorage.setItem('staff_token', data.token);
    localStorage.setItem('staff_user', JSON.stringify(data.staff));
    setToken(data.token);
    setUser(data.staff);
  };

  const handleLogout = () => {
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_user');
    setToken(null);
    setUser(null);
    setStudents([]);
  };

  const handleAddStudent = async ({ usn, name }) => {
    const { data } = await addStudent({ usn, name });
    setStudents(prev => [...prev, data]);
    setShowModal(false);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Header />

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add Student
          </button>
          <div className="sep" />
          <button
            className={`btn btn-warning ${sheetLocked ? 'unlocked' : ''}`}
            onClick={() => setSheetLocked(l => !l)}
          >
            {sheetLocked ? '🔓 Unlock Sheet' : '🔒 Lock Sheet'}
          </button>
        </div>
        <div className="toolbar-right">
          <span className="stats-pill">
            👤 {user?.name || 'Staff'} | Students: {students.length} | Days: 7
          </span>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print</button>
          <button className="btn btn-danger btn-logout" onClick={handleLogout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'attendance' ? 'active' : ''}`} onClick={() => setTab('attendance')}>
          📅 Attendance
        </button>
        <button className={`tab ${tab === 'marks' ? 'active' : ''}`} onClick={() => setTab('marks')}>
          ⭐ Marks &amp; Assessment
        </button>
      </div>

      {/* Content */}
      <div className="tab-panel">
        {loading && <p className="status-msg">⏳ Loading...</p>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && (
          tab === 'attendance'
            ? <AttendanceTab students={students} setStudents={setStudents} sheetLocked={sheetLocked} />
            : <MarksTab students={students} setStudents={setStudents} sheetLocked={sheetLocked} />
        )}
      </div>

      {/* Legend */}
      <div className="legend">
        <span className="leg-item"><span className="swatch present-sw"></span> Present (P)</span>
        <span className="leg-item"><span className="swatch absent-sw"></span> Absent (A)</span>
        <span className="leg-item"><span className="swatch blank-sw"></span> Not Conducted</span>
        <span className="leg-sep">|</span>
        <span>IA = Internal Assessment &nbsp;|&nbsp; AAT = Alternative Assessment Tool &nbsp;|&nbsp; IAT = Internal Assessment Test</span>
      </div>

      {showModal && (
        <AddStudentModal onAdd={handleAddStudent} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
