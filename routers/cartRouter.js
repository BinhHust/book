const express = require('express');

const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/addToCart/:bookId', cartController.addToCart);

module.exports = router;
