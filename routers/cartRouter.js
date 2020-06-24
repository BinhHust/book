const express = require('express');

const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/addToCart/:bookId', cartController.addToCart);
router.get('/deleteToCart/:bookId', cartController.deleteToCart);

module.exports = router;
