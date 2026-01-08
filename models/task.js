const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 155
    },
    details: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    finished_date: {
        type: Date,
        default: null
    },
    status: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    },
    created_by: {
        type: String,
        required: false
    },
    updated_by: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Task', taskSchema);