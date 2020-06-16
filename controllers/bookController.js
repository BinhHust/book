const handlerFactory = require('./handlerFactory');
const Book = require('../models/bookModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/AppError');

exports.setShopId = (req, res, next) => {
  if (!req.body.shop) req.body.shop = req.user.shop.id;
  next();
};

exports.createBook = handlerFactory.createOne(Book);
exports.updateBook = handlerFactory.updateOne(Book);
exports.deleteBook = handlerFactory.deleteOne(Book);
exports.getAllBooks = handlerFactory.getAll(Book);
