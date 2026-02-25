const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST — add student
router.post('/', async (req, res) => {
    try {
        const { usn, name } = req.body;
        const student = await Student.create({ usn, name });
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE — remove student
router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH — update attendance array
router.patch('/:id/attendance', async (req, res) => {
    try {
        const { attendance } = req.body;  // full 7-item array
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { attendance },
            { new: true }
        );
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH — update marks
router.patch('/:id/marks', async (req, res) => {
    try {
        const { marks } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { marks },
            { new: true }
        );
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH — toggle row lock
router.patch('/:id/lock', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        student.lockedRow = !student.lockedRow;
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
