const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.isLoggedIn, viewController.getHomePage);

router
  .route('/signup')
  .get(authController.isLoggedIn, viewController.getSignUpPage);

router
  .route('/login')
  .get(authController.isLoggedIn, viewController.getLogInPage);

router
  .route('/verifyEmail/:verifyToken')
  .get(authController.isLoggedIn, viewController.getVerifyEmailPage);

module.exports = router;
