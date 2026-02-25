const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    usn: { type: String, required: true },
    name: { type: String, required: true },
    lockedRow: { type: Boolean, default: false },
    // 7 slots: '' | 'P' | 'A'
    attendance: { type: [String], default: () => Array(7).fill('') },
    marks: {
        iat: { type: Number, default: null },
        aat1: { type: Number, default: null },
        aat2: { type: Number, default: null },
        ia1: { type: Number, default: null },
        ia2: { type: Number, default: null },
        ia3: { type: Number, default: null },
        cie: { type: Number, default: null },
        lab: { type: Number, default: null },
    },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
