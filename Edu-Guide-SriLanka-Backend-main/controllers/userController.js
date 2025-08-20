const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Sign Up
const signUp = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User Already Exists' });
        }

        // Create new user with PENDING status
        const user = await User.create({
            userName,
            email,
            password,
        });

        res.status(201).json({
            status: 'success',
            message: 'User Registered Successfully !!',
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ status: 'failure', message: 'Server error', error: error.message });
    }
};

// Sign In
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'failure', message: 'User Not Found' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ status: 'failure', message: 'Invalid Credentials' });
        }

        res.status(200).json({
            status: 'success',
            message: 'User Sign-In Successful',
            token: generateToken(user._id),
            userId: user._id,
            userName: user.userName
        });
    } catch (error) {
        res.status(500).json({ status: 'failure', message: 'Server error', error: error.message });
    }
};

module.exports = {signIn, signUp};