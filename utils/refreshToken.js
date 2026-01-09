const jwt = require('jsonwebtoken');

const RefreshToken = require('../models/refreshToken');
const User = require('../models/user');

function generateRefreshToken(res, user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'None'
    });

    return refreshToken;
}

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

module.exports = {
    save: saveToken,
    get: getToken,
    generateRefreshToken: generateRefreshToken,
    delete: deleteToken
};