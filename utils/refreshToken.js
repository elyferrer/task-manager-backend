const jwt = require('jsonwebtoken');

const RefreshToken = require('../models/refreshToken');
const User = require('../models/user');

const saveToken = async (data) => {
    const { 
        user_id, 
        token, 
        expires_at
    } = data;

    try {
        const newRefreshToken = new RefreshToken({ user_id, token, expires_at });
        await newRefreshToken.save();
    } catch (error) {
        console.log(error.message);
    }
}

async function getToken (data) {
    const { username } = data;

    const user = await User.findOne({ username: username });
    const token = await RefreshToken.findOne({ user_id: user._id.toString() });

    return token;
}

async function deleteToken (id) {
    return await RefreshToken.findOneAndDelete({ user_id: id });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
    save: saveToken,
    get: getToken,
    generateRefreshToken: generateRefreshToken,
    delete: deleteToken
};