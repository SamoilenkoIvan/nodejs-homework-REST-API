const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decodedToken = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decodedToken.userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = authMiddleware;
