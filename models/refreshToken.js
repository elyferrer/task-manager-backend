const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);