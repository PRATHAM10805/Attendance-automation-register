require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/auth', require('./routes/auth'));

// Simple seed for default users (for development)
const Staff = require('./models/Staff');
const seedStaff = async () => {
    const count = await Staff.countDocuments();
    if (count === 0) {
        const defaultStaff = [
            { username: 'admin', password: 'password123', name: 'Admin Staff', department: 'Common' },
            { username: 'teacher1', password: 'password123', name: 'Dr. Smith', department: 'CSE' },
            { username: 'teacher2', password: 'password123', name: 'Prof. Johnson', department: 'ISE' }
        ];
        await Staff.insertMany(defaultStaff);
        console.log('✅ Default staff users created:');
        defaultStaff.forEach(s => console.log(`   - ${s.username} (${s.name})`));
    }
};

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');
        await seedStaff();
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('❌ MongoDB error:', err.message));
