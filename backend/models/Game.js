const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    plannedDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    trend: {
        type: Number,
        default: 0
    },
    recommendations: [{
        type: String
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    notes: String,
    lastPlayed: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
