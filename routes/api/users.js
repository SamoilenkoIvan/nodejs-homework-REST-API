const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users');
const authMiddleware = require('../../middlewares/auth');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/logout', authMiddleware, usersController.logoutUser);
router.get('/current', authMiddleware, usersController.getCurrentUser);
router.get('/verify/:verificationToken', usersController.verifyUser);

module.exports = router;

