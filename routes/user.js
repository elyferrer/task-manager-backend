const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

const accessTokenUtil = require('../utils/accessToken');
const refreshTokenUtil = require('../utils/refreshToken');

router.get('/', async (req, res) => {
    const users = await User.find({});

    res.json(users)
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // get user
    const userDetails = await User.findOne({ username: username, is_active: true }); 

    if (userDetails) {
        const matched = await bcrypt.compareSync(password, userDetails.password);
        if (!matched) {
            res.sendStatus(401);
        }
    }
    
    const user = { name: username, id: userDetails._id.toString() };

    const accessToken = accessTokenUtil.generateAccessToken(user);
    const refreshToken = refreshTokenUtil.generateRefreshToken(user);
    
    refreshTokenUtil.save({
        user_id: '695f6beb59f1bd69589f44af',
        expires_at: null,
        token: refreshToken
    });

    res.json({ accessToken, refreshToken });
});

router.post('/token', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const token = await RefreshToken.findOne({ user_id: user._id.toString() });
    const refreshToken = token.token;

    if (refreshToken == null) return res.sendStatus(403);
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = accessTokenUtil.generateAccessToken({ name: user.name });
        res.json({ accessToken });
    })
});

router.post('/', async (req, res) => {
    const { 
        last_name, 
        first_name, 
        middle_name, 
        nickname,
        username,
        email,
        password
    } = req.body;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    try {
        const newUser = new User({ 
            last_name, 
            first_name, 
            middle_name, 
            nickname, 
            username, 
            email, 
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/', accessTokenUtil.authenticateToken, async (req, res) => {
    try {
        const id = req.user.id;
        let updateData = req.body;

        if (updateData.password) {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = await bcrypt.hashSync(updateData.password, salt);

            updateData.password = hashedPassword;
        }

        const updatedData = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedData) {
            return res.status(404).json({ message: "Not Found"})
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ error: "Unable to update the user", details: error.message })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChar = await Character.findByIdAndDelete(id);

        if (!deletedChar) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json({ message: "Character deleted successfully", deletedChar });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;