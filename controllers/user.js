const bcrypt = require('bcrypt');

const User = require('../models/user');

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
            res.status(401).json({ message: "Username or password is incorrect"});
        }
    
        const user = { name: username, id: userDetails._id.toString() };

        const accessToken = accessTokenUtil.generateAccessToken(res, user);
        const refreshToken = refreshTokenUtil.generateRefreshToken(res, user);
        
        res.status(200).json({ username });
    } else {
        res.status(404).json({ message: "User not found" });
    }
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

    const existingUser = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });

    if (existingUser) {
        return res.status(429).json({ message: "Username or email already exists!"});
    }

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

        const currentData = await User.findOne({ _id: req.user.id });
        
        const checkUsername = await User.find({ username: updateData.username });
        const checkEmail = await User.find({ email: updateData.email });

        if (currentData.username != updateData.username && checkUsername.length > 0) {
            return res.status(429).json({ message: "New username already exists."})
        }

        if (currentData.email != updateData.email && checkEmail.length > 0) {
            return res.status(429).json({ message: "New email already exists."})
        }

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
            return res.status(404).json({ message: "User not Found"})
        }

        res.status(201).json({ data: updatedData, message: "User successfully updated!"});
    } catch (error) {
        res.status(500).json({ error: "Unable to update the user", details: error.message })
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.user.id;

        const updatedData = await User.findOneAndDelete({ _id: id }, {
            new: true,
            runValidators: true
        });

        if (!updatedData) {
            return res.status(404).json({ message: "Not Found"})
        }

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ error: "Unable to delete the user", details: error.message })
    }
}

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