const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(cartController.isShopping);

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

router.get('/me', authController.protect, viewController.getAccountPage);

router.get(
  '/shop/:slugShop',
  authController.isLoggedIn,
  viewController.getDetailShopPage
);

router.get('/books', authController.isLoggedIn, viewController.getBooksPage);

router.get(
  '/cart',
  authController.isLoggedIn,
  cartController.getBooksForCart,
  viewController.getCartPage
);

module.exports = router;
