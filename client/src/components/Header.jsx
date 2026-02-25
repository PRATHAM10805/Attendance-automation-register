import React, { useEffect, useState } from 'react';

const FIELDS = [
    { key: 'staffName', label: 'Staff Member', placeholder: 'Name of Staff Member' },
    { key: 'semester', label: 'Semester', placeholder: 'e.g. 4th Sem' },
    { key: 'course', label: 'Course', placeholder: 'Subject Name' },
    { key: 'courseCode', label: 'Course Code', placeholder: 'e.g. 22CS401' },
    { key: 'credits', label: 'Credits', placeholder: 'e.g. 4' },
];

const DEFAULTS = { staffName: '', semester: '', course: '', courseCode: '', credits: '' };

export default function Header() {
    const [meta, setMeta] = useState(() => {
        try { return JSON.parse(localStorage.getItem('dsce_meta')) || DEFAULTS; }
        catch { return DEFAULTS; }
    });

    useEffect(() => {
        localStorage.setItem('dsce_meta', JSON.stringify(meta));
    }, [meta]);

    return (
        <header className="app-header">
            <div className="college-brand">
                <span className="brand-icon">🏛️</span>
                <div>
                    <h1 className="college-name">Dayananda Sagar College of Engineering</h1>
                    <p className="college-sub">Attendance &amp; Marks Register — Digital Edition</p>
                </div>
            </div>
            <div className="header-meta">
                {FIELDS.map(f => (
                    <div className="meta-field" key={f.key}>
                        <label>{f.label}</label>
                        <input
                            value={meta[f.key]}
                            placeholder={f.placeholder}
                            onChange={e => setMeta(m => ({ ...m, [f.key]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>
        </header>
    );
}
