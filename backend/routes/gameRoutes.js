const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { auth } = require('../middleware/auth');

// Get user's games
router.get('/', auth, async (req, res) => {
    try {
        const games = await Game.find({ user: req.user.id }).sort({ plannedDate: 1 });
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Server error while fetching games' });
    }
});

// Add a new game plan
router.post('/', auth, async (req, res) => {
    try {
        const { title, genre, description, plannedDate, duration, status } = req.body;
        
        const newGame = new Game({
            user: req.user.id,
            title,
            genre,
            description,
            plannedDate,
            duration,
            status: status || 'Not Started'
        });

        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(400).json({ message: error.message || 'Error creating game plan' });
    }
});

// Get user's game recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const games = await Game.find({ user: req.user.id })
            .sort({ rating: -1 })
            .limit(5);
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get trending games (global)
router.get('/trending', async (req, res) => {
    try {
        const trending = await Game.aggregate([
            {
                $group: {
                    _id: '$title',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            },
            { $sort: { count: -1, avgRating: -1 } },
            { $limit: 10 }
        ]);
        res.json(trending);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a game
router.put('/:id', auth, async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id, user: req.user.id });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            game[key] = updates[key];
        });

        await game.save();
        res.json(game);
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(400).json({ message: error.message || 'Error updating game plan' });
    }
});

// Update game status
router.patch('/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id, user: req.user.id });
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['status', 'rating', 'notes', 'lastPlayed'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => {
            game[update] = req.body[update];
        });

        await game.save();
        res.json(game);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete game plan
router.delete('/:id', auth, async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ message: 'Server error while deleting game' });
    }
});

module.exports = router;
