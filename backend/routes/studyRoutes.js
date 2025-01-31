const express = require('express');
const router = express.Router();
const Study = require('../models/Study');
const { auth } = require('../middleware/auth');

// Get all study plans for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const studies = await Study.find({ user: req.user.id }).sort({ plannedDate: 1 });
        res.json(studies);
    } catch (error) {
        console.error('Error fetching studies:', error);
        res.status(500).json({ message: 'Server error while fetching study plans' });
    }
});

// Add a new study plan
router.post('/', auth, async (req, res) => {
    try {
        const { title, subject, description, plannedDate, duration, status } = req.body;
        
        const newStudy = new Study({
            user: req.user.id,
            title,
            subject,
            description,
            plannedDate,
            duration,
            status: status || 'Not Started'
        });

        const savedStudy = await newStudy.save();
        res.status(201).json(savedStudy);
    } catch (error) {
        console.error('Error creating study plan:', error);
        res.status(400).json({ message: error.message || 'Error creating study plan' });
    }
});

// Update a study plan
router.put('/:id', auth, async (req, res) => {
    try {
        const study = await Study.findOne({ _id: req.params.id, user: req.user.id });
        if (!study) {
            return res.status(404).json({ message: 'Study plan not found' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            study[key] = updates[key];
        });

        await study.save();
        res.json(study);
    } catch (error) {
        console.error('Error updating study plan:', error);
        res.status(400).json({ message: error.message || 'Error updating study plan' });
    }
});

// Delete a study plan
router.delete('/:id', auth, async (req, res) => {
    try {
        const study = await Study.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!study) {
            return res.status(404).json({ message: 'Study plan not found' });
        }
        res.json({ message: 'Study plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting study plan:', error);
        res.status(500).json({ message: 'Server error while deleting study plan' });
    }
});

module.exports = router;
