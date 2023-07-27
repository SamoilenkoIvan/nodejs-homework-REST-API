const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userValidation = require('../schemas/userValidation');

const gravatar = require('gravatar');

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

    
    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: 'starter',
      avatarURL, 
    });

    await newUser.save();

    return res.status(201).json({ user: { email, subscription: 'starter' } });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const tmpPath = req.file.path; 
    
    const resizedAvatar = await Jimp.read(tmpPath);
    resizedAvatar.resize(250, 250);

    
    const avatarName = `${req.user._id}-${Date.now()}.png`;
    const avatarPath = path.join(__dirname, '..', 'public', 'avatars', avatarName);
    await resizedAvatar.writeAsync(avatarPath);

    
    await fs.unlink(tmpPath);

    
    const user = await User.findById(req.user._id);
    user.avatarURL = `/avatars/${avatarName}`;
    await user.save();

    return res.status(200).json({ avatarURL: user.avatarURL });
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

module.exports = {
  registerUser,
  updateUserAvatar,
  loginUser,
  logoutUser,
  getCurrentUser,
};

