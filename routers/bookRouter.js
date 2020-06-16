const express = require('express');

const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    authController.restrict('manager'),
    bookController.setShopId,
    bookController.createBook
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrict('manager'),
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrict('manager'),
    bookController.deleteBook
  );

module.exports = router;
