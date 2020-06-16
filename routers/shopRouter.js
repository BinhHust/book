const express = require('express');

const authController = require('../controllers/authController');
const shopController = require('../controllers/shopController');
const bookRouter = require('./bookRouter');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    authController.restrict('admin'),
    shopController.createShop
  )
  .get(shopController.getAllShop);

router
  .route('/:id')
  .get(shopController.getShop)
  .patch(
    authController.protect,
    authController.restrict('manager'),
    shopController.checkManagerValid,
    shopController.filterBody,
    shopController.updateShop
  );

router.use('/:shopId/books', bookRouter);

module.exports = router;
