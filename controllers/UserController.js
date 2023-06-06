const User = require('../models/User');
const nodemailer = require('nodemailer');
const token = require('../utils/token');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please fill all fields' });
      }

      const foundUser = await User.findOne({ email });

      if (foundUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        apiKey: '',
      });

      newUser.apiKey = token.generateAuthToken(newUser);

      const user = await newUser.save();

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to register user', message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Please provide email and password' });
      }

      const user = await User.findOne({ email });

      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const apiKey = user.apiKey;

      res.json({ message: 'Login successful', apiKey });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to log in', message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Please provide an email' });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ACCOUNT,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      user.apiKey = token.generateAuthToken(user);
      await user.save();

      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: 'Password Reset',
        text: `The API key for your account has been sent: \n` + user.apiKey,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res
            .status(500)
            .json({ error: 'Failed to send password reset email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Password reset email sent' });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to initiate password reset',
        message: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { apiKey, newPassword } = req.body;

      if (!apiKey || !newPassword) {
        return res
          .status(400)
          .json({ error: 'Please provide apiKey and newPassword' });
      }

      const user = await User.findOne({ apiKey });

      if (!user) {
        return res.status(401).json({ error: 'Invalid api key' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to change password', message: error.message });
    }
  },
};

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = UserController;
