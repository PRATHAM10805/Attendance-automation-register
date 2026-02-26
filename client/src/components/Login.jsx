import React, { useState } from 'react';
import { login } from '../api/auth';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await login({ username, password });
            onLogin(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check server connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-icon">🏛️</span>
                    <h1>DSCE</h1>
                    <p className="college-full-name">Dayananda Sagar College of Engineering</p>
                    <div className="login-divider"></div>
                    <h2 className="login-title">Staff Portal</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Attendance & Marks Management System</p>
                    <p className="version-tag">v2.0 — Secure Access Only</p>
                </div>
            </div>
        </div>
    );
}
