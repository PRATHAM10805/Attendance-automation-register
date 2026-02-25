import React from 'react';
import { updateAttendance, toggleLock, deleteStudent } from '../api/students';

const DAYS = 7;

function pct(attendance) {
    const conducted = attendance.filter(v => v !== '').length;
    const present = attendance.filter(v => v === 'P').length;
    if (conducted === 0) return null;
    return ((present / conducted) * 100).toFixed(1);
}

export default function AttendanceTab({ students, setStudents, sheetLocked }) {
    const isLocked = (s) => sheetLocked || s.lockedRow;

    const handleCell = async (student, dayIdx) => {
        if (isLocked(student)) return;
        const next = { '': 'P', 'P': 'A', 'A': '' };
        const newAtt = student.attendance.map((v, i) => i === dayIdx ? next[v] : v);
        // Optimistic update
        setStudents(prev => prev.map(s => s._id === student._id ? { ...s, attendance: newAtt } : s));
        await updateAttendance(student._id, newAtt);
    };

    const handleLock = async (student) => {
        const { data } = await toggleLock(student._id);
        setStudents(prev => prev.map(s => s._id === data._id ? data : s));
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this student?')) return;
        await deleteStudent(id);
        setStudents(prev => prev.filter(s => s._id !== id));
    };

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th className="sticky-col col-sl">Sl.</th>
                        <th className="sticky-col col-usn">USN</th>
                        <th className="sticky-col col-name">Name</th>
                        {Array.from({ length: DAYS }, (_, i) => (
                            <th key={i} style={{ minWidth: 40 }}>Day {i + 1}</th>
                        ))}
                        <th>Conducted</th>
                        <th>Attended</th>
                        <th>%</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, idx) => {
                        const locked = isLocked(s);
                        const p = pct(s.attendance);
                        const pctCls = p === null ? '' : +p >= 75 ? 'pct-high' : +p >= 60 ? 'pct-mid' : 'pct-low';
                        const conducted = s.attendance.filter(v => v !== '').length;
                        const attended = s.attendance.filter(v => v === 'P').length;
                        return (
                            <tr key={s._id}>
                                <td className="sticky-col col-sl">{idx + 1}</td>
                                <td className="sticky-col col-usn">{s.usn}</td>
                                <td className="sticky-col col-name">{s.name}</td>
                                {s.attendance.map((val, d) => (
                                    <td
                                        key={d}
                                        className={`att-cell ${val === 'P' ? 'present' : val === 'A' ? 'absent' : ''}${locked ? ' locked-cell' : ''}`}
                                        onClick={() => handleCell(s, d)}
                                        title={locked ? 'Locked' : 'Click to toggle P/A'}
                                    >
                                        {val}
                                    </td>
                                ))}
                                <td>{conducted}</td>
                                <td>{attended}</td>
                                <td className={`pct-cell ${pctCls}`}>{p !== null ? `${p}%` : '—'}</td>
                                <td>
                                    <div className="row-actions">
                                        <button
                                            className={`icon-btn ${s.lockedRow ? 'lock-active' : ''}`}
                                            onClick={() => handleLock(s)}
                                            title={s.lockedRow ? 'Unlock row' : 'Lock row'}
                                        >
                                            {s.lockedRow ? '🔒' : '🔓'}
                                        </button>
                                        <button className="icon-btn del" onClick={() => handleDelete(s._id)} title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="sticky-col label-cell" style={{ left: 0 }}>Classes Conducted</td>
                        {Array.from({ length: DAYS }, (_, i) => <td key={i}></td>)}
                        <td colSpan={4}></td>
                    </tr>
                    <tr>
                        <td colSpan={3} className="sticky-col label-cell" style={{ left: 0 }}>Initials of Staff</td>
                        {Array.from({ length: DAYS }, (_, i) => <td key={i}></td>)}
                        <td colSpan={4}></td>
                    </tr>
                    <tr>
                        <td colSpan={3} className="sticky-col label-cell" style={{ left: 0 }}>Initials of HOD</td>
                        {Array.from({ length: DAYS }, (_, i) => <td key={i}></td>)}
                        <td colSpan={4}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
