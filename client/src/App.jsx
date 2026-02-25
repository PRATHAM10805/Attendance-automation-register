import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import AttendanceTab from './components/AttendanceTab';
import MarksTab from './components/MarksTab';
import AddStudentModal from './components/AddStudentModal';
import { getStudents, addStudent } from './api/students';

export default function App() {
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState('attendance');
  const [sheetLocked, setSheetLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch students on mount
  useEffect(() => {
    getStudents()
      .then(res => setStudents(res.data))
      .catch(() => setError('Cannot connect to server. Is MongoDB + backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddStudent = async ({ usn, name }) => {
    const { data } = await addStudent({ usn, name });
    setStudents(prev => [...prev, data]);
    setShowModal(false);
  };

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
          <span className="stats-pill">Students: {students.length} | Days: 7</span>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print</button>
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
