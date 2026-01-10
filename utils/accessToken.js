const jwt = require('jsonwebtoken');

const RefreshToken = require('../models/refreshToken');

function generateAccessToken(res, user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
        sameSite: 'None'
    });

    return accessToken;
}

async function authenticateToken(req, res, next) {
    const httpToken = req.cookies.accessToken;

    jwt.verify(httpToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)  {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (errRef, userRef) => {
                    if (errRef) res.sendStatus(403);
                    generateAccessToken(res, { name: userRef.name, id: userRef.id });
                    req.user = userRef;
                    next();
                })
            } else {
                res.sendStatus(403);
            }
            
        } else {
            req.user = user;
            next();
        }
    })
};

module.exports = {
    generateAccessToken,
    authenticateToken
}