const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/verifyToken/:token').get(authController.verifyToken);

module.exports = router;
