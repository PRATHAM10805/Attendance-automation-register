import React, { useEffect, useRef } from 'react';

export default function AddStudentModal({ onAdd, onClose }) {
    const usnRef = useRef();
    const nameRef = useRef();

    useEffect(() => usnRef.current?.focus(), []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const usn = usnRef.current.value.trim();
        const name = nameRef.current.value.trim();
        if (!usn || !name) return alert('Please fill both fields.');
        onAdd({ usn, name });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>➕ Add Student</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>USN</label>
                        <input ref={usnRef} placeholder="e.g. 1DS22CS001" />
                    </div>
                    <div className="form-row">
                        <label>Full Name</label>
                        <input ref={nameRef} placeholder="Student Full Name" />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">✓ Add</button>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>✕ Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
