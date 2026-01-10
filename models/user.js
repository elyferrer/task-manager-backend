const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    last_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    first_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    middle_name: {
        type: String,
        required: false,
        maxLength: 100,
        default: null
    },
    nickname: {
        type: String,
        required: false,
        maxLength: 50,
        default: null
    },
    username: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100
    },
    password: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: false
    },
});

module.exports = mongoose.model('User', userSchema);