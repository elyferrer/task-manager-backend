const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '25s' });
}

function authenticateToken(req, res, nex) {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(token);
        if (err) return res.sendStatus(403);
        req.user = user;
        nex();
    })
};

module.exports = {
    generateAccessToken,
    authenticateToken
}