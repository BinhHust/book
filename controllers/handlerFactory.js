const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/APIFeatures');

// virtual populate
// 1) get me - get one
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// 2) setBookUserId - create one
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// 3) setBookUserId - update one
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with id'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// 4) setBookUserId - delete one
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with id'));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

// nested route -> getAll: books/ || /shops/:shopId/books/
// nested route -> getAll: reviews/ || /shops/:shopId/books/:bookId/reviews/
// 5) alias - get all
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // filter cua review la: {shop: ..., book: ...}
    const filter = {};

    const keysParam = Object.keys(req.params); // shopId, bookId
    const keysFilter = keysParam.map(key => `${key.slice(0, -2)}`); // shop, book

    keysParam.forEach((param, i) => {
      const key = keysFilter[i];
      filter[key] = req.params[param];
    });

    //
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        data: docs
      }
    });
  });
