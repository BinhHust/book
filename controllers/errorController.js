const AppError = require('../utils/AppError');

// 1)
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// 2)
const handleDuplicateFieldsDB = err => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const keys = Object.keys(err.keyValue);
  const values = Object.values(err.keyValue);

  const errmsg = keys
    .map((key, i) => {
      return `${key} - ${values[i]}`;
    })
    .join(', ');

  const message = `Duplicate field value: ${errmsg}. Please use another value!`;
  return new AppError(message, 400);
};

// 3)
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.properties.message);

  const message = `Invalid input data. ${errors.join('\n')}`;
  return new AppError(message, 400);
};

// 4)
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

// 5)
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// For Dev
const handleErrorForDev = (req, res, err) => {
  // Loi throw tu api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // Loi throw tu view
  return res.status(err.statusCode).render('errorPage', {
    title: 'error',
    message: err.message
  });
};

// For Prod
const handleErrorForProd = (req, res, err) => {
  // Loi throw tu api
  if (req.originalUrl.startsWith('/api')) {
    // Loi du doan duoc
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // Loi ko du doan duoc
    return res.status(500).json({
      status: 'error',
      message: 'Somthing went wrong!'
    });
  }

  // Loi throw tu view
  if (err.isOperational) {
    return res.status(err.statusCode).render('errorPage', {
      title: 'error',
      message: err.message
    });
  }

  res.status(err.statusCode).render('errorPage', {
    title: 'error',
    message: 'Please trying again.'
  });
};

const globalErrorHander = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  console.log(err);

  if (process.env.NODE_ENV === 'development') {
    handleErrorForDev(req, res, err);
  } else {
    let error = { ...err };
    // console.log(error.name);
    error.name = err.name;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    handleErrorForProd(req, res, error);
  }
};

module.exports = globalErrorHander;
