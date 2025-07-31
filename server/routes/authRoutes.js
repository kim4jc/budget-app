//The routes files will take the endpoints defined in the controller and export them to server.jsx where we will use them.
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/checkAuth', authController.checkAuth);

module.exports = router;