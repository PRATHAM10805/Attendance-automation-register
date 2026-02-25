import React, { useState } from 'react';
import { updateMarks, toggleLock, deleteStudent } from '../api/students';

// Helper: clamp number to [0, max]
const clamp = (val, max) => {
    const n = parseFloat(val);
    return isNaN(n) ? null : Math.min(max, Math.max(0, n));
};

// IAT out of 50 → reduced to 30
const iatReduced = (iat) => {
    if (iat === null || iat === '') return '—';
    return ((iat / 50) * 30).toFixed(2);
};

// Best of IA1, IA2, IA3
const bestIA = (ia1, ia2, ia3) => Math.max(ia1 || 0, ia2 || 0, ia3 || 0);

// Final total
const calcFinal = (m) => {
    if ([m.iat, m.aat1, m.aat2].every(v => v === null)) return '—';
    const iatR = m.iat !== null ? (m.iat / 50) * 30 : 0;
    const aat = (m.aat1 || 0) + (m.aat2 || 0);
    const ia = bestIA(m.ia1, m.ia2, m.ia3);
    const cie = m.cie || 0;
    const lab = m.lab || 0;
    return (iatR + aat + ia + cie + lab).toFixed(2);
};

const MARK_FIELDS = [
    { key: 'iat', label: 'IAT Raw', max: 50, group: 'iat' },
    { key: 'aat1', label: 'AAT1', max: 10, group: 'aat' },
    { key: 'aat2', label: 'AAT2', max: 10, group: 'aat' },
    { key: 'ia1', label: 'IA1', max: 20, group: 'ia' },
    { key: 'ia2', label: 'IA2', max: 20, group: 'ia' },
    { key: 'ia3', label: 'IA3', max: 20, group: 'ia' },
    { key: 'cie', label: 'CIE', max: 50, group: 'cie' },
    { key: 'lab', label: 'Lab', max: 50, group: 'lab' },
];

function MarkInput({ value, max, locked, onChange }) {
    const [draft, setDraft] = useState(value ?? '');

    // Keep in sync when student reloads
    React.useEffect(() => setDraft(value ?? ''), [value]);

    if (locked) return <span>{value ?? '—'}</span>;

    return (
        <input
            type="number"
            min={0}
            max={max}
            value={draft}
            placeholder={`/${max}`}
            onChange={e => {
                setDraft(e.target.value);
                onChange(e.target.value === '' ? null : clamp(e.target.value, max));
            }}
            onBlur={() => {
                // On blur display the clamped value
                setDraft(value ?? '');
            }}
        />
    );
}

export default function MarksTab({ students, setStudents, sheetLocked }) {
    const isLocked = (s) => sheetLocked || s.lockedRow;

    const handleMarkChange = async (student, field, val) => {
        if (isLocked(student)) return;
        const newMarks = { ...student.marks, [field]: val };
        // Optimistic update
        setStudents(prev => prev.map(s => s._id === student._id ? { ...s, marks: newMarks } : s));
        await updateMarks(student._id, newMarks);
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
                        <th className="sticky-col col-sl" rowSpan={2}>Sl.</th>
                        <th className="sticky-col col-usn" rowSpan={2}>USN</th>
                        <th className="sticky-col col-name" rowSpan={2}>Name</th>
                        <th colSpan={2} className="group-header iat-group">IAT</th>
                        <th colSpan={2} className="group-header aat-group">AAT (10M each)</th>
                        <th colSpan={3} className="group-header ia-group">IA Marks</th>
                        <th className="group-header cie-group" rowSpan={2}>CIE<br />(50M)</th>
                        <th className="group-header lab-group" rowSpan={2}>Lab<br />(50M)</th>
                        <th className="group-header final-group" rowSpan={2}>Final<br />Total</th>
                        <th rowSpan={2}>Actions</th>
                    </tr>
                    <tr>
                        <th className="sub-header iat-group">Raw /50</th>
                        <th className="sub-header iat-group">÷30 (auto)</th>
                        <th className="sub-header aat-group">AAT1</th>
                        <th className="sub-header aat-group">AAT2</th>
                        <th className="sub-header ia-group">IA1</th>
                        <th className="sub-header ia-group">IA2</th>
                        <th className="sub-header ia-group">IA3</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, idx) => {
                        const locked = isLocked(s);
                        const m = s.marks || {};
                        return (
                            <tr key={s._id}>
                                <td className="sticky-col col-sl">{idx + 1}</td>
                                <td className="sticky-col col-usn">{s.usn}</td>
                                <td className="sticky-col col-name">{s.name}</td>

                                {/* IAT Raw */}
                                <td className={locked ? 'locked-cell' : ''}>
                                    <MarkInput value={m.iat} max={50} locked={locked}
                                        onChange={val => handleMarkChange(s, 'iat', val)} />
                                </td>
                                {/* IAT ÷30 derived */}
                                <td className="derived">{iatReduced(m.iat)}</td>

                                {/* AAT1, AAT2 */}
                                {['aat1', 'aat2'].map(f => (
                                    <td key={f} className={locked ? 'locked-cell' : ''}>
                                        <MarkInput value={m[f]} max={10} locked={locked}
                                            onChange={val => handleMarkChange(s, f, val)} />
                                    </td>
                                ))}

                                {/* IA1, IA2, IA3 */}
                                {['ia1', 'ia2', 'ia3'].map(f => (
                                    <td key={f} className={locked ? 'locked-cell' : ''}>
                                        <MarkInput value={m[f]} max={20} locked={locked}
                                            onChange={val => handleMarkChange(s, f, val)} />
                                    </td>
                                ))}

                                {/* CIE, Lab */}
                                {['cie', 'lab'].map(f => (
                                    <td key={f} className={locked ? 'locked-cell' : ''}>
                                        <MarkInput value={m[f]} max={50} locked={locked}
                                            onChange={val => handleMarkChange(s, f, val)} />
                                    </td>
                                ))}

                                {/* Final Total */}
                                <td className="final-val">{calcFinal(m)}</td>

                                {/* Actions */}
                                <td>
                                    <div className="row-actions">
                                        <button className={`icon-btn ${s.lockedRow ? 'lock-active' : ''}`}
                                            onClick={() => handleLock(s)} title={s.lockedRow ? 'Unlock' : 'Lock'}>
                                            {s.lockedRow ? '🔒' : '🔓'}
                                        </button>
                                        <button className="icon-btn del" onClick={() => handleDelete(s._id)} title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
