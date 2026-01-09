const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

const accessTokenUtil = require('../utils/accessToken');
const refreshTokenUtil = require('../utils/refreshToken');

exports.get = async (req, res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findOne({ _id: id });

        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch the user", details: error.message })
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const userDetails = await User.findOne({ username: username, is_active: true }); 

    if (userDetails) {
        const matched = await bcrypt.compareSync(password, userDetails.password);
        if (!matched) {
            res.sendStatus(401);
        }
    
        const user = { name: username, id: userDetails._id.toString() };

        const accessToken = accessTokenUtil.generateAccessToken(res, user);
        const refreshToken = refreshTokenUtil.generateRefreshToken(res, user);
        
        res.json({ username });
    }

    res.status(404).json({ message: "User not found" });
};

exports.generateNewToken = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const token = await RefreshToken.findOne({ user_id: user._id.toString() });
    const refreshToken = token ? token.token : null;

    if (!refreshToken) return res.sendStatus(403);
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = accessTokenUtil.generateAccessToken(res, { name: user.name, id: user.id });

        res.json({ accessToken });
    });
};

exports.create = async (req, res) => {
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
};

exports.update = async (req, res) => {
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
};

exports.deactivate = async (req, res) => {
    try {
        const id = req.user.id;

        const updatedData = await User.findByIdAndUpdate(id, { is_active: false }, {
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
};

exports.logout = async (req, res) => {
    try {
        const id = req.user.id;

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};