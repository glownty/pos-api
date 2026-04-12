const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController.js');
const ratelimit = require('../middlewares/rateLimiter');

router.post('/register', ratelimit , authController.register);
router.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../front/register.html')));

router.post('/login', ratelimit, authController.login);
router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../front/login.html')));

module.exports = router;