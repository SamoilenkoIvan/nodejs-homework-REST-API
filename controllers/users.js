const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userValidation = require('../schemas/userValidation');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = userValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: 'starter',
      avatarURL: gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }), // Generate avatar URL from Gravatar
    });

    await newUser.save();

   
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.status(201).json({ user: { email, subscription: 'starter' } });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    user.verificationToken = null;
    user.verify = true;
    await user.save();

    return res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = userValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h', 
    });

    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    user.token = undefined;
    await user.save();

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    return res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const sendVerificationEmail = (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    
    service: 'Meta',
    auth: {
      user: 'your-email@meta.ua',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@meta.ua',
    to: email,
    subject: 'Email Verification',
    html: `<p>Please click the following link to verify your email:</p>
          <a href="http://localhost:5000/api/users/verify/${verificationToken}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const { error } = Joi.object({ email: Joi.string().email().required() }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'missing required field email' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verify) {
      return res.status(400).json({ message: 'Verification has already been passed' });
    }

    
    sendVerificationEmail(user.email, user.verificationToken);

    return res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  // updateUserAvatar,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyUser,
  resendVerificationEmail,
};

