const handlerFactory = require('./handlerFactory');
const Shop = require('../models/shopModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.checkManagerValid = catchAsync(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (req.user.id === shop.manager.id.toString()) {
    return next();
  }
  next(new AppError('You are not authorized to handle this action.', 403));
});

exports.filterBody = (req, res, next) => {
  const allowedFields = ['description', 'name'];
  const obj = {};
  allowedFields.forEach(field => {
    if (req.body[field]) {
      obj[field] = req.body[field];
    }
  });
  req.body = obj;
  next();
};

exports.createShop = handlerFactory.createOne(Shop);
exports.getShop = handlerFactory.getOne(Shop, [
  { path: 'manager' },
  { path: 'books' }
]);
exports.getAllShop = handlerFactory.getAll(Shop);
exports.updateShop = handlerFactory.updateOne(Shop);
